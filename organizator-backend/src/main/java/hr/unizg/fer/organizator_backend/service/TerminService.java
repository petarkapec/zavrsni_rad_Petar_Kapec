package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Prostor;
import hr.unizg.fer.organizator_backend.domain.Rezervacija;
import hr.unizg.fer.organizator_backend.domain.Termin;
import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.repos.ProstorRepository;
import hr.unizg.fer.organizator_backend.repos.RezervacijaRepository;
import hr.unizg.fer.organizator_backend.repos.TerminRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TerminService {

    private final TerminRepository terminRepository;
    private final ProstorRepository prostorRepository;
    private final RezervacijaRepository rezervacijaRepository;

    public TerminService(final TerminRepository terminRepository,
            final ProstorRepository prostorRepository,
            final RezervacijaRepository rezervacijaRepository) {
        this.terminRepository = terminRepository;
        this.prostorRepository = prostorRepository;
        this.rezervacijaRepository = rezervacijaRepository;
    }

    public List<TerminDTO> findAll() {
        final List<Termin> termins = terminRepository.findAll(Sort.by("terminId"));
        return termins.stream()
                .map(termin -> mapToDTO(termin, new TerminDTO()))
                .toList();
    }

    public TerminDTO get(final Integer terminId) {
        return terminRepository.findById(terminId)
                .map(termin -> mapToDTO(termin, new TerminDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final TerminDTO terminDTO) {
        final Termin termin = new Termin();
        mapToEntity(terminDTO, termin);
        return terminRepository.save(termin).getTerminId();
    }

    public void update(final Integer terminId, final TerminDTO terminDTO) {
        final Termin termin = terminRepository.findById(terminId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(terminDTO, termin);
        terminRepository.save(termin);
    }

    public void delete(final Integer terminId) {
        terminRepository.deleteById(terminId);
    }

    private TerminDTO mapToDTO(final Termin termin, final TerminDTO terminDTO) {
        terminDTO.setTerminId(termin.getTerminId());
        terminDTO.setDatumPocetka(termin.getDatumPocetka());
        terminDTO.setDatumZavrsetka(termin.getDatumZavrsetka());
        terminDTO.setZauzeto(termin.getZauzeto());
        terminDTO.setProstor(termin.getProstor() == null ? null : termin.getProstor().getProstorId());
        return terminDTO;
    }

    private Termin mapToEntity(final TerminDTO terminDTO, final Termin termin) {
        termin.setDatumPocetka(terminDTO.getDatumPocetka());
        termin.setDatumZavrsetka(terminDTO.getDatumZavrsetka());
        termin.setZauzeto(terminDTO.getZauzeto());
        final Prostor prostor = terminDTO.getProstor() == null ? null : prostorRepository.findById(terminDTO.getProstor())
                .orElseThrow(() -> new NotFoundException("prostor not found"));
        termin.setProstor(prostor);
        return termin;
    }

    public ReferencedWarning getReferencedWarning(final Integer terminId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Termin termin = terminRepository.findById(terminId)
                .orElseThrow(NotFoundException::new);
        final Rezervacija prostorTerminRezervacija = rezervacijaRepository.findFirstByProstorTermin(termin);
        if (prostorTerminRezervacija != null) {
            referencedWarning.setKey("termin.rezervacija.prostorTermin.referenced");
            referencedWarning.addParam(prostorTerminRezervacija.getRezervacijaId());
            return referencedWarning;
        }
        return null;
    }

}
