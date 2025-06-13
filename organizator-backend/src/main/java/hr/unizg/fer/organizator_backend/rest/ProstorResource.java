package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.ProstorDTO;
import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.service.ProstorService;
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
@RequestMapping(value = "/api/prostori", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProstorResource {

    private final ProstorService prostorService;

    public ProstorResource(final ProstorService prostorService) {
        this.prostorService = prostorService;
    }

    @GetMapping
    public ResponseEntity<List<ProstorDTO>> getAllProstors() {
        return ResponseEntity.ok(prostorService.findAll());
    }

    @GetMapping("/{prostorId}")
    public ResponseEntity<ProstorDTO> getProstor(
            @PathVariable(name = "prostorId") final Integer prostorId) {
        return ResponseEntity.ok(prostorService.get(prostorId));
    }

    @PostMapping
    public ResponseEntity<Integer> createProstor(@RequestBody @Valid final ProstorDTO prostorDTO) {
        final Integer createdProstorId = prostorService.create(prostorDTO);
        return new ResponseEntity<>(createdProstorId, HttpStatus.CREATED);
    }

    @GetMapping("/{prostorId}/termini")
    public ResponseEntity<List<TerminDTO>> getProstorTermini(
            @PathVariable(name = "prostorId") final Integer prostorId) {
        return ResponseEntity.ok(prostorService.getProstorTermini(prostorId));
    }

    @PutMapping("/{prostorId}/termini")
    public ResponseEntity<List<TerminDTO>> setProstorTermini(
            @PathVariable(name = "prostorId") final Integer prostorId,
            @RequestBody @Valid final List<TerminDTO> termini) {
        return ResponseEntity.ok(prostorService.setProstorTermini(prostorId, termini));
    }

    @PostMapping("/{prostorId}/termini")
    public ResponseEntity<TerminDTO> addProstorTermin(
            @PathVariable(name = "prostorId") final Integer prostorId,
            @RequestBody @Valid final TerminDTO termin) {
        return ResponseEntity.ok(prostorService.addProstorTermin(prostorId, termin));
    }

    @DeleteMapping("/{prostorId}/termini/{terminId}")
    public ResponseEntity<Void> deleteProstorTermin(
            @PathVariable(name = "prostorId") final Integer prostorId,
            @PathVariable(name = "terminId") final Integer terminId) {
        prostorService.deleteProstorTermin(prostorId, terminId);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{prostorId}")
    public ResponseEntity<Integer> updateProstor(
            @PathVariable(name = "prostorId") final Integer prostorId,
            @RequestBody @Valid final ProstorDTO prostorDTO) {
        prostorService.update(prostorId, prostorDTO);
        return ResponseEntity.ok(prostorId);
    }

    @DeleteMapping("/{prostorId}")
    public ResponseEntity<Void> deleteProstor(
            @PathVariable(name = "prostorId") final Integer prostorId) {
        final ReferencedWarning referencedWarning = prostorService.getReferencedWarning(prostorId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        prostorService.delete(prostorId);
        return ResponseEntity.noContent().build();
    }

}
