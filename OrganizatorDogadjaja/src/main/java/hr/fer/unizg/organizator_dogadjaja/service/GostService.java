package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Gost;
import hr.fer.unizg.organizator_dogadjaja.domain.Rezervacija;
import hr.fer.unizg.organizator_dogadjaja.model.GostDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.GostRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.RezervacijaRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class GostService {

    private final GostRepository gostRepository;
    private final RezervacijaRepository rezervacijaRepository;

    public GostService(final GostRepository gostRepository,
            final RezervacijaRepository rezervacijaRepository) {
        this.gostRepository = gostRepository;
        this.rezervacijaRepository = rezervacijaRepository;
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
