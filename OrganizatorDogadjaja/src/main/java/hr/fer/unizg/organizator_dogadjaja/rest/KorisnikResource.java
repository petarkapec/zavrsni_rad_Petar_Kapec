package hr.fer.unizg.organizator_dogadjaja.rest;

import hr.fer.unizg.organizator_dogadjaja.model.KorisnikDTO;
import hr.fer.unizg.organizator_dogadjaja.service.KorisnikService;
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
@RequestMapping(value = "/api/korisniks", produces = MediaType.APPLICATION_JSON_VALUE)
public class KorisnikResource {

    private final KorisnikService korisnikService;

    public KorisnikResource(final KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @GetMapping
    public ResponseEntity<List<KorisnikDTO>> getAllKorisniks() {
        return ResponseEntity.ok(korisnikService.findAll());
    }

    @GetMapping("/{korisnikId}")
    public ResponseEntity<KorisnikDTO> getKorisnik(
            @PathVariable(name = "korisnikId") final Integer korisnikId) {
        return ResponseEntity.ok(korisnikService.get(korisnikId));
    }

    @PostMapping
    public ResponseEntity<Integer> createKorisnik(
            @RequestBody @Valid final KorisnikDTO korisnikDTO) {
        final Integer createdKorisnikId = korisnikService.create(korisnikDTO);
        return new ResponseEntity<>(createdKorisnikId, HttpStatus.CREATED);
    }

    @PutMapping("/{korisnikId}")
    public ResponseEntity<Integer> updateKorisnik(
            @PathVariable(name = "korisnikId") final Integer korisnikId,
            @RequestBody @Valid final KorisnikDTO korisnikDTO) {
        korisnikService.update(korisnikId, korisnikDTO);
        return ResponseEntity.ok(korisnikId);
    }

    @DeleteMapping("/{korisnikId}")
    public ResponseEntity<Void> deleteKorisnik(
            @PathVariable(name = "korisnikId") final Integer korisnikId) {
        final ReferencedWarning referencedWarning = korisnikService.getReferencedWarning(korisnikId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        korisnikService.delete(korisnikId);
        return ResponseEntity.noContent().build();
    }

}
