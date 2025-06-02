package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Ponuda;
import hr.fer.unizg.organizator_dogadjaja.domain.Prostor;
import hr.fer.unizg.organizator_dogadjaja.model.PonudaDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.DogadjajRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.PonudaRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.ProstorRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedWarning;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class PonudaService {

    private final PonudaRepository ponudaRepository;
    private final DogadjajRepository dogadjajRepository;
    private final ProstorRepository prostorRepository;

    public PonudaService(final PonudaRepository ponudaRepository,
            final DogadjajRepository dogadjajRepository,
            final ProstorRepository prostorRepository) {
        this.ponudaRepository = ponudaRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.prostorRepository = prostorRepository;
    }

    public List<PonudaDTO> findAll() {
        final List<Ponuda> ponudas = ponudaRepository.findAll(Sort.by("ponudaId"));
        return ponudas.stream()
                .map(ponuda -> mapToDTO(ponuda, new PonudaDTO()))
                .toList();
    }

    public PonudaDTO get(final Integer ponudaId) {
        return ponudaRepository.findById(ponudaId)
                .map(ponuda -> mapToDTO(ponuda, new PonudaDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final PonudaDTO ponudaDTO) {
        final Ponuda ponuda = new Ponuda();
        mapToEntity(ponudaDTO, ponuda);
        return ponudaRepository.save(ponuda).getPonudaId();
    }

    public void update(final Integer ponudaId, final PonudaDTO ponudaDTO) {
        final Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(ponudaDTO, ponuda);
        ponudaRepository.save(ponuda);
    }

    public void delete(final Integer ponudaId) {
        final Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        dogadjajRepository.findAllByDogadjajPonudaPonudas(ponuda)
                .forEach(dogadjaj -> dogadjaj.getDogadjajPonudaPonudas().remove(ponuda));
        ponudaRepository.delete(ponuda);
    }

    private PonudaDTO mapToDTO(final Ponuda ponuda, final PonudaDTO ponudaDTO) {
        ponudaDTO.setPonudaId(ponuda.getPonudaId());
        ponudaDTO.setNaziv(ponuda.getNaziv());
        ponudaDTO.setOpis(ponuda.getOpis());
        ponudaDTO.setUkCijenaFiksna(ponuda.getUkCijenaFiksna());
        ponudaDTO.setKategorija(ponuda.getKategorija());
        ponudaDTO.setCijenaPoOsobi(ponuda.getCijenaPoOsobi());
        return ponudaDTO;
    }

    private Ponuda mapToEntity(final PonudaDTO ponudaDTO, final Ponuda ponuda) {
        ponuda.setNaziv(ponudaDTO.getNaziv());
        ponuda.setOpis(ponudaDTO.getOpis());
        ponuda.setUkCijenaFiksna(ponudaDTO.getUkCijenaFiksna());
        ponuda.setKategorija(ponudaDTO.getKategorija());
        ponuda.setCijenaPoOsobi(ponudaDTO.getCijenaPoOsobi());
        return ponuda;
    }

    public ReferencedWarning getReferencedWarning(final Integer ponudaId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(NotFoundException::new);
        final Optional<Prostor> prostorProstor = prostorRepository.findById(Long.valueOf(ponudaId));
        if (prostorProstor != null) {
            referencedWarning.setKey("ponuda.prostor.prostor.referenced");
            referencedWarning.addParam(prostorProstor.get());
            return referencedWarning;
        }
        return null;
    }

}
