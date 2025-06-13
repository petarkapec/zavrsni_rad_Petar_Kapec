package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.service.TerminService;
import hr.unizg.fer.organizator_backend.util.ReferencedException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/termini", produces = MediaType.APPLICATION_JSON_VALUE)
public class TerminResource {

    private final TerminService terminService;

    public TerminResource(final TerminService terminService) {
        this.terminService = terminService;
    }

    @GetMapping
    public ResponseEntity<List<TerminDTO>> getAllTermins() {
        return ResponseEntity.ok(terminService.findAll());
    }

    @GetMapping("/{terminId}")
    public ResponseEntity<TerminDTO> getTermin(
            @PathVariable(name = "terminId") final Integer terminId) {
        return ResponseEntity.ok(terminService.get(terminId));
    }

    @PostMapping
    public ResponseEntity<Integer> createTermin(@RequestBody @Valid final TerminDTO terminDTO) {
        final Integer createdTerminId = terminService.create(terminDTO);
        return new ResponseEntity<>(createdTerminId, HttpStatus.CREATED);
    }

    @PutMapping("/{terminId}")
    public ResponseEntity<Integer> updateTermin(
            @PathVariable(name = "terminId") final Integer terminId,
            @RequestBody @Valid final TerminDTO terminDTO) {
        terminService.update(terminId, terminDTO);
        return ResponseEntity.ok(terminId);
    }

    @DeleteMapping("/{terminId}")
    public ResponseEntity<Void> deleteTermin(
            @PathVariable(name = "terminId") final Integer terminId) {
        final ReferencedWarning referencedWarning = terminService.getReferencedWarning(terminId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        terminService.delete(terminId);
        return ResponseEntity.noContent().build();
    }

}
