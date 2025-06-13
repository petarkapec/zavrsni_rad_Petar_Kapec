package hr.unizg.fer.organizator_backend.rest;

import hr.unizg.fer.organizator_backend.model.*;
import hr.unizg.fer.organizator_backend.service.GostService;
import hr.unizg.fer.organizator_backend.service.KorisnikService;
import hr.unizg.fer.organizator_backend.util.ReferencedException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/korisnici", produces = MediaType.APPLICATION_JSON_VALUE)
public class KorisnikResource {

    private final KorisnikService korisnikService;
    private final GostService gostService;

    public KorisnikResource(final KorisnikService korisnikService, GostService gostService) {
        this.korisnikService = korisnikService;
        this.gostService = gostService;
    }

    @GetMapping
    public ResponseEntity<List<KorisnikDTO>> getAllKorisniks() {
        return ResponseEntity.ok(korisnikService.findAll());
    }

    /*@GetMapping("/me/offers")
    public ResponseEntity<List<PonudaDTO>> getMyOffers() {
        // Get the authenticated user's ID from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Get the korisnik's offers through the service
        List<PonudaDTO> ponude = korisnikService.getKorisnikOffers(username);
        return ResponseEntity.ok(ponude);
    }*/
    @GetMapping("/{korisnikId}")
    public ResponseEntity<KorisnikDTO> getKorisnik(
            @PathVariable(name = "korisnikId") final Integer korisnikId) {
        return ResponseEntity.ok(korisnikService.get(korisnikId));
    }

    @GetMapping("/statistika")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        // Get the authenticated user's username from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(korisnikService.getDashboardStats(username));
    }

    @GetMapping("/statistika/kupac")
    public ResponseEntity<DashboardStatsDTOKor> getDashboardStatsKor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return ResponseEntity.ok(korisnikService.getDashboardStatsKor(username));
    }


    @GetMapping("/me/offers")
    public ResponseEntity<List<PonudaDTO>> getMyOffers() {
        // Get the authenticated user's ID from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Get the korisnik's offers through the service
        List<PonudaDTO> ponude = korisnikService.getKorisnikOffers(username);
        return ResponseEntity.ok(ponude);
    }

    @GetMapping("/me/spaces")
    public ResponseEntity<List<ProstorDTO>> getMySpaces() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        List<ProstorDTO> prostori = korisnikService.getKorisnikSpaces(username);
        return ResponseEntity.ok(prostori);
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

    @GetMapping("/me/gosti")
    public ResponseEntity<List<GostDTO>> getMyGuestLists() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return ResponseEntity.ok(gostService.getGuestListsByUsername(username));
    }


}
