package hr.fer.unizg.organizator_dogadjaja.service;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Korisnik;
import hr.fer.unizg.organizator_dogadjaja.domain.Ponuda;
import hr.fer.unizg.organizator_dogadjaja.domain.Prostor;
import hr.fer.unizg.organizator_dogadjaja.domain.Rezervacija;
import hr.fer.unizg.organizator_dogadjaja.domain.Slika;
import hr.fer.unizg.organizator_dogadjaja.model.DogadjajDTO;
import hr.fer.unizg.organizator_dogadjaja.repos.DogadjajRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.KorisnikRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.PonudaRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.ProstorRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.RezervacijaRepository;
import hr.fer.unizg.organizator_dogadjaja.repos.SlikaRepository;
import hr.fer.unizg.organizator_dogadjaja.util.NotFoundException;
import hr.fer.unizg.organizator_dogadjaja.util.ReferencedWarning;
import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class DogadjajService {

    private final DogadjajRepository dogadjajRepository;
    private final KorisnikRepository korisnikRepository;
    private final ProstorRepository prostorRepository;
    private final PonudaRepository ponudaRepository;
    private final SlikaRepository slikaRepository;
    private final RezervacijaRepository rezervacijaRepository;

    public DogadjajService(final DogadjajRepository dogadjajRepository,
            final KorisnikRepository korisnikRepository, final ProstorRepository prostorRepository,
            final PonudaRepository ponudaRepository, final SlikaRepository slikaRepository,
            final RezervacijaRepository rezervacijaRepository) {
        this.dogadjajRepository = dogadjajRepository;
        this.korisnikRepository = korisnikRepository;
        this.prostorRepository = prostorRepository;
        this.ponudaRepository = ponudaRepository;
        this.slikaRepository = slikaRepository;
        this.rezervacijaRepository = rezervacijaRepository;
    }

    public List<DogadjajDTO> findAll() {
        final List<Dogadjaj> dogadjajs = dogadjajRepository.findAll(Sort.by("dogadjajId"));
        return dogadjajs.stream()
                .map(dogadjaj -> mapToDTO(dogadjaj, new DogadjajDTO()))
                .toList();
    }

    public DogadjajDTO get(final Integer dogadjajId) {
        return dogadjajRepository.findById(dogadjajId)
                .map(dogadjaj -> mapToDTO(dogadjaj, new DogadjajDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final DogadjajDTO dogadjajDTO) {
        final Dogadjaj dogadjaj = new Dogadjaj();
        mapToEntity(dogadjajDTO, dogadjaj);
        return dogadjajRepository.save(dogadjaj).getDogadjajId();
    }

    public void update(final Integer dogadjajId, final DogadjajDTO dogadjajDTO) {
        final Dogadjaj dogadjaj = dogadjajRepository.findById(dogadjajId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(dogadjajDTO, dogadjaj);
        dogadjajRepository.save(dogadjaj);
    }

    public void delete(final Integer dogadjajId) {
        dogadjajRepository.deleteById(dogadjajId);
    }

    private DogadjajDTO mapToDTO(final Dogadjaj dogadjaj, final DogadjajDTO dogadjajDTO) {
        dogadjajDTO.setDogadjajId(dogadjaj.getDogadjajId());
        dogadjajDTO.setNaziv(dogadjaj.getNaziv());
        dogadjajDTO.setOpis(dogadjaj.getOpis());
        dogadjajDTO.setOtkazniRok(dogadjaj.getOtkazniRok());
        dogadjajDTO.setKorisnik(dogadjaj.getKorisnik() == null ? null : dogadjaj.getKorisnik().getKorisnikId());
        dogadjajDTO.setProstor(Long.valueOf(dogadjaj.getProstor() == null ? null : dogadjaj.getProstor().getPonudaId()));
        dogadjajDTO.setDogadjajPonudaPonudas(dogadjaj.getDogadjajPonudaPonudas().stream()
                .map(ponuda -> ponuda.getPonudaId())
                .toList());
        return dogadjajDTO;
    }

    private Dogadjaj mapToEntity(final DogadjajDTO dogadjajDTO, final Dogadjaj dogadjaj) {
        dogadjaj.setNaziv(dogadjajDTO.getNaziv());
        dogadjaj.setOpis(dogadjajDTO.getOpis());
        dogadjaj.setOtkazniRok(dogadjajDTO.getOtkazniRok());
        final Korisnik korisnik = dogadjajDTO.getKorisnik() == null ? null : korisnikRepository.findById(dogadjajDTO.getKorisnik())
                .orElseThrow(() -> new NotFoundException("korisnik not found"));
        dogadjaj.setKorisnik(korisnik);
        final Prostor prostor = dogadjajDTO.getProstor() == null ? null : prostorRepository.findById(dogadjajDTO.getProstor())
                .orElseThrow(() -> new NotFoundException("prostor not found"));
        dogadjaj.setProstor(prostor);
        final List<Ponuda> dogadjajPonudaPonudas = ponudaRepository.findAllById(
                dogadjajDTO.getDogadjajPonudaPonudas() == null ? List.of() : dogadjajDTO.getDogadjajPonudaPonudas());
        if (dogadjajPonudaPonudas.size() != (dogadjajDTO.getDogadjajPonudaPonudas() == null ? 0 : dogadjajDTO.getDogadjajPonudaPonudas().size())) {
            throw new NotFoundException("one of dogadjajPonudaPonudas not found");
        }
        dogadjaj.setDogadjajPonudaPonudas(new HashSet<>(dogadjajPonudaPonudas));
        return dogadjaj;
    }

    public ReferencedWarning getReferencedWarning(final Integer dogadjajId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Dogadjaj dogadjaj = dogadjajRepository.findById(dogadjajId)
                .orElseThrow(NotFoundException::new);
        final Slika dogadjajSlika = slikaRepository.findFirstByDogadjaj(dogadjaj);
        if (dogadjajSlika != null) {
            referencedWarning.setKey("dogadjaj.slika.dogadjaj.referenced");
            referencedWarning.addParam(dogadjajSlika.getSlikaId());
            return referencedWarning;
        }
        final Rezervacija dogadjajRezervacija = rezervacijaRepository.findFirstByDogadjaj(dogadjaj);
        if (dogadjajRezervacija != null) {
            referencedWarning.setKey("dogadjaj.rezervacija.dogadjaj.referenced");
            referencedWarning.addParam(dogadjajRezervacija.getRezervacijaId());
            return referencedWarning;
        }
        return null;
    }

}
