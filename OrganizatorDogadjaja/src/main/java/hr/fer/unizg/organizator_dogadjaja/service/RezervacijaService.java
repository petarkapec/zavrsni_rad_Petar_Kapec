package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Gost;
import hr.fer.unizg.organizator_dogadjaja.domain.Korisnik;
import hr.fer.unizg.organizator_dogadjaja.domain.Rezervacija;
import hr.fer.unizg.organizator_dogadjaja.model.RezervacijaDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.DogadjajRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.GostRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.KorisnikRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.RezervacijaRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class RezervacijaService {

    private final RezervacijaRepository rezervacijaRepository;
    private final KorisnikRepository korisnikRepository;
    private final DogadjajRepository dogadjajRepository;
    private final GostRepository gostRepository;

    public RezervacijaService(final RezervacijaRepository rezervacijaRepository,
            final KorisnikRepository korisnikRepository,
            final DogadjajRepository dogadjajRepository, final GostRepository gostRepository) {
        this.rezervacijaRepository = rezervacijaRepository;
        this.korisnikRepository = korisnikRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.gostRepository = gostRepository;
    }

    public List<RezervacijaDTO> findAll() {
        final List<Rezervacija> rezervacijas = rezervacijaRepository.findAll(Sort.by("rezervacijaId"));
        return rezervacijas.stream()
                .map(rezervacija -> mapToDTO(rezervacija, new RezervacijaDTO()))
                .toList();
    }

    public RezervacijaDTO get(final Integer rezervacijaId) {
        return rezervacijaRepository.findById(rezervacijaId)
                .map(rezervacija -> mapToDTO(rezervacija, new RezervacijaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final RezervacijaDTO rezervacijaDTO) {
        final Rezervacija rezervacija = new Rezervacija();
        mapToEntity(rezervacijaDTO, rezervacija);
        return rezervacijaRepository.save(rezervacija).getRezervacijaId();
    }

    public void update(final Integer rezervacijaId, final RezervacijaDTO rezervacijaDTO) {
        final Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(rezervacijaDTO, rezervacija);
        rezervacijaRepository.save(rezervacija);
    }

    public void delete(final Integer rezervacijaId) {
        rezervacijaRepository.deleteById(rezervacijaId);
    }

    private RezervacijaDTO mapToDTO(final Rezervacija rezervacija,
            final RezervacijaDTO rezervacijaDTO) {
        rezervacijaDTO.setRezervacijaId(rezervacija.getRezervacijaId());
        rezervacijaDTO.setDatumPocetka(rezervacija.getDatumPocetka());
        rezervacijaDTO.setDatumZavrsetka(rezervacija.getDatumZavrsetka());
        rezervacijaDTO.setOtkazniRok(rezervacija.getOtkazniRok());
        rezervacijaDTO.setUkupnaCijena(rezervacija.getUkupnaCijena());
        rezervacijaDTO.setPosebniZahtjevi(rezervacija.getPosebniZahtjevi());
        rezervacijaDTO.setStatus(rezervacija.getStatus());
        rezervacijaDTO.setStatusPlacanja(rezervacija.getStatusPlacanja());
        rezervacijaDTO.setKorisnik(rezervacija.getKorisnik() == null ? null : rezervacija.getKorisnik().getKorisnikId());
        rezervacijaDTO.setDogadjaj(rezervacija.getDogadjaj() == null ? null : rezervacija.getDogadjaj().getDogadjajId());
        return rezervacijaDTO;
    }

    private Rezervacija mapToEntity(final RezervacijaDTO rezervacijaDTO,
            final Rezervacija rezervacija) {
        rezervacija.setDatumPocetka(rezervacijaDTO.getDatumPocetka());
        rezervacija.setDatumZavrsetka(rezervacijaDTO.getDatumZavrsetka());
        rezervacija.setOtkazniRok(rezervacijaDTO.getOtkazniRok());
        rezervacija.setUkupnaCijena(rezervacijaDTO.getUkupnaCijena());
        rezervacija.setPosebniZahtjevi(rezervacijaDTO.getPosebniZahtjevi());
        rezervacija.setStatus(rezervacijaDTO.getStatus());
        rezervacija.setStatusPlacanja(rezervacijaDTO.getStatusPlacanja());
        final Korisnik korisnik = rezervacijaDTO.getKorisnik() == null ? null : korisnikRepository.findById(rezervacijaDTO.getKorisnik())
                .orElseThrow(() -> new NotFoundException("korisnik not found"));
        rezervacija.setKorisnik(korisnik);
        final Dogadjaj dogadjaj = rezervacijaDTO.getDogadjaj() == null ? null : dogadjajRepository.findById(rezervacijaDTO.getDogadjaj())
                .orElseThrow(() -> new NotFoundException("dogadjaj not found"));
        rezervacija.setDogadjaj(dogadjaj);
        return rezervacija;
    }

    public ReferencedWarning getReferencedWarning(final Integer rezervacijaId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        final Gost rezervacijaGost = gostRepository.findFirstByRezervacija(rezervacija);
        if (rezervacijaGost != null) {
            referencedWarning.setKey("rezervacija.gost.rezervacija.referenced");
            referencedWarning.addParam(rezervacijaGost.getGostId());
            return referencedWarning;
        }
        return null;
    }

}
