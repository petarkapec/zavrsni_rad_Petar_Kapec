package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.Dogadjaj;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Ponuda;
import hr.unizg.fer.organizator_backend.domain.Prostor;
import hr.unizg.fer.organizator_backend.domain.Rezervacija;
import hr.unizg.fer.organizator_backend.model.DogadjajDTO;
import hr.unizg.fer.organizator_backend.model.PonudaDTO;
import hr.unizg.fer.organizator_backend.model.TerminDTO;
import hr.unizg.fer.organizator_backend.repos.DogadjajRepository;
import hr.unizg.fer.organizator_backend.repos.KorisnikRepository;
import hr.unizg.fer.organizator_backend.repos.PonudaRepository;
import hr.unizg.fer.organizator_backend.repos.ProstorRepository;
import hr.unizg.fer.organizator_backend.repos.RezervacijaRepository;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class DogadjajService {

    private final DogadjajRepository dogadjajRepository;
    private final KorisnikRepository korisnikRepository;
    private final ProstorRepository prostorRepository;
    private final PonudaRepository ponudaRepository;
    private final RezervacijaRepository rezervacijaRepository;

    public DogadjajService(final DogadjajRepository dogadjajRepository,
            final KorisnikRepository korisnikRepository, final ProstorRepository prostorRepository,
            final PonudaRepository ponudaRepository,
            final RezervacijaRepository rezervacijaRepository) {
        this.dogadjajRepository = dogadjajRepository;
        this.korisnikRepository = korisnikRepository;
        this.prostorRepository = prostorRepository;
        this.ponudaRepository = ponudaRepository;
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
                .map(dogadjaj -> {
                    DogadjajDTO dto = new DogadjajDTO();
                    dto.setDogadjajId(dogadjaj.getDogadjajId());
                    dto.setNaziv(dogadjaj.getNaziv());
                    dto.setOpis(dogadjaj.getOpis());
                    dto.setUkCijenaPoOsobi(dogadjaj.getUkCijenaPoOsobi());
                    dto.setUkCijenaFiksna(dogadjaj.getUkCijenaFiksna());
                    dto.setOtkazniRok(dogadjaj.getOtkazniRok());

                    // Get Prostor details
                    Prostor prostor = dogadjaj.getProstor();
                    dto.setProstorId(prostor.getProstorId());
                    dto.setProstorNaziv(prostor.getNaziv());
                    dto.setProstorAdresa(prostor.getAdresa());
                    dto.setProstorKapacitet(prostor.getKapacitet());

                    // Get Organizer details
                    Korisnik organizator = dogadjaj.getKorisnik();
                    dto.setOrganizatorIme(organizator.getIme());
                    dto.setOrganizatorPrezime(organizator.getPrezime());

                    return dto;
                })
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

    public List<PonudaDTO> getDogadjajPonude(Integer dogadjajId) {
        Dogadjaj dogadjaj = dogadjajRepository.findById(dogadjajId)
                .orElseThrow(() -> new NotFoundException("Dogadjaj not found"));

        return dogadjaj.getDogadjajPonudaPonudas().stream()
                .map(ponuda -> {
                    PonudaDTO dto = new PonudaDTO();
                    dto.setPonudaId(ponuda.getPonudaId());
                    dto.setNaziv(ponuda.getNaziv());
                    dto.setOpis(ponuda.getOpis());
                    dto.setCijena(ponuda.getCijena());
                    dto.setTipCijene(ponuda.getTipCijene());
                    dto.setKategorija(ponuda.getKategorija());
                    dto.setKorisnik(ponuda.getKorisnik().getKorisnikId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<TerminDTO> getDogadjajTermini(Integer dogadjajId) {
        Dogadjaj dogadjaj = dogadjajRepository.findById(dogadjajId)
                .orElseThrow(() -> new NotFoundException("Dogadjaj not found"));

        // Get the Prostor associated with the Dogadjaj and then get its terms
        return dogadjaj.getProstor().getProstorTermins().stream()
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



    public void delete(final Integer dogadjajId) {
        dogadjajRepository.deleteById(dogadjajId);
    }

    private DogadjajDTO mapToDTO(final Dogadjaj dogadjaj, final DogadjajDTO dogadjajDTO) {
        dogadjajDTO.setDogadjajId(dogadjaj.getDogadjajId());
        dogadjajDTO.setNaziv(dogadjaj.getNaziv());
        dogadjajDTO.setOpis(dogadjaj.getOpis());
        dogadjajDTO.setUkCijenaPoOsobi(dogadjaj.getUkCijenaPoOsobi());
        dogadjajDTO.setUkCijenaFiksna(dogadjaj.getUkCijenaFiksna());
        dogadjajDTO.setOtkazniRok(dogadjaj.getOtkazniRok());
        dogadjajDTO.setKorisnik(dogadjaj.getKorisnik() == null ? null : dogadjaj.getKorisnik().getKorisnikId());
        //dogadjajDTO.setProstor(dogadjaj.getProstor() == null ? null : dogadjaj.getProstor().getProstorId());
        dogadjajDTO.setDogadjajPonudaPonudas(dogadjaj.getDogadjajPonudaPonudas().stream()
                .map(ponuda -> ponuda.getPonudaId())
                .toList());
        return dogadjajDTO;
    }

    private Dogadjaj mapToEntity(final DogadjajDTO dogadjajDTO, final Dogadjaj dogadjaj) {
        dogadjaj.setNaziv(dogadjajDTO.getNaziv());
        dogadjaj.setOpis(dogadjajDTO.getOpis());
        dogadjaj.setUkCijenaPoOsobi(dogadjajDTO.getUkCijenaPoOsobi());
        dogadjaj.setUkCijenaFiksna(dogadjajDTO.getUkCijenaFiksna());
        dogadjaj.setOtkazniRok(dogadjajDTO.getOtkazniRok());
        final Korisnik korisnik = dogadjajDTO.getKorisnik() == null ? null : korisnikRepository.findById(dogadjajDTO.getKorisnik())
                .orElseThrow(() -> new NotFoundException("korisnik not found"));
        dogadjaj.setKorisnik(korisnik);
        final Prostor prostor = dogadjajDTO.getProstorId() == null ? null : prostorRepository.findById(dogadjajDTO.getProstorId())
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
        final Rezervacija dogadjajRezervacija = rezervacijaRepository.findFirstByDogadjaj(dogadjaj);
        if (dogadjajRezervacija != null) {
            referencedWarning.setKey("dogadjaj.rezervacija.dogadjaj.referenced");
            referencedWarning.addParam(dogadjajRezervacija.getRezervacijaId());
            return referencedWarning;
        }
        return null;
    }

    public List<DogadjajDTO> findSvi() {
        final List<Dogadjaj> dogadjajs = dogadjajRepository.findAll(Sort.by("dogadjajId"));
        return dogadjajs.stream()
                .map(dogadjaj -> {
                    DogadjajDTO dto = new DogadjajDTO();
                    dto.setDogadjajId(dogadjaj.getDogadjajId());
                    dto.setNaziv(dogadjaj.getNaziv());
                    dto.setOpis(dogadjaj.getOpis());
                    dto.setUkCijenaPoOsobi(dogadjaj.getUkCijenaPoOsobi());
                    dto.setUkCijenaFiksna(dogadjaj.getUkCijenaFiksna());
                    dto.setOtkazniRok(dogadjaj.getOtkazniRok());

                    // Get Prostor details
                    Prostor prostor = dogadjaj.getProstor();
                    if (prostor != null) {
                        dto.setProstorId(prostor.getProstorId());
                        dto.setProstorNaziv(prostor.getNaziv());
                        dto.setProstorAdresa(prostor.getAdresa());
                        dto.setProstorKapacitet(prostor.getKapacitet());
                    }

                    // Get Organizer details
                    Korisnik organizator = dogadjaj.getKorisnik();
                    if (organizator != null) {
                        dto.setOrganizatorIme(organizator.getIme());
                        dto.setOrganizatorPrezime(organizator.getPrezime());
                    }

                    // Set ponude
                    dto.setDogadjajPonudaPonudas(dogadjaj.getDogadjajPonudaPonudas().stream()
                            .map(ponuda -> ponuda.getPonudaId())
                            .toList());

                    return dto;
                })
                .toList();
    }
}
