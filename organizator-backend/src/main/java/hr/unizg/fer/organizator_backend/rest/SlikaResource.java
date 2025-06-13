package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.SlikaDTO;
import hr.unizg.fer.organizator_backend.service.SlikaService;
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
@RequestMapping(value = "/api/slike", produces = MediaType.APPLICATION_JSON_VALUE)
public class SlikaResource {

    private final SlikaService slikaService;

    public SlikaResource(final SlikaService slikaService) {
        this.slikaService = slikaService;
    }

    @GetMapping
    public ResponseEntity<List<SlikaDTO>> getAllSlikas() {
        return ResponseEntity.ok(slikaService.findAll());
    }

    @GetMapping("/{slikaId}")
    public ResponseEntity<SlikaDTO> getSlika(
            @PathVariable(name = "slikaId") final Integer slikaId) {
        return ResponseEntity.ok(slikaService.get(slikaId));
    }

    @PostMapping
    public ResponseEntity<Integer> createSlika(@RequestBody @Valid final SlikaDTO slikaDTO) {
        final Integer createdSlikaId = slikaService.create(slikaDTO);
        return new ResponseEntity<>(createdSlikaId, HttpStatus.CREATED);
    }

    @PutMapping("/{slikaId}")
    public ResponseEntity<Integer> updateSlika(
            @PathVariable(name = "slikaId") final Integer slikaId,
            @RequestBody @Valid final SlikaDTO slikaDTO) {
        slikaService.update(slikaId, slikaDTO);
        return ResponseEntity.ok(slikaId);
    }

    @DeleteMapping("/{slikaId}")
    public ResponseEntity<Void> deleteSlika(@PathVariable(name = "slikaId") final Integer slikaId) {
        slikaService.delete(slikaId);
        return ResponseEntity.noContent().build();
    }

}
