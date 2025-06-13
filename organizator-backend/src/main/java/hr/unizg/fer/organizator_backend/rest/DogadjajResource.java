package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.DogadjajDTO;
import hr.unizg.fer.organizator_backend.model.PonudaDTO;
import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.service.DogadjajService;
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
@RequestMapping(value = "/api/dogadjaji", produces = MediaType.APPLICATION_JSON_VALUE)
public class DogadjajResource {

    private final DogadjajService dogadjajService;

    public DogadjajResource(final DogadjajService dogadjajService) {
        this.dogadjajService = dogadjajService;
    }

    @GetMapping
    public ResponseEntity<List<DogadjajDTO>> getAllDogadjajs() {
        return ResponseEntity.ok(dogadjajService.findAll());
    }

    @GetMapping("/{dogadjajId}")
    public ResponseEntity<DogadjajDTO> getDogadjaj(
            @PathVariable(name = "dogadjajId") final Integer dogadjajId) {
        return ResponseEntity.ok(dogadjajService.get(dogadjajId));
    }

    @GetMapping("/svi")
    public ResponseEntity<List<DogadjajDTO>> getAllDogadjaj() {
        return ResponseEntity.ok(dogadjajService.findSvi());
    }


    @PostMapping
    public ResponseEntity<Integer> createDogadjaj(
            @RequestBody @Valid final DogadjajDTO dogadjajDTO) {
        final Integer createdDogadjajId = dogadjajService.create(dogadjajDTO);
        return new ResponseEntity<>(createdDogadjajId, HttpStatus.CREATED);
    }

    @PutMapping("/{dogadjajId}")
    public ResponseEntity<Integer> updateDogadjaj(
            @PathVariable(name = "dogadjajId") final Integer dogadjajId,
            @RequestBody @Valid final DogadjajDTO dogadjajDTO) {
        dogadjajService.update(dogadjajId, dogadjajDTO);
        return ResponseEntity.ok(dogadjajId);
    }

    @DeleteMapping("/{dogadjajId}")
    public ResponseEntity<Void> deleteDogadjaj(
            @PathVariable(name = "dogadjajId") final Integer dogadjajId) {
        final ReferencedWarning referencedWarning = dogadjajService.getReferencedWarning(dogadjajId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        dogadjajService.delete(dogadjajId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{dogadjajId}/ponude")
    public ResponseEntity<List<PonudaDTO>> getDogadjajPonude(
            @PathVariable(name = "dogadjajId") final Integer dogadjajId) {
        return ResponseEntity.ok(dogadjajService.getDogadjajPonude(dogadjajId));
    }

    @GetMapping("/{dogadjajId}/termini")
    public ResponseEntity<List<TerminDTO>> getDogadjajTermini(
            @PathVariable(name = "dogadjajId") final Integer dogadjajId) {
        return ResponseEntity.ok(dogadjajService.getDogadjajTermini(dogadjajId));
    }


}
