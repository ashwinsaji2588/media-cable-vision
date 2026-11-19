package in.mediacablevision;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class RequestStore {
    private final JdbcClient jdbc;

    RequestStore(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public String save(RequestKind kind, UUID key, RequestData data) {
        UUID id = UUID.randomUUID();
        var inserted = jdbc.sql("""
            INSERT INTO service_request (id, kind, idempotency_key, name, phone, service, locality, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (kind, idempotency_key) DO NOTHING
            RETURNING reference_number
            """).params(id, kind.name(), key, data.name(), data.phone(), data.service(), data.locality(), data.details())
            .query(Long.class).optional();
        if (inserted.isEmpty()) {
            // PostgreSQL waits for the winning insert before reporting the conflict.
            return jdbc.sql("""
                SELECT reference_number, name, phone, service, locality, details
                FROM service_request WHERE kind = ? AND idempotency_key = ?
                """).params(kind.name(), key).query((rs, row) -> {
                    var original = new RequestData(rs.getString("name"), rs.getString("phone"),
                        rs.getString("service"), rs.getString("locality"), rs.getString("details"));
                    if (!original.equals(data)) throw new KeyConflict();
                    return reference(rs.getLong("reference_number"));
                }).single();
        }
        jdbc.sql("""
            INSERT INTO notification_outbox (request_id, channel) VALUES (?, 'WHATSAPP'), (?, 'SMS')
            """).params(id, id).update();
        return reference(inserted.get());
    }

    List<Receipt> findReceipts(String phone) {
        return jdbc.sql("""
            SELECT reference_number, kind, (created_at AT TIME ZONE 'Asia/Kolkata')::date AS received_on
            FROM service_request WHERE phone = ?
            ORDER BY created_at DESC, reference_number DESC LIMIT 20
            """).param(phone).query((rs, row) -> new Receipt(reference(rs.getLong("reference_number")),
                RequestKind.valueOf(rs.getString("kind")), rs.getObject("received_on", LocalDate.class),
                "RECEIVED")).list();
    }

    static String reference(long number) {
        return "MCV-" + number;
    }

    record Receipt(String reference, RequestKind kind, LocalDate receivedOn, String status) {}
    static class KeyConflict extends RuntimeException {}
}
