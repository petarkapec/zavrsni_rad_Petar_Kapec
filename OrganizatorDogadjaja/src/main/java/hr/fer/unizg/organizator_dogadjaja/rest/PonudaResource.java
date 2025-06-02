package hr.fer.unizg.organizator_dogadjaja.rest;

import hr.fer.unizg.organizator_dogadjaja.model.PonudaDTO;
import hr.fer.unizg.organizator_dogadjaja.service.PonudaService;
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
@RequestMapping(value = "/api/ponudas", produces = MediaType.APPLICATION_JSON_VALUE)
public class PonudaResource {

    private final PonudaService ponudaService;

    public PonudaResource(final PonudaService ponudaService) {
        this.ponudaService = ponudaService;
    }

    @GetMapping
    public ResponseEntity<List<PonudaDTO>> getAllPonudas() {
        return ResponseEntity.ok(ponudaService.findAll());
    }

    @GetMapping("/{ponudaId}")
    public ResponseEntity<PonudaDTO> getPonuda(
            @PathVariable(name = "ponudaId") final Integer ponudaId) {
        return ResponseEntity.ok(ponudaService.get(ponudaId));
    }

    @PostMapping
    public ResponseEntity<Integer> createPonuda(@RequestBody @Valid final PonudaDTO ponudaDTO) {
        final Integer createdPonudaId = ponudaService.create(ponudaDTO);
        return new ResponseEntity<>(createdPonudaId, HttpStatus.CREATED);
    }

    @PutMapping("/{ponudaId}")
    public ResponseEntity<Integer> updatePonuda(
            @PathVariable(name = "ponudaId") final Integer ponudaId,
            @RequestBody @Valid final PonudaDTO ponudaDTO) {
        ponudaService.update(ponudaId, ponudaDTO);
        return ResponseEntity.ok(ponudaId);
    }

    @DeleteMapping("/{ponudaId}")
    public ResponseEntity<Void> deletePonuda(
            @PathVariable(name = "ponudaId") final Integer ponudaId) {
        final ReferencedWarning referencedWarning = ponudaService.getReferencedWarning(ponudaId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        ponudaService.delete(ponudaId);
        return ResponseEntity.noContent().build();
    }

}
