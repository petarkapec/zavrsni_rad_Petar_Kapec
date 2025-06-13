package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.GostDTO;
import hr.unizg.fer.organizator_backend.service.GostService;
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
@RequestMapping(value = "/api/gosti", produces = MediaType.APPLICATION_JSON_VALUE)
public class GostResource {

    private final GostService gostService;

    public GostResource(final GostService gostService) {
        this.gostService = gostService;
    }

    @GetMapping
    public ResponseEntity<List<GostDTO>> getAllGosts() {
        return ResponseEntity.ok(gostService.findAll());
    }

    @GetMapping("/{gostId}")
    public ResponseEntity<GostDTO> getGost(@PathVariable(name = "gostId") final Integer gostId) {
        return ResponseEntity.ok(gostService.get(gostId));
    }

    @PostMapping
    public ResponseEntity<Integer> createGost(@RequestBody @Valid final GostDTO gostDTO) {
        final Integer createdGostId = gostService.create(gostDTO);
        return new ResponseEntity<>(createdGostId, HttpStatus.CREATED);
    }

    @PutMapping("/{gostId}")
    public ResponseEntity<Integer> updateGost(@PathVariable(name = "gostId") final Integer gostId,
            @RequestBody @Valid final GostDTO gostDTO) {
        gostService.update(gostId, gostDTO);
        return ResponseEntity.ok(gostId);
    }

    @DeleteMapping("/{gostId}")
    public ResponseEntity<Void> deleteGost(@PathVariable(name = "gostId") final Integer gostId) {
        gostService.delete(gostId);
        return ResponseEntity.noContent().build();
    }

}
