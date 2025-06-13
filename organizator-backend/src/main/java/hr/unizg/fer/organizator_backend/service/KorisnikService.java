package hr.unizg.fer.organizator_backend.service;

import hr.unizg.fer.organizator_backend.domain.*;
import hr.unizg.fer.organizator_backend.model.*;
import hr.unizg.fer.organizator_backend.repos.*;
import hr.unizg.fer.organizator_backend.util.NotFoundException;
import hr.unizg.fer.organizator_backend.util.ReferencedWarning;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
public class KorisnikService {

    private final KorisnikRepository korisnikRepository;
    private final DogadjajRepository dogadjajRepository;
    private final RezervacijaRepository rezervacijaRepository;
    private final PonudaRepository ponudaRepository;
    private final PonudaService ponudaService;
    private final ProstorRepository prostorRepository;


    public KorisnikService(final KorisnikRepository korisnikRepository,
                           final DogadjajRepository dogadjajRepository,
                           final RezervacijaRepository rezervacijaRepository, PonudaService ponudaService, PonudaRepository ponudaRepository, ProstorRepository prostorRepository) {
        this.korisnikRepository = korisnikRepository;
        this.dogadjajRepository = dogadjajRepository;
        this.rezervacijaRepository = rezervacijaRepository;
        this.ponudaService = ponudaService;
        this.ponudaRepository = ponudaRepository;
        this.prostorRepository = prostorRepository;
    }

    public List<ProstorDTO> getKorisnikSpaces(String username) {
        List<Prostor> prostori = prostorRepository.findByKorisnikUsername(username);
        return prostori.stream()
                .map(prostor -> {
                    ProstorDTO dto = new ProstorDTO();
                    dto.setProstorId(prostor.getProstorId());
                    dto.setNaziv(prostor.getNaziv());
                    dto.setOpis(prostor.getOpis());
                    dto.setCijena(prostor.getCijena());
                    dto.setAdresa(prostor.getAdresa());
                    dto.setKapacitet(prostor.getKapacitet());
                    dto.setKorisnik(prostor.getKorisnik().getKorisnikId());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public List<KorisnikDTO> findAll() {
        final List<Korisnik> korisniks = korisnikRepository.findAll(Sort.by("korisnikId"));
        return korisniks.stream()
                .map(korisnik -> mapToDTO(korisnik, new KorisnikDTO()))
                .toList();
    }

    public KorisnikDTO get(final Integer korisnikId) {
        return korisnikRepository.findById(korisnikId)
                .map(korisnik -> mapToDTO(korisnik, new KorisnikDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final KorisnikDTO korisnikDTO) {
        final Korisnik korisnik = new Korisnik();
        mapToEntity(korisnikDTO, korisnik);
        return korisnikRepository.save(korisnik).getKorisnikId();
    }

    public void update(final Integer korisnikId, final KorisnikDTO korisnikDTO) {
        final Korisnik korisnik = korisnikRepository.findById(korisnikId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(korisnikDTO, korisnik);
        korisnikRepository.save(korisnik);
    }

    public void delete(final Integer korisnikId) {
        korisnikRepository.deleteById(korisnikId);
    }



    public DashboardStatsDTOKor getDashboardStatsKor(String username) {
        DashboardStatsDTOKor stats = new DashboardStatsDTOKor();

        // Get counts from respective repositories
        stats.setTotalReservations(rezervacijaRepository.countByKorisnikUsername(username));
        stats.setUpcomingEvents(dogadjajRepository.countUpcomingByKorisnikUsername(username));
        stats.setGuestLists(0L); // Set to 0 or implement guest list counting logic if needed

        // Get featured events
        List<DashboardStatsDTOKor.FeaturedEventDTO> featuredEvents = dogadjajRepository
                .findByKorisnikUsername(username)
                .stream()
                .map(dogadjaj -> {
                    DashboardStatsDTOKor.FeaturedEventDTO dto = new DashboardStatsDTOKor.FeaturedEventDTO();
                    dto.setDogadjaj_id(dogadjaj.getDogadjajId());
                    dto.setNaziv(dogadjaj.getNaziv());
                    dto.setOpis(dogadjaj.getOpis());
                    dto.setProstor_naziv(dogadjaj.getProstor().getNaziv());
                    dto.setUk_cijena_po_osobi(dogadjaj.getUkCijenaPoOsobi());
                    dto.setUk_cijena_fiksna(dogadjaj.getUkCijenaFiksna());
                    return dto;
                })
                .collect(Collectors.toList());

        stats.setFeaturedEvents(featuredEvents);

        return stats;
    }


    public DashboardStatsDTO getDashboardStats(String username) {
    DashboardStatsDTO stats = new DashboardStatsDTO();

    // Get total events for the organizer
    Long totalEvents = dogadjajRepository.countByKorisnikUsername(username);
    stats.setTotalEvents(totalEvents);

    // Get total reservations for the organizer's events
    Long totalReservations = rezervacijaRepository.countByOrganizatorUsername(username);
    stats.setTotalReservations(totalReservations);

    // Get total offers
    Long totalOffers = ponudaRepository.countByKorisnikUsername(username);
    stats.setTotalOffers(totalOffers);

    // Get total spaces
    Long totalSpaces = prostorRepository.countByKorisnikUsername(username);
    stats.setTotalSpaces(totalSpaces);

    // Get upcoming (pending) reservations
    Long upcomingReservations = rezervacijaRepository.countPendingByOrganizatorUsername(username);
    stats.setUpcomingReservations(upcomingReservations);

    return stats;
}

    public List<PonudaDTO> getKorisnikOffers(String username) {
        List<Ponuda> ponude = ponudaRepository.findByKorisnikUsername(username);
        return ponude.stream()
                .map(ponuda -> {
                    PonudaDTO dto = new PonudaDTO();
                    // map all necessary fields
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


    private KorisnikDTO mapToDTO(final Korisnik korisnik, final KorisnikDTO korisnikDTO) {
        korisnikDTO.setKorisnikId(korisnik.getKorisnikId());
        korisnikDTO.setUsername(korisnik.getUsername());
        korisnikDTO.setIme(korisnik.getIme());
        korisnikDTO.setPrezime(korisnik.getPrezime());
        korisnikDTO.setEmail(korisnik.getEmail());
        korisnikDTO.setPassword(korisnik.getPassword());
        korisnikDTO.setUloga(korisnik.getUloga());
        return korisnikDTO;
    }

    private Korisnik mapToEntity(final KorisnikDTO korisnikDTO, final Korisnik korisnik) {
        korisnik.setUsername(korisnikDTO.getUsername());
        korisnik.setIme(korisnikDTO.getIme());
        korisnik.setPrezime(korisnikDTO.getPrezime());
        korisnik.setEmail(korisnikDTO.getEmail());
        korisnik.setPassword(korisnikDTO.getPassword());
        korisnik.setUloga(korisnikDTO.getUloga());
        return korisnik;
    }

    public ReferencedWarning getReferencedWarning(final Integer korisnikId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Korisnik korisnik = korisnikRepository.findById(korisnikId)
                .orElseThrow(NotFoundException::new);
        final Dogadjaj korisnikDogadjaj = dogadjajRepository.findFirstByKorisnik(korisnik);
        if (korisnikDogadjaj != null) {
            referencedWarning.setKey("korisnik.dogadjaj.korisnik.referenced");
            referencedWarning.addParam(korisnikDogadjaj.getDogadjajId());
            return referencedWarning;
        }
        final Rezervacija korisnikRezervacija = rezervacijaRepository.findFirstByKorisnik(korisnik);
        if (korisnikRezervacija != null) {
            referencedWarning.setKey("korisnik.rezervacija.korisnik.referenced");
            referencedWarning.addParam(korisnikRezervacija.getRezervacijaId());
            return referencedWarning;
        }
        return null;
    }

}
