package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Korisnik;
import hr.fer.unizg.organizator_dogadjaja.domain.Rezervacija;
import hr.fer.unizg.organizator_dogadjaja.model.KorisnikDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.DogadjajRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.KorisnikRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.RezervacijaRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class KorisnikService {

    private final KorisnikRepository korisnikRepository;
    private final DogadjajRepository dogadjajRepository;
    private final RezervacijaRepository rezervacijaRepository;

    public KorisnikService(final KorisnikRepository korisnikRepository,
            final DogadjajRepository dogadjajRepository,
            final RezervacijaRepository rezervacijaRepository) {
        this.korisnikRepository = korisnikRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.rezervacijaRepository = rezervacijaRepository;
    }

    public List<KorisnikDTO> findAll() {
        final List<Korisnik> korisniks = korisnikRepository.findAll(Sort.by("korisnikId"));
        return korisniks.stream()
                .map(korisnik -> mapToDTO(korisnik, new KorisnikDTO()))
                .toList();
    }

    public KorisnikDTO get(final Integer korisnikId) {
        return korisnikRepository.findById(korisnikId)
                .map(korisnik -> mapToDTO(korisnik, new KorisnikDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final KorisnikDTO korisnikDTO) {
        final Korisnik korisnik = new Korisnik();
        mapToEntity(korisnikDTO, korisnik);
        return korisnikRepository.save(korisnik).getKorisnikId();
    }

    public void update(final Integer korisnikId, final KorisnikDTO korisnikDTO) {
        final Korisnik korisnik = korisnikRepository.findById(korisnikId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(korisnikDTO, korisnik);
        korisnikRepository.save(korisnik);
    }

    public void delete(final Integer korisnikId) {
        korisnikRepository.deleteById(korisnikId);
    }

    private KorisnikDTO mapToDTO(final Korisnik korisnik, final KorisnikDTO korisnikDTO) {
        korisnikDTO.setKorisnikId(korisnik.getKorisnikId());
        korisnikDTO.setUsername(korisnik.getUsername());
        korisnikDTO.setIme(korisnik.getIme());
        korisnikDTO.setPrezime(korisnik.getPrezime());
        korisnikDTO.setEmail(korisnik.getEmail());
        korisnikDTO.setPassword(korisnik.getPassword());
        korisnikDTO.setUloga(korisnik.getUloga());
        return korisnikDTO;
    }

    private Korisnik mapToEntity(final KorisnikDTO korisnikDTO, final Korisnik korisnik) {
        korisnik.setUsername(korisnikDTO.getUsername());
        korisnik.setIme(korisnikDTO.getIme());
        korisnik.setPrezime(korisnikDTO.getPrezime());
        korisnik.setEmail(korisnikDTO.getEmail());
        korisnik.setPassword(korisnikDTO.getPassword());
        korisnik.setUloga(korisnikDTO.getUloga());
        return korisnik;
    }

    public ReferencedWarning getReferencedWarning(final Integer korisnikId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Korisnik korisnik = korisnikRepository.findById(korisnikId)
                .orElseThrow(NotFoundException::new);
        final Dogadjaj korisnikDogadjaj = dogadjajRepository.findFirstByKorisnik(korisnik);
        if (korisnikDogadjaj != null) {
            referencedWarning.setKey("korisnik.dogadjaj.korisnik.referenced");
            referencedWarning.addParam(korisnikDogadjaj.getDogadjajId());
            return referencedWarning;
        }
        final Rezervacija korisnikRezervacija = rezervacijaRepository.findFirstByKorisnik(korisnik);
        if (korisnikRezervacija != null) {
            referencedWarning.setKey("korisnik.rezervacija.korisnik.referenced");
            referencedWarning.addParam(korisnikRezervacija.getRezervacijaId());
            return referencedWarning;
        }
        return null;
    }

}
