package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Ponuda;
import hr.unizg.fer.organizator_backend.domain.Slika;
import hr.unizg.fer.organizator_backend.model.SlikaDTO;
import hr.unizg.fer.organizator_backend.repos.PonudaRepository;
import hr.unizg.fer.organizator_backend.repos.SlikaRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class SlikaService {

    private final SlikaRepository slikaRepository;
    private final PonudaRepository ponudaRepository;

    public SlikaService(final SlikaRepository slikaRepository,
            final PonudaRepository ponudaRepository) {
        this.slikaRepository = slikaRepository;
        this.ponudaRepository = ponudaRepository;
    }

    public List<SlikaDTO> findAll() {
        final List<Slika> slikas = slikaRepository.findAll(Sort.by("slikaId"));
        return slikas.stream()
                .map(slika -> mapToDTO(slika, new SlikaDTO()))
                .toList();
    }

    public SlikaDTO get(final Integer slikaId) {
        return slikaRepository.findById(slikaId)
                .map(slika -> mapToDTO(slika, new SlikaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final SlikaDTO slikaDTO) {
        final Slika slika = new Slika();
        mapToEntity(slikaDTO, slika);
        return slikaRepository.save(slika).getSlikaId();
    }

    public void update(final Integer slikaId, final SlikaDTO slikaDTO) {
        final Slika slika = slikaRepository.findById(slikaId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(slikaDTO, slika);
        slikaRepository.save(slika);
    }

    public void delete(final Integer slikaId) {
        slikaRepository.deleteById(slikaId);
    }

    private SlikaDTO mapToDTO(final Slika slika, final SlikaDTO slikaDTO) {
        slikaDTO.setSlikaId(slika.getSlikaId());
        slikaDTO.setUrl(slika.getUrl());
        slikaDTO.setPonuda(slika.getPonuda() == null ? null : slika.getPonuda().getPonudaId());
        return slikaDTO;
    }

    private Slika mapToEntity(final SlikaDTO slikaDTO, final Slika slika) {
        slika.setUrl(slikaDTO.getUrl());
        final Ponuda ponuda = slikaDTO.getPonuda() == null ? null : ponudaRepository.findById(slikaDTO.getPonuda())
                .orElseThrow(() -> new NotFoundException("ponuda not found"));
        slika.setPonuda(ponuda);
        return slika;
    }

}
