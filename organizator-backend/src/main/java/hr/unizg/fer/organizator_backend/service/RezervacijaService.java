package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Dogadjaj;
import hr.unizg.fer.organizator_backend.domain.Gost;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Rezervacija;
import hr.unizg.fer.organizator_backend.domain.Termin;
import hr.unizg.fer.organizator_backend.model.*;
import hr.unizg.fer.organizator_backend.repos.DogadjajRepository;
import hr.unizg.fer.organizator_backend.repos.GostRepository;
import hr.unizg.fer.organizator_backend.repos.KorisnikRepository;
import hr.unizg.fer.organizator_backend.repos.RezervacijaRepository;
import hr.unizg.fer.organizator_backend.repos.TerminRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class RezervacijaService {

    private final RezervacijaRepository rezervacijaRepository;
    private final KorisnikRepository korisnikRepository;
    private final DogadjajRepository dogadjajRepository;
    private final TerminRepository terminRepository;
    private final GostRepository gostRepository;

    public RezervacijaService(final RezervacijaRepository rezervacijaRepository,
            final KorisnikRepository korisnikRepository,
            final DogadjajRepository dogadjajRepository, final TerminRepository terminRepository,
            final GostRepository gostRepository) {
        this.rezervacijaRepository = rezervacijaRepository;
        this.korisnikRepository = korisnikRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.terminRepository = terminRepository;
        this.gostRepository = gostRepository;
    }

    @Transactional(readOnly = true)
    public TerminDTO getTerminByRezervacijaId(Integer rezervacijaId) {
        Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        Termin termin = rezervacija.getProstorTermin();
        if (termin == null) {
            throw new NotFoundException("Termin not found for reservation");
        }

        TerminDTO terminDTO = new TerminDTO();
        terminDTO.setTerminId(termin.getTerminId());
        terminDTO.setDatumPocetka(termin.getDatumPocetka());
        terminDTO.setDatumZavrsetka(termin.getDatumZavrsetka());
        terminDTO.setProstor(termin.getProstor().getProstorId());
        return terminDTO;
    }

    @Transactional(readOnly = true)
    public DogadjajDTO getDogadjajByRezervacijaId(Integer rezervacijaId) {
        Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        Dogadjaj dogadjaj = rezervacija.getDogadjaj();
        if (dogadjaj == null) {
            throw new NotFoundException("Dogadjaj not found for reservation");
        }

        DogadjajDTO dogadjajDTO = new DogadjajDTO();
        dogadjajDTO.setDogadjajId(dogadjaj.getDogadjajId());
        dogadjajDTO.setNaziv(dogadjaj.getNaziv());
        dogadjajDTO.setOpis(dogadjaj.getOpis());
        dogadjajDTO.setUkCijenaPoOsobi(dogadjaj.getUkCijenaPoOsobi());
        dogadjajDTO.setUkCijenaFiksna(dogadjaj.getUkCijenaFiksna());
        dogadjajDTO.setOtkazniRok(dogadjaj.getOtkazniRok());
        dogadjajDTO.setKorisnik(dogadjaj.getKorisnik().getKorisnikId());
        dogadjajDTO.setProstorId(dogadjaj.getProstor().getProstorId());
        return dogadjajDTO;
    }

    @Transactional(readOnly = true)
    public List<RezervacijaDTO> findAll() {
        final List<Rezervacija> rezervacijas = rezervacijaRepository.findAllWithGuests();
        return rezervacijas.stream()
                .map(rezervacija -> mapToDTO(rezervacija, new RezervacijaDTO()))
                .toList();
    }

    @Transactional(readOnly = true)
    public RezervacijaDTO get(final Integer rezervacijaId) {
        return rezervacijaRepository.findByIdWithGuests(rezervacijaId)
                .map(rezervacija -> mapToDTO(rezervacija, new RezervacijaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Transactional
    public Integer create(final RezervacijaDTO rezervacijaDTO) {
        final Rezervacija rezervacija = new Rezervacija();
        mapToEntity(rezervacijaDTO, rezervacija);

        // Save the reservation first
        Rezervacija savedRezervacija = rezervacijaRepository.save(rezervacija);

        // If there are guests, create and associate them
        if (rezervacijaDTO.getGosti() != null && !rezervacijaDTO.getGosti().isEmpty()) {
            Set<Gost> gosti = rezervacijaDTO.getGosti().stream()
                    .map(gostDTO -> {
                        Gost gost = new Gost();
                        gost.setIme(gostDTO.getIme());
                        gost.setPrezime(gostDTO.getPrezime());
                        gost.setEmail(gostDTO.getEmail());
                        gost.setRezervacija(savedRezervacija);
                        return gost;
                    })
                    .collect(Collectors.toSet());

            savedRezervacija.setRezervacijaGosts(gosti);
            gostRepository.saveAll(gosti);
        }

        return savedRezervacija.getRezervacijaId();
    }


    public void update(final Integer rezervacijaId, final RezervacijaDTO rezervacijaDTO) {
        final Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(rezervacijaDTO, rezervacija);
        rezervacijaRepository.save(rezervacija);
    }

    @Transactional
    public void delete(final Integer rezervacijaId) {
        rezervacijaRepository.deleteById(rezervacijaId);
    }

    @Transactional
    public void platiRezervaciju(final Integer rezervacijaId) {
        Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        rezervacija.setStatus(StatusRezervacijeEnum.PLACENO.name());
        rezervacijaRepository.save(rezervacija);
    }

    @Transactional
    public void otkaziRezervaciju(final Integer rezervacijaId) {
        Rezervacija rezervacija = rezervacijaRepository.findById(rezervacijaId)
                .orElseThrow(NotFoundException::new);
        rezervacija.setStatus(StatusRezervacijeEnum.OTKAZANO.name());
        rezervacijaRepository.save(rezervacija);
    }




    private RezervacijaDTO mapToDTO(final Rezervacija rezervacija,
                                    final RezervacijaDTO rezervacijaDTO) {
        rezervacijaDTO.setRezervacijaId(rezervacija.getRezervacijaId());
        rezervacijaDTO.setUkupnaCijena(rezervacija.getUkupnaCijena());
        rezervacijaDTO.setPosebniZahtjevi(rezervacija.getPosebniZahtjevi());
        rezervacijaDTO.setStatus(rezervacija.getStatus());
        rezervacijaDTO.setKorisnik(rezervacija.getKorisnik() == null ? null : rezervacija.getKorisnik().getKorisnikId());
        rezervacijaDTO.setDogadjaj(rezervacija.getDogadjaj() == null ? null : rezervacija.getDogadjaj().getDogadjajId());
        rezervacijaDTO.setProstorTermin(rezervacija.getProstorTermin() == null ? null : rezervacija.getProstorTermin().getTerminId());

        // Map guests to GostDTO
        if (rezervacija.getRezervacijaGosts() != null) {
            List<GostDTO> gostDTOs = rezervacija.getRezervacijaGosts().stream()
                    .map(gost -> {
                        GostDTO gostDTO = new GostDTO();
                        gostDTO.setGostId(gost.getGostId());
                        gostDTO.setIme(gost.getIme());
                        gostDTO.setPrezime(gost.getPrezime());
                        gostDTO.setEmail(gost.getEmail());
                        return gostDTO;
                    })
                    .collect(Collectors.toList());
            rezervacijaDTO.setGosti(gostDTOs);
        }

        return rezervacijaDTO;
    }

    private Rezervacija mapToEntity(final RezervacijaDTO rezervacijaDTO,
            final Rezervacija rezervacija) {
        rezervacija.setUkupnaCijena(rezervacijaDTO.getUkupnaCijena());
        rezervacija.setPosebniZahtjevi(rezervacijaDTO.getPosebniZahtjevi());
        rezervacija.setStatus(rezervacijaDTO.getStatus());
        final Korisnik korisnik = rezervacijaDTO.getKorisnik() == null ? null : korisnikRepository.findById(rezervacijaDTO.getKorisnik())
                .orElseThrow(() -> new NotFoundException("korisnik not found"));
        rezervacija.setKorisnik(korisnik);
        final Dogadjaj dogadjaj = rezervacijaDTO.getDogadjaj() == null ? null : dogadjajRepository.findById(rezervacijaDTO.getDogadjaj())
                .orElseThrow(() -> new NotFoundException("dogadjaj not found"));
        rezervacija.setDogadjaj(dogadjaj);
        final Termin prostorTermin = rezervacijaDTO.getProstorTermin() == null ? null : terminRepository.findById(rezervacijaDTO.getProstorTermin())
                .orElseThrow(() -> new NotFoundException("prostorTermin not found"));
        rezervacija.setProstorTermin(prostorTermin);
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
