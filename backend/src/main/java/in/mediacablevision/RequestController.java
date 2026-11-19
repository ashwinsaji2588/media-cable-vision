package in.mediacablevision;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
class RequestController {
    private static final String MOBILE_PATTERN = "(?:\\+91 ?)?[6-9][0-9]{9}";
    private final RequestStore store;

    RequestController(RequestStore store) {
        this.store = store;
    }

    @PostMapping(value = "/connections", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    Confirmation connect(@RequestHeader("Idempotency-Key") UUID key, @Valid @RequestBody Intake input) {
        return submit(RequestKind.CONNECTION, key, input);
    }

    @PostMapping(value = "/issues", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    Confirmation report(@RequestHeader("Idempotency-Key") UUID key, @Valid @RequestBody Intake input) {
        return submit(RequestKind.ISSUE, key, input);
    }

    @PostMapping(value = "/lookup", consumes = "application/json")
    ResponseEntity<List<RequestStore.Receipt>> lookup(@Valid @RequestBody Lookup input) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
            .body(store.findReceipts(normalizePhone(input.phone())));
    }

    private Confirmation submit(RequestKind kind, UUID key, Intake input) {
        if (kind == RequestKind.ISSUE && input.service().equals("BOTH")) {
            throw new InvalidRequest("service", "Choose broadband or cable TV for this issue.");
        }
        var locality = input.locality();
        if (locality.equals("OTHER")) {
            if (input.otherLocality() == null || input.otherLocality().isBlank()) {
                throw new InvalidRequest("otherLocality", "Enter your nearby locality.");
            }
            locality = input.otherLocality().strip();
        }
        if (locality.equals("Chandappally")) {
            locality = "Chandanappally";
        }
        var details = input.details().strip();
        if (details.length() < 5) {
            throw new InvalidRequest("details", "Enter at least five characters of request details.");
        }
        String phone = normalizePhone(input.phone());
        var data = new RequestData(input.name().strip(), phone, input.service(), locality, details);
        return new Confirmation(store.save(kind, key, data));
    }

    private static String normalizePhone(String phone) {
        return "+91" + phone.substring(phone.length() - 10);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ErrorResponse invalidFields(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
            errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return new ErrorResponse("Check the information below.", errors);
    }

    @ExceptionHandler(InvalidRequest.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ErrorResponse invalidRequest(InvalidRequest exception) {
        return new ErrorResponse("Check the information below.", Map.of(exception.field, exception.getMessage()));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class,
        org.springframework.web.bind.MissingRequestHeaderException.class,
        org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ErrorResponse malformedRequest() {
        return new ErrorResponse("The request could not be read. Refresh the page and try again.", Map.of());
    }

    @ExceptionHandler(RequestStore.KeyConflict.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    ErrorResponse keyConflict() {
        return new ErrorResponse("This reference was already used for different details. Refresh the page to start a new request.", Map.of());
    }

    record Intake(
        @NotBlank(message = "Enter your full name.")
        @Size(max = 100, message = "Use at most 100 characters for your name.") String name,
        @NotBlank(message = "Enter your mobile number.")
        @Pattern(regexp = MOBILE_PATTERN, message = "Enter a valid Indian mobile number.") String phone,
        @NotBlank(message = "Choose a service.")
        @Pattern(regexp = "BROADBAND|CABLE_TV|BOTH", message = "Choose a valid service.") String service,
        @NotBlank(message = "Choose a locality.")
        @Pattern(regexp = "Angadical|Chandanappally|Chandappally|OTHER", message = "Choose a valid locality.") String locality,
        @Size(max = 120, message = "Use at most 120 characters for your nearby locality.") String otherLocality,
        @NotBlank(message = "Enter your request details.")
        @Size(max = 2000, message = "Use at most 2,000 characters for request details.") String details
    ) {}
    record Lookup(
        @NotBlank(message = "Enter your mobile number.")
        @Pattern(regexp = MOBILE_PATTERN, message = "Enter a valid Indian mobile number.") String phone
    ) {}
    record Confirmation(String reference) {}
    record ErrorResponse(String message, Map<String, String> errors) {}

    private static class InvalidRequest extends RuntimeException {
        final String field;
        InvalidRequest(String field, String message) {
            super(message);
            this.field = field;
        }
    }
}

enum RequestKind { CONNECTION, ISSUE }

record RequestData(String name, String phone, String service, String locality, String details) {}
