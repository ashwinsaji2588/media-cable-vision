package in.mediacablevision;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RequestControllerTest {
    private final RequestStore store = mock(RequestStore.class);
    private MockMvc mvc;

    @BeforeEach
    void setup() {
        mvc = MockMvcBuilders.standaloneSetup(new RequestController(store)).build();
    }

    @Test
    void normalizesConnectionAndReturnsReference() throws Exception {
        UUID key = UUID.randomUUID();
        String reference = "MCV-100001";
        when(store.save(RequestKind.CONNECTION, key,
            new RequestData("Test User", "+919876543210", "BOTH", "Nearby Village", "Near the junction")))
            .thenReturn(reference);
        mvc.perform(post("/api/requests/connections").contentType(MediaType.APPLICATION_JSON)
            .header("Idempotency-Key", key).content("""
            {"name":" Test User ","phone":"+91 9876543210","service":"BOTH","locality":"OTHER",
             "otherLocality":" Nearby Village ","details":" Near the junction "}
            """))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.reference").value(reference));
    }

    @Test
    void acceptsCorrectedAndLegacyLocalitySpellings() throws Exception {
        String reference = "MCV-100002";
        var data = new RequestData("Sample", "+919876543210", "CABLE_TV", "Chandanappally", "No signal");
        for (String spelling : new String[] {"Chandanappally", "Chandappally"}) {
            UUID key = UUID.randomUUID();
            when(store.save(RequestKind.ISSUE, key, data)).thenReturn(reference);
            mvc.perform(post("/api/requests/issues").contentType(MediaType.APPLICATION_JSON)
                .header("Idempotency-Key", key).content("""
                {"name":"Sample","phone":"9876543210","service":"CABLE_TV","locality":"%s","details":"No signal"}
                """.formatted(spelling)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.reference").value(reference));
            verify(store).save(RequestKind.ISSUE, key, data);
        }
    }

    @Test
    void issueRequiresOneService() throws Exception {
        mvc.perform(post("/api/requests/issues").contentType(MediaType.APPLICATION_JSON)
            .header("Idempotency-Key", UUID.randomUUID()).content("""
            {"name":"Sample","phone":"9876543210","service":"BOTH","locality":"Angadical","details":"No signal"}
            """))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.service").exists());
        verifyNoInteractions(store);
    }

    @Test
    void otherLocalityRequiresName() throws Exception {
        mvc.perform(post("/api/requests/issues").contentType(MediaType.APPLICATION_JSON)
            .header("Idempotency-Key", UUID.randomUUID()).content("""
            {"name":"Sample","phone":"9876543210","service":"CABLE_TV","locality":"OTHER","details":"No signal"}
            """))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.otherLocality").exists());
        verifyNoInteractions(store);
    }

    @Test
    void invalidMobileNeverReachesPersistence() throws Exception {
        mvc.perform(post("/api/requests/connections").contentType(MediaType.APPLICATION_JSON)
            .header("Idempotency-Key", UUID.randomUUID()).content("""
            {"name":"Sample","phone":"123","service":"BROADBAND","locality":"Chandanappally","details":"Near the junction"}
            """))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.phone").exists());
        verifyNoInteractions(store);
    }
}
