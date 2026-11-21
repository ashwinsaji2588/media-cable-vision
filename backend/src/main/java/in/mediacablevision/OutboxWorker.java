package in.mediacablevision;

import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;

@Component
class OutboxWorker {
    private static final Logger log = LoggerFactory.getLogger(OutboxWorker.class);
    private static final int MAX_ATTEMPTS = 5;
    private final JdbcClient jdbc;
    private final NotificationGateway gateway;

    OutboxWorker(JdbcClient jdbc, NotificationGateway gateway) {
        this.jdbc = jdbc;
        this.gateway = gateway;
    }

    @Scheduled(fixedDelayString = "${mcv.notifications.interval-ms}", initialDelayString = "${mcv.notifications.interval-ms}")
    @Transactional
    public void sendNext() {
        // Hold the row lock through the bounded provider call so only one worker sends this job at a time.
        jdbc.sql("""
            SELECT o.id, o.channel, o.attempts, r.reference_number, r.kind, r.service, r.locality, r.phone
            FROM notification_outbox o JOIN service_request r ON r.id = o.request_id
            WHERE o.status = 'PENDING' AND o.next_attempt_at <= now()
            ORDER BY o.next_attempt_at, o.id LIMIT 1 FOR UPDATE OF o SKIP LOCKED
            """).query((rs, index) -> new Notification(rs.getLong("id"), RequestStore.reference(rs.getLong("reference_number")),
                RequestKind.valueOf(rs.getString("kind")), Channel.valueOf(rs.getString("channel")),
                rs.getInt("attempts"), rs.getString("service"), rs.getString("locality"), rs.getString("phone")))
            .optional().ifPresent(this::deliver);
    }

    private void deliver(Notification notice) {
        try {
            gateway.send(notice);
        } catch (ConfiguredNotificationGateway.NotificationRejected rejected) {
            failure(notice, rejected.retryable, "HTTP " + rejected.status);
            return;
        } catch (RestClientException exception) {
            failure(notice, true, "provider transport error");
            return;
        }
        complete(notice.id(), "SENT");
    }

    private void failure(Notification notice, boolean retryable, String reason) {
        int attempts = notice.attempts() + 1;
        if (!retryable || attempts >= MAX_ATTEMPTS) {
            complete(notice.id(), "FAILED");
            log.error("{} notification for {} failed on attempt {} ({})",
                notice.channel(), notice.reference(), attempts, reason);
            return;
        }

        long delay = Duration.ofSeconds(30).multipliedBy(1L << (attempts - 1)).toSeconds();
        jdbc.sql("""
            UPDATE notification_outbox
            SET attempts = ?, next_attempt_at = clock_timestamp() + (? * interval '1 second')
            WHERE id = ?
            """).params(attempts, delay, notice.id()).update();
        log.warn("{} notification for {} will retry after {} seconds ({})",
            notice.channel(), notice.reference(), delay, reason);
    }

    private void complete(long id, String status) {
        jdbc.sql("""
            UPDATE notification_outbox SET status = ?, attempts = attempts + 1, completed_at = clock_timestamp()
            WHERE id = ?
            """).params(status, id).update();
    }
}
