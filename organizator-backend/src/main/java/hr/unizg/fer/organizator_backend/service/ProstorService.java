package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Dogadjaj;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Prostor;
import hr.unizg.fer.organizator_backend.domain.Termin;
import hr.unizg.fer.organizator_backend.model.ProstorDTO;
import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.repos.DogadjajRepository;
import hr.unizg.fer.organizator_backend.repos.KorisnikRepository;
import hr.unizg.fer.organizator_backend.repos.ProstorRepository;
import hr.unizg.fer.organizator_backend.repos.TerminRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;


@Service
public class ProstorService {

    private final ProstorRepository prostorRepository;
    private final DogadjajRepository dogadjajRepository;
    private final TerminRepository terminRepository;
    private final KorisnikRepository korisnikRepository;


    public ProstorService(final ProstorRepository prostorRepository,
                          final DogadjajRepository dogadjajRepository, final TerminRepository terminRepository, KorisnikRepository korisnikRepository) {
        this.prostorRepository = prostorRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.terminRepository = terminRepository;
        this.korisnikRepository = korisnikRepository;
    }

    public List<ProstorDTO> findAll() {
        final List<Prostor> prostors = prostorRepository.findAll(Sort.by("prostorId"));
        return prostors.stream()
                .map(prostor -> mapToDTO(prostor, new ProstorDTO()))
                .toList();
    }

    public ProstorDTO get(final Integer prostorId) {
        return prostorRepository.findById(prostorId)
                .map(prostor -> mapToDTO(prostor, new ProstorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ProstorDTO prostorDTO) {
        final Prostor prostor = new Prostor();
        mapToEntity(prostorDTO, prostor);

        // Find and set the Korisnik
        if (prostorDTO.getKorisnik() != null) {
            Korisnik korisnik = korisnikRepository.findById(prostorDTO.getKorisnik())
                    .orElseThrow(() -> new NotFoundException("Korisnik not found"));
            prostor.setKorisnik(korisnik);
        }

        return prostorRepository.save(prostor).getProstorId();
    }


    public void update(final Integer prostorId, final ProstorDTO prostorDTO) {
        final Prostor prostor = prostorRepository.findById(prostorId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(prostorDTO, prostor);
        prostorRepository.save(prostor);
    }

    public void delete(final Integer prostorId) {
        prostorRepository.deleteById(prostorId);
    }

    public List<TerminDTO> setProstorTermini(Integer prostorId, List<TerminDTO> termini) {
        Prostor prostor = prostorRepository.findById(prostorId)
                .orElseThrow(() -> new NotFoundException("Prostor not found"));

        // Delete existing terms
        terminRepository.deleteByProstorProstorId(prostorId);

        // Create new terms
        return termini.stream()
                .map(terminDTO -> {
                    Termin termin = new Termin();
                    termin.setProstor(prostor);
                    termin.setDatumPocetka(terminDTO.getDatumPocetka());
                    termin.setDatumZavrsetka(terminDTO.getDatumZavrsetka());
                    termin.setZauzeto(terminDTO.getZauzeto());
                    termin = terminRepository.save(termin);

                    TerminDTO dto = new TerminDTO();
                    dto.setTerminId(termin.getTerminId());
                    dto.setDatumPocetka(termin.getDatumPocetka());
                    dto.setDatumZavrsetka(termin.getDatumZavrsetka());
                    dto.setZauzeto(termin.getZauzeto());
                    dto.setProstor(termin.getProstor().getProstorId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public TerminDTO addProstorTermin(Integer prostorId, TerminDTO terminDTO) {
        Prostor prostor = prostorRepository.findById(prostorId)
                .orElseThrow(() -> new NotFoundException("Prostor not found"));

        Termin termin = new Termin();
        termin.setProstor(prostor);
        termin.setDatumPocetka(terminDTO.getDatumPocetka());
        termin.setDatumZavrsetka(terminDTO.getDatumZavrsetka());
        termin.setZauzeto(terminDTO.getZauzeto());
        termin = terminRepository.save(termin);

        TerminDTO dto = new TerminDTO();
        dto.setTerminId(termin.getTerminId());
        dto.setDatumPocetka(termin.getDatumPocetka());
        dto.setDatumZavrsetka(termin.getDatumZavrsetka());
        dto.setZauzeto(termin.getZauzeto());
        dto.setProstor(termin.getProstor().getProstorId());
        return dto;
    }

    public void deleteProstorTermin(Integer prostorId, Integer terminId) {
        Termin termin = terminRepository.findById(terminId)
                .orElseThrow(() -> new NotFoundException("Termin not found"));

        if (!termin.getProstor().getProstorId().equals(prostorId)) {
            throw new IllegalArgumentException("Termin does not belong to this Prostor");
        }

        terminRepository.deleteById(terminId);
    }


    private ProstorDTO mapToDTO(final Prostor prostor, final ProstorDTO prostorDTO) {
        prostorDTO.setProstorId(prostor.getProstorId());
        prostorDTO.setNaziv(prostor.getNaziv());
        prostorDTO.setOpis(prostor.getOpis());
        prostorDTO.setCijena(prostor.getCijena());
        prostorDTO.setAdresa(prostor.getAdresa());
        prostorDTO.setKapacitet(prostor.getKapacitet());
        prostorDTO.setKorisnik(prostor.getKorisnik().getKorisnikId());
        return prostorDTO;
    }

    public List<TerminDTO> getProstorTermini(Integer prostorId) {
        Prostor prostor = prostorRepository.findById(prostorId)
                .orElseThrow(() -> new NotFoundException("Prostor not found"));

        return prostor.getProstorTermins().stream()
                .map(termin -> {
                    TerminDTO dto = new TerminDTO();
                    dto.setTerminId(termin.getTerminId());
                    dto.setDatumPocetka(termin.getDatumPocetka());
                    dto.setDatumZavrsetka(termin.getDatumZavrsetka());
                    dto.setZauzeto(termin.getZauzeto());
                    dto.setProstor(termin.getProstor().getProstorId());
                    return dto;
                })
                .collect(Collectors.toList());
    }




    private Prostor mapToEntity(final ProstorDTO prostorDTO, final Prostor prostor) {
        prostor.setNaziv(prostorDTO.getNaziv());
        prostor.setOpis(prostorDTO.getOpis());
        prostor.setCijena(prostorDTO.getCijena());
        prostor.setAdresa(prostorDTO.getAdresa());
        prostor.setKapacitet(prostorDTO.getKapacitet());

        if (prostorDTO.getKorisnik() != null) {
            final Korisnik korisnik = korisnikRepository.findById(prostorDTO.getKorisnik())
                    .orElseThrow(() -> new NotFoundException("korisnik not found"));
            prostor.setKorisnik(korisnik);
        }

        return prostor;
    }


    public ReferencedWarning getReferencedWarning(final Integer prostorId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Prostor prostor = prostorRepository.findById(prostorId)
                .orElseThrow(NotFoundException::new);
        final Dogadjaj prostorDogadjaj = dogadjajRepository.findFirstByProstor(prostor);
        if (prostorDogadjaj != null) {
            referencedWarning.setKey("prostor.dogadjaj.prostor.referenced");
            referencedWarning.addParam(prostorDogadjaj.getDogadjajId());
            return referencedWarning;
        }
        final Termin prostorTermin = terminRepository.findFirstByProstor(prostor);
        if (prostorTermin != null) {
            referencedWarning.setKey("prostor.termin.prostor.referenced");
            referencedWarning.addParam(prostorTermin.getTerminId());
            return referencedWarning;
        }
        return null;
    }

}
