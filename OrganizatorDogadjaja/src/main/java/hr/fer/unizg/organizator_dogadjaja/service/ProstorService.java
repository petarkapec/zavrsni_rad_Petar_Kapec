package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Ponuda;
import hr.fer.unizg.organizator_dogadjaja.domain.Prostor;
import hr.fer.unizg.organizator_dogadjaja.model.ProstorDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.DogadjajRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.PonudaRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.ProstorRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@Transactional
public class ProstorService {

    private final ProstorRepository prostorRepository;

    public ProstorService(final ProstorRepository prostorRepository) {
        this.prostorRepository = prostorRepository;
    }

    public List<ProstorDTO> findAll() {
        return prostorRepository.findAll(Sort.by("ponudaId"))
                .stream()
                .map(prostor -> mapToDTO(prostor, new ProstorDTO()))
                .toList();
    }

    public ProstorDTO get(final Long id) {
        return prostorRepository.findById(id)
                .map(prostor -> mapToDTO(prostor, new ProstorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ProstorDTO dto) {
        final Prostor prostor = new Prostor();
        mapToEntity(dto, prostor);
        Prostor spremljeniProstor = prostorRepository.save(prostor);
        return Long.valueOf(spremljeniProstor.getPonudaId());
    }


    public void update(final Long id, final ProstorDTO dto) {
        final Prostor prostor = prostorRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(dto, prostor);
        prostorRepository.save(prostor);
    }

    public void delete(final Long id) {
        prostorRepository.deleteById(id);
    }

    private ProstorDTO mapToDTO(final Prostor prostor, final ProstorDTO dto) {
        dto.setId(Long.valueOf(prostor.getPonudaId()));  // iz Ponuda
        dto.setNaziv(prostor.getNaziv());
        dto.setOpis(prostor.getOpis());
        dto.setUkCijenaFiksna(prostor.getUkCijenaFiksna());
        dto.setKategorija(prostor.getKategorija());
        dto.setCijenaPoOsobi(prostor.getCijenaPoOsobi());

        dto.setAdresa(prostor.getAdresa());
        dto.setKapacitet(prostor.getKapacitet());

        return dto;
    }

    private void mapToEntity(final ProstorDTO dto, final Prostor prostor) {
        prostor.setNaziv(dto.getNaziv());
        prostor.setOpis(dto.getOpis());
        prostor.setUkCijenaFiksna(dto.getUkCijenaFiksna());
        prostor.setKategorija(dto.getKategorija());
        prostor.setCijenaPoOsobi(dto.getCijenaPoOsobi());

        prostor.setAdresa(dto.getAdresa());
        prostor.setKapacitet(dto.getKapacitet());
    }

    public ReferencedWarning getReferencedWarning(Long id) {
        return null;
    }
}
