package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Ponuda;
import hr.unizg.fer.organizator_backend.domain.Slika;
import hr.unizg.fer.organizator_backend.model.PonudaDTO;
import hr.unizg.fer.organizator_backend.repos.DogadjajRepository;
import hr.unizg.fer.organizator_backend.repos.KorisnikRepository;
import hr.unizg.fer.organizator_backend.repos.PonudaRepository;
import hr.unizg.fer.organizator_backend.repos.SlikaRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class PonudaService {

    private final PonudaRepository ponudaRepository;
    private final DogadjajRepository dogadjajRepository;
    private final SlikaRepository slikaRepository;
    private final KorisnikRepository korisnikRepository;

    public PonudaService(final PonudaRepository ponudaRepository,
                         final DogadjajRepository dogadjajRepository, final SlikaRepository slikaRepository, KorisnikRepository korisnikRepository) {
        this.ponudaRepository = ponudaRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.slikaRepository = slikaRepository;
        this.korisnikRepository = korisnikRepository;
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

        // Find and set the Korisnik
        if (ponudaDTO.getKorisnik() != null) {
            Korisnik korisnik = korisnikRepository.findById(ponudaDTO.getKorisnik())
                    .orElseThrow(() -> new NotFoundException("Korisnik not found"));
            ponuda.setKorisnik(korisnik);
        }

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
        ponudaDTO.setCijena(ponuda.getCijena());
        ponudaDTO.setTipCijene(ponuda.getTipCijene());
        ponudaDTO.setKategorija(ponuda.getKategorija());
        return ponudaDTO;
    }

    private Ponuda mapToEntity(final PonudaDTO ponudaDTO, final Ponuda ponuda) {
        ponuda.setNaziv(ponudaDTO.getNaziv());
        ponuda.setOpis(ponudaDTO.getOpis());
        ponuda.setCijena(ponudaDTO.getCijena());
        ponuda.setTipCijene(ponudaDTO.getTipCijene());
        ponuda.setKategorija(ponudaDTO.getKategorija());
        return ponuda;
    }

    public ReferencedWarning getReferencedWarning(final Integer ponudaId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(NotFoundException::new);
        final Slika ponudaSlika = slikaRepository.findFirstByPonuda(ponuda);
        if (ponudaSlika != null) {
            referencedWarning.setKey("ponuda.slika.ponuda.referenced");
            referencedWarning.addParam(ponudaSlika.getSlikaId());
            return referencedWarning;
        }
        return null;
    }

}
