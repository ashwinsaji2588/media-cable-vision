package in.mediacablevision;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpClient;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
record NotificationSettings(String recipient, WhatsApp whatsapp, Sms sms) {
    record WhatsApp(String mode, String version, String phoneNumberId, String token, String template, String language) {}
    record Sms(String mode, String provider, String accountSid, String token, String sender,
               String textbeeApiKey, String textbeeDeviceId) {}
}

@Component
class ConfiguredNotificationGateway implements NotificationGateway {
    private static final Logger log = LoggerFactory.getLogger(ConfiguredNotificationGateway.class);
    private final NotificationSettings settings;
    private final RestClient http;

    @Autowired
    ConfiguredNotificationGateway(NotificationSettings settings, RestClient.Builder builder) {
        this(settings, createClient(builder));
    }

    ConfiguredNotificationGateway(NotificationSettings settings, RestClient http) {
        this.settings = settings;
        this.http = http;
        validate(settings);
    }

    private static RestClient createClient(RestClient.Builder builder) {
        var client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(4)).build();
        var factory = new JdkClientHttpRequestFactory(client);
        factory.setReadTimeout(Duration.ofSeconds(8));
        return builder.requestFactory(factory).build();
    }

    @Override
    public void send(Notification notice) {
        String mode = notice.channel() == Channel.WHATSAPP ? settings.whatsapp().mode() : settings.sms().mode();
        if ("mock".equals(mode)) {
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
        var template = new HashMap<String, Object>();
        template.put("name", config.template());
        template.put("language", Map.of("code", config.language()));
        // Meta's test sender provides a fixed template with no body variables.
        if (!"hello_world".equals(config.template())) {
            var parameters = List.of(notice.type(), notice.reference(), notice.service().replace('_', ' '),
                oneLine(notice.locality()), notice.phone())
                .stream().map(value -> Map.of("type", "text", "text", value)).toList();
            template.put("components", List.of(Map.of("type", "body", "parameters", parameters)));
        }
        http.post().uri("https://graph.facebook.com/{version}/{number}/messages", config.version(), config.phoneNumberId())
            .headers(headers -> headers.setBearerAuth(config.token()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("messaging_product", "whatsapp", "to", settings.recipient().substring(1),
                "type", "template", "template", template))
            .retrieve().toBodilessEntity();
        log.info("WhatsApp accepted notification for {}", notice.reference());
    }

    private void sms(Notification notice) {
        var config = settings.sms();
        String message = "Media Cable Vision: %s %s. %s, %s. Callback: %s.".formatted(
            notice.type(), notice.reference(), notice.service().replace('_', ' '), oneLine(notice.locality()), notice.phone());
        if ("textbee".equals(config.provider())) {
            textbee(notice, config, message);
            return;
        }
        String senderField = config.sender().startsWith("MG") ? "MessagingServiceSid" : "From";
        String form = "To=" + encode(settings.recipient()) + "&" + senderField + "=" + encode(config.sender())
            + "&Body=" + encode(message);
        http.post().uri("https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json", config.accountSid())
            .headers(headers -> headers.setBasicAuth(config.accountSid(), config.token()))
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(form)
            .retrieve().toBodilessEntity();
    }

    private void textbee(Notification notice, NotificationSettings.Sms config, String message) {
        var response = http.post().uri("https://api.textbee.dev/api/v1/gateway/send-sms")
            .header("x-api-key", config.textbeeApiKey())
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("recipients", List.of(settings.recipient()),
                "message", message, "deviceId", config.textbeeDeviceId()))
            .retrieve().body(TextbeeResponse.class);
        if (response == null || response.data() == null || !response.data().success()
                || !matches(response.data().smsBatchId(), "[A-Za-z0-9_-]{1,128}")) {
            throw new NotificationRejected(200, false);
        }
        log.info("TextBee accepted SMS for {}, batch {}", notice.reference(), response.data().smsBatchId());
    }

    record TextbeeResponse(TextbeeBatch data) {}
    record TextbeeBatch(boolean success, String smsBatchId) {}

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static String oneLine(String value) {
        return value.replaceAll("\\s+", " ");
    }

    private static void validate(NotificationSettings settings) {
        var wa = settings.whatsapp();
        var sms = settings.sms();
        if (!matches(wa.mode(), "mock|live") || !matches(sms.mode(), "mock|live")) {
            throw new IllegalStateException("Notification channel modes must be mock or live.");
        }
        boolean liveWhatsApp = "live".equals(wa.mode());
        boolean liveSms = "live".equals(sms.mode());
        if ((liveWhatsApp || liveSms) && !matches(settings.recipient(), "\\+[1-9][0-9]{7,14}")) {
            throw new IllegalStateException("Set NOTIFICATION_RECIPIENT to the operator number in E.164 format.");
        }
        if (liveWhatsApp && (!matches(wa.version(), "v[0-9]+\\.[0-9]+")
                || !matches(wa.phoneNumberId(), "[0-9]+")
                || !matches(wa.template(), "[a-z0-9_]+")
                || !matches(wa.language(), "[a-z]{2,3}(_[A-Z]{2})?")
                || !matches(wa.token(), "\\S+"))) {
            throw new IllegalStateException("Set all WhatsApp credentials and template settings for live WhatsApp.");
        }
        if (!liveSms) return;
        if ("textbee".equals(sms.provider())) {
            if (!matches(sms.textbeeDeviceId(), "[0-9a-fA-F]{24}") || !matches(sms.textbeeApiKey(), "\\S+")) {
                throw new IllegalStateException("Set TEXTBEE_DEVICE_ID and TEXTBEE_API_KEY for live SMS through TextBee.");
            }
        } else if (!"twilio".equals(sms.provider()) || !matches(sms.accountSid(), "AC[0-9a-fA-F]{32}")
                || !matches(sms.sender(), "MG[0-9a-fA-F]{32}|\\+[1-9][0-9]{7,14}|[A-Za-z0-9 ]{1,11}")
                || !matches(sms.token(), "\\S+")) {
            throw new IllegalStateException("Set a supported SMS_PROVIDER and its credentials for live SMS.");
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
