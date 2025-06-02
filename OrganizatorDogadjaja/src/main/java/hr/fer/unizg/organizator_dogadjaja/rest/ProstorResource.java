package hr.fer.unizg.organizator_dogadjaja.rest;

import hr.fer.unizg.organizator_dogadjaja.model.ProstorDTO;
import hr.fer.unizg.organizator_dogadjaja.service.ProstorService;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedException;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedWarning;
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
@RequestMapping(value = "/api/prostors", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProstorResource {

    private final ProstorService prostorService;

    public ProstorResource(final ProstorService prostorService) {
        this.prostorService = prostorService;
    }

    @GetMapping
    public ResponseEntity<List<ProstorDTO>> getAllProstors() {
        return ResponseEntity.ok(prostorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProstorDTO> getProstor(@PathVariable(name = "ponudaId") final Long id) {
        return ResponseEntity.ok(prostorService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createProstor(@RequestBody @Valid final ProstorDTO prostorDTO) {
        final Long createdId = prostorService.create(prostorDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateProstor(@PathVariable(name = "ponudaId") final Long id,
            @RequestBody @Valid final ProstorDTO prostorDTO) {
        prostorService.update(id, prostorDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProstor(@PathVariable(name = "ponudaId") final Long id) {
        final ReferencedWarning referencedWarning = prostorService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        prostorService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
