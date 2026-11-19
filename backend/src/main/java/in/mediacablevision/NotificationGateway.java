package in.mediacablevision;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

interface NotificationGateway {
    void send(Notification notification);
}

enum Channel { WHATSAPP, SMS }

record Notification(long id, String reference, RequestKind kind, Channel channel, int attempts,
                    String service, String locality, String phone) {
    String type() {
        return kind == RequestKind.CONNECTION ? "new connection" : "service issue";
    }
}

@ConfigurationProperties("mcv.notifications")
record NotificationSettings(String mode, String recipient, WhatsApp whatsapp, Sms sms) {
    record WhatsApp(String version, String phoneNumberId, String token, String template, String language) {}
    record Sms(String accountSid, String token, String sender) {}
}

@Component
class ConfiguredNotificationGateway implements NotificationGateway {
    private static final Logger log = LoggerFactory.getLogger(ConfiguredNotificationGateway.class);
    private final NotificationSettings settings;
    private final RestClient http;

    ConfiguredNotificationGateway(NotificationSettings settings, RestClient.Builder builder) {
        this.settings = settings;
        validate(settings);
        var client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(4)).build();
        var factory = new JdkClientHttpRequestFactory(client);
        factory.setReadTimeout(Duration.ofSeconds(8));
        this.http = builder.requestFactory(factory).build();
    }

    @Override
    public void send(Notification notice) {
        if ("mock".equals(settings.mode())) {
            log.info("Mock {} notification accepted for {}", notice.channel(), notice.reference());
            return;
        }

        try {
            switch (notice.channel()) {
                case WHATSAPP -> whatsapp(notice);
                case SMS -> sms(notice);
            }
        } catch (RestClientResponseException exception) {
            int status = exception.getStatusCode().value();
            throw new NotificationRejected(status, status == 408 || status == 429 || status >= 500);
        }
    }

    private void whatsapp(Notification notice) {
        var config = settings.whatsapp();
        var parameters = List.of(notice.type(), notice.reference(), notice.service().replace('_', ' '),
                oneLine(notice.locality()), notice.phone())
            .stream().map(value -> Map.of("type", "text", "text", value)).toList();
        var template = Map.of("name", config.template(), "language", Map.of("code", config.language()),
            "components", List.of(Map.of("type", "body", "parameters", parameters)));
        http.post().uri("https://graph.facebook.com/{version}/{number}/messages", config.version(), config.phoneNumberId())
            .headers(headers -> headers.setBearerAuth(config.token()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("messaging_product", "whatsapp", "to", settings.recipient().substring(1),
                "type", "template", "template", template))
            .retrieve().toBodilessEntity();
    }

    private void sms(Notification notice) {
        var config = settings.sms();
        String message = "Media Cable Vision: %s %s. %s, %s. Callback: %s.".formatted(
            notice.type(), notice.reference(), notice.service().replace('_', ' '), oneLine(notice.locality()), notice.phone());
        String senderField = config.sender().startsWith("MG") ? "MessagingServiceSid" : "From";
        String form = "To=" + encode(settings.recipient()) + "&" + senderField + "=" + encode(config.sender())
            + "&Body=" + encode(message);
        http.post().uri("https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json", config.accountSid())
            .headers(headers -> headers.setBasicAuth(config.accountSid(), config.token()))
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(form)
            .retrieve().toBodilessEntity();
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static String oneLine(String value) {
        return value.replaceAll("\\s+", " ");
    }

    private static void validate(NotificationSettings settings) {
        if ("mock".equals(settings.mode())) return;
        var wa = settings.whatsapp();
        var sms = settings.sms();
        if (!"live".equals(settings.mode())
                || !matches(settings.recipient(), "\\+[1-9][0-9]{7,14}")
                || !matches(wa.version(), "v[0-9]+\\.[0-9]+")
                || !matches(wa.phoneNumberId(), "[0-9]+")
                || !matches(wa.template(), "[a-z0-9_]+")
                || !matches(wa.language(), "[a-z]{2,3}(_[A-Z]{2})?")
                || wa.token().isBlank()
                || !matches(sms.accountSid(), "AC[0-9a-fA-F]{32}")
                || !matches(sms.sender(), "MG[0-9a-fA-F]{32}|\\+[1-9][0-9]{7,14}|[A-Za-z0-9 ]{1,11}")
                || sms.token().isBlank()) {
            throw new IllegalStateException("Set a valid notification mode and all provider settings for live mode.");
        }
    }

    private static boolean matches(String value, String pattern) {
        return value != null && !value.isBlank() && value.matches(pattern);
    }

    static class NotificationRejected extends RuntimeException {
        final int status;
        final boolean retryable;

        NotificationRejected(int status, boolean retryable) {
            this.status = status;
            this.retryable = retryable;
        }
    }
}
