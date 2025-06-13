package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.DogadjajDTO;
import hr.unizg.fer.organizator_backend.model.RezervacijaDTO;
import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.service.RezervacijaService;
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
@RequestMapping(value = "/api/rezervacije", produces = MediaType.APPLICATION_JSON_VALUE)
public class RezervacijaResource {

    private final RezervacijaService rezervacijaService;

    public RezervacijaResource(final RezervacijaService rezervacijaService) {
        this.rezervacijaService = rezervacijaService;
    }

    @GetMapping
    public ResponseEntity<List<RezervacijaDTO>> getAllRezervacijas() {
        return ResponseEntity.ok(rezervacijaService.findAll());
    }

    @GetMapping("/{rezervacijaId}")
    public ResponseEntity<RezervacijaDTO> getRezervacija(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId) {
        return ResponseEntity.ok(rezervacijaService.get(rezervacijaId));
    }

    @GetMapping("/{rezervacijaId}/termin")
    public ResponseEntity<TerminDTO> getTerminForRezervacija(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId) {
        return ResponseEntity.ok(rezervacijaService.getTerminByRezervacijaId(rezervacijaId));
    }

    @GetMapping("/{rezervacijaId}/dogadjaj")
    public ResponseEntity<DogadjajDTO> getDogadjajForRezervacija(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId) {
        return ResponseEntity.ok(rezervacijaService.getDogadjajByRezervacijaId(rezervacijaId));
    }

    @PostMapping
    public ResponseEntity<Integer> createRezervacija(
            @RequestBody @Valid final RezervacijaDTO rezervacijaDTO) {
        final Integer createdRezervacijaId = rezervacijaService.create(rezervacijaDTO);
        return new ResponseEntity<>(createdRezervacijaId, HttpStatus.CREATED);
    }

    @PutMapping("/{rezervacijaId}")
    public ResponseEntity<Integer> updateRezervacija(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId,
            @RequestBody @Valid final RezervacijaDTO rezervacijaDTO) {
        rezervacijaService.update(rezervacijaId, rezervacijaDTO);
        return ResponseEntity.ok(rezervacijaId);
    }

    @DeleteMapping("/{rezervacijaId}")
    public ResponseEntity<Void> deleteRezervacija(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId) {
        final ReferencedWarning referencedWarning = rezervacijaService.getReferencedWarning(rezervacijaId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        rezervacijaService.delete(rezervacijaId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{rezervacijaId}/plati")
    public ResponseEntity<Void> platiRezervaciju(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId) {
        rezervacijaService.platiRezervaciju(rezervacijaId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{rezervacijaId}/otkazi")
    public ResponseEntity<Void> otkaziRezervaciju(
            @PathVariable(name = "rezervacijaId") final Integer rezervacijaId) {
        rezervacijaService.otkaziRezervaciju(rezervacijaId);
        return ResponseEntity.ok().build();
    }

}
