package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Slika;
import hr.fer.unizg.organizator_dogadjaja.model.SlikaDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.DogadjajRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.SlikaRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class SlikaService {

    private final SlikaRepository slikaRepository;
    private final DogadjajRepository dogadjajRepository;

    public SlikaService(final SlikaRepository slikaRepository,
            final DogadjajRepository dogadjajRepository) {
        this.slikaRepository = slikaRepository;
        this.dogadjajRepository = dogadjajRepository;
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
        slikaDTO.setDogadjaj(slika.getDogadjaj() == null ? null : slika.getDogadjaj().getDogadjajId());
        return slikaDTO;
    }

    private Slika mapToEntity(final SlikaDTO slikaDTO, final Slika slika) {
        slika.setUrl(slikaDTO.getUrl());
        final Dogadjaj dogadjaj = slikaDTO.getDogadjaj() == null ? null : dogadjajRepository.findById(slikaDTO.getDogadjaj())
                .orElseThrow(() -> new NotFoundException("dogadjaj not found"));
        slika.setDogadjaj(dogadjaj);
        return slika;
    }

}
