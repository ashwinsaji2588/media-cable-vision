package in.mediacablevision;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class NotificationGatewayTest {
    private static final String RECIPIENT = "+919111111111";
    private static final String DEVICE_ID = "664a9b8cd0e1f2a3b4c5d6e7";
    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();

    @Test
    void textbeeUsesTheRegisteredDeviceAndOnlySendsToTheOperator() {
        server.expect(requestTo("https://api.textbee.dev/api/v1/gateway/send-sms"))
            .andExpect(method(HttpMethod.POST))
            .andExpect(header("x-api-key", "test-textbee-key"))
            .andExpect(jsonPath("$.recipients[0]").value(RECIPIENT))
            .andExpect(jsonPath("$.recipients.length()").value(1))
            .andExpect(jsonPath("$.deviceId").value(DEVICE_ID))
            .andExpect(jsonPath("$.message").value(
                "Media Cable Vision: new connection MCV-100001. CABLE TV, Angadical. Callback: +919876543210."))
            .andRespond(withSuccess("""
                {"data":{"success":true,"smsBatchId":"batch-123"}}
                """, MediaType.APPLICATION_JSON));
        var gateway = gateway("mock", "live");
        gateway.send(notice(Channel.WHATSAPP));
        gateway.send(notice(Channel.SMS));
        server.verify();
    }

    @Test
    void whatsappSendsTheFiveTemplateParametersWhileSmsIsMocked() {
        server.expect(requestTo("https://graph.facebook.com/v27.0/123456/messages"))
            .andExpect(header("Authorization", "Bearer test-meta-token"))
            .andExpect(jsonPath("$.to").value("919111111111"))
            .andExpect(jsonPath("$.template.name").value("mcv_request_alert"))
            .andExpect(jsonPath("$.template.components[0].parameters[*].text").value(
                org.hamcrest.Matchers.contains("new connection", "MCV-100001", "CABLE TV", "Angadical", "+919876543210")))
            .andRespond(withSuccess());
        var gateway = gateway("live", "mock");
        gateway.send(notice(Channel.SMS));
        gateway.send(notice(Channel.WHATSAPP));
        server.verify();
    }

    @Test
    void whatsappSampleTemplateOmitsCustomAlertParameters() {
        server.expect(requestTo("https://graph.facebook.com/v27.0/123456/messages"))
            .andExpect(jsonPath("$.template.name").value("hello_world"))
            .andExpect(jsonPath("$.template.language.code").value("en_US"))
            .andExpect(jsonPath("$.template.components").doesNotExist())
            .andRespond(withSuccess());
        var whatsapp = new NotificationSettings.WhatsApp(
            "live", "v27.0", "123456", "test-meta-token", "hello_world", "en_US");
        var sms = new NotificationSettings.Sms("mock", "textbee", "", "", "", "", "");
        var gateway = new ConfiguredNotificationGateway(new NotificationSettings(RECIPIENT, whatsapp, sms), builder.build());
        gateway.send(notice(Channel.WHATSAPP));
        server.verify();
    }

    @Test
    void textbeeMustReturnAnAcceptedBatch() {
        server.expect(requestTo("https://api.textbee.dev/api/v1/gateway/send-sms"))
            .andRespond(withSuccess("""
                {"data":{"success":false}}
                """, MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> gateway("mock", "live").send(notice(Channel.SMS)))
            .isInstanceOf(ConfiguredNotificationGateway.NotificationRejected.class);
        server.verify();
    }

    private ConfiguredNotificationGateway gateway(String whatsappMode, String smsMode) {
        var whatsapp = new NotificationSettings.WhatsApp(
            whatsappMode, "v27.0", "123456", "test-meta-token", "mcv_request_alert", "en");
        var sms = new NotificationSettings.Sms(smsMode, "textbee", "", "", "", "test-textbee-key", DEVICE_ID);
        return new ConfiguredNotificationGateway(new NotificationSettings(RECIPIENT, whatsapp, sms), builder.build());
    }

    private Notification notice(Channel channel) {
        return new Notification(1, "MCV-100001", RequestKind.CONNECTION, channel, 0,
            "CABLE_TV", "Angadical", "+919876543210");
    }
}
