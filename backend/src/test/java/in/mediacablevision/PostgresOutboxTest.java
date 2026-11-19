package in.mediacablevision;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.ResourceAccessException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@EnabledIfEnvironmentVariable(named = "MCV_RUN_POSTGRES_TESTS", matches = "true")
@SpringBootTest(properties = "mcv.notifications.interval-ms=3600000")
@Transactional
class PostgresOutboxTest {
    @Autowired RequestStore store;
    @Autowired OutboxWorker worker;
    @Autowired JdbcClient jdbc;
    @MockitoBean NotificationGateway gateway;

    @Test
    void persistsOnceAndQueuesEachChannel() {
        UUID key = UUID.randomUUID();
        var intake = new RequestData("Test User", "+919876543210", "BOTH", "Angadical", "A test landmark");
        String reference = store.save(RequestKind.CONNECTION, key, intake);
        assertThat(store.save(RequestKind.CONNECTION, key, intake)).isEqualTo(reference);
        assertThat(store.findReceipts(intake.phone())).extracting(RequestStore.Receipt::reference)
            .containsExactly(reference);
        assertThat(store.findReceipts("+919876543211")).isEmpty();
        assertThat(jdbc.sql("SELECT channel FROM notification_outbox WHERE request_id = ?")
            .param(requestId(reference)).query(String.class).list()).containsExactlyInAnyOrder("SMS", "WHATSAPP");
        assertThatThrownBy(() -> store.save(RequestKind.CONNECTION, key,
            new RequestData("Different", intake.phone(), intake.service(), intake.locality(), intake.details())))
            .isInstanceOf(RequestStore.KeyConflict.class);
    }

    @Test
    void retriesTransportFailureAndMarksProviderAcceptance() {
        String reference = store.save(RequestKind.ISSUE, UUID.randomUUID(),
            new RequestData("Test User", "+919876543210", "BROADBAND", "Chandanappally", "No signal"));
        UUID request = requestId(reference);
        doThrow(new ResourceAccessException("synthetic timeout")).doNothing().when(gateway).send(any());

        worker.sendNext();
        assertThat(jdbc.sql("""
            SELECT count(*) FROM notification_outbox
            WHERE request_id = ? AND status = 'PENDING' AND attempts = 1 AND next_attempt_at > now()
            """).param(request).query(Integer.class).single()).isEqualTo(1);
        worker.sendNext();
        assertThat(jdbc.sql("SELECT count(*) FROM notification_outbox WHERE request_id = ? AND status = 'SENT'")
            .param(request).query(Integer.class).single()).isEqualTo(1);
        verify(gateway, times(2)).send(argThat(notice -> notice.reference().equals(reference)));
    }

    private UUID requestId(String reference) {
        long number = Long.parseLong(reference.substring("MCV-".length()));
        return jdbc.sql("SELECT id FROM service_request WHERE reference_number = ?")
            .param(number).query(UUID.class).single();
    }
}
