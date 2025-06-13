package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Gost;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Rezervacija;
import hr.unizg.fer.organizator_backend.model.GostDTO;
import hr.unizg.fer.organizator_backend.repos.GostRepository;
import hr.unizg.fer.organizator_backend.repos.KorisnikRepository;
import hr.unizg.fer.organizator_backend.repos.RezervacijaRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class GostService {

    private final GostRepository gostRepository;
    private final RezervacijaRepository rezervacijaRepository;
    private final KorisnikRepository korisnikRepository;

    public GostService(final GostRepository gostRepository,
                       final RezervacijaRepository rezervacijaRepository, KorisnikRepository korisnikRepository) {
        this.gostRepository = gostRepository;
        this.rezervacijaRepository = rezervacijaRepository;
        this.korisnikRepository = korisnikRepository;
    }

    public List<GostDTO> findAll() {
        final List<Gost> gosts = gostRepository.findAll(Sort.by("gostId"));
        return gosts.stream()
                .map(gost -> mapToDTO(gost, new GostDTO()))
                .toList();
    }

    public GostDTO get(final Integer gostId) {
        return gostRepository.findById(gostId)
                .map(gost -> mapToDTO(gost, new GostDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final GostDTO gostDTO) {
        final Gost gost = new Gost();
        mapToEntity(gostDTO, gost);
        return gostRepository.save(gost).getGostId();
    }

    public void update(final Integer gostId, final GostDTO gostDTO) {
        final Gost gost = gostRepository.findById(gostId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(gostDTO, gost);
        gostRepository.save(gost);
    }

    public void delete(final Integer gostId) {
        gostRepository.deleteById(gostId);
    }

    public List<GostDTO> getGuestListsByUsername(String username) {
        // Get all reservations for the user
        List<Rezervacija> rezervacije = rezervacijaRepository.findByKorisnikUsername(username);

        // Collect all guests from all reservations
        return rezervacije.stream()
                .flatMap(rezervacija -> rezervacija.getRezervacijaGosts().stream())
                .map(gost -> {
                    GostDTO dto = new GostDTO();
                    dto.setGostId(gost.getGostId());
                    dto.setIme(gost.getIme());
                    dto.setPrezime(gost.getPrezime());
                    dto.setEmail(gost.getEmail());
                    dto.setRezervacija(gost.getRezervacija().getRezervacijaId());
                    return dto;
                })
                .collect(Collectors.toList());
    }



    private GostDTO mapToDTO(final Gost gost, final GostDTO gostDTO) {
        gostDTO.setGostId(gost.getGostId());
        gostDTO.setIme(gost.getIme());
        gostDTO.setPrezime(gost.getPrezime());
        gostDTO.setEmail(gost.getEmail());
        gostDTO.setRezervacija(gost.getRezervacija() == null ? null : gost.getRezervacija().getRezervacijaId());
        return gostDTO;
    }

    private Gost mapToEntity(final GostDTO gostDTO, final Gost gost) {
        gost.setIme(gostDTO.getIme());
        gost.setPrezime(gostDTO.getPrezime());
        gost.setEmail(gostDTO.getEmail());
        final Rezervacija rezervacija = gostDTO.getRezervacija() == null ? null : rezervacijaRepository.findById(gostDTO.getRezervacija())
                .orElseThrow(() -> new NotFoundException("rezervacija not found"));
        gost.setRezervacija(rezervacija);
        return gost;
    }

}
