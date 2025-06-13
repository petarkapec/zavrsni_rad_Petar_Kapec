package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Dogadjaj;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Rezervacija;
import hr.unizg.fer.organizator_backend.domain.Termin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface RezervacijaRepository extends JpaRepository<Rezervacija, Integer> {

    Rezervacija findFirstByKorisnik(Korisnik korisnik);

    Rezervacija findFirstByDogadjaj(Dogadjaj dogadjaj);

    Rezervacija findFirstByProstorTermin(Termin termin);
    Long countByKorisnikUsername(String username);

    @Query("SELECT COUNT(r) FROM Rezervacija r WHERE r.dogadjaj.korisnik.username = :username")
    Long countByOrganizatorUsername(@Param("username") String username);

    @Query("SELECT COUNT(r) FROM Rezervacija r WHERE r.dogadjaj.korisnik.username = :username AND r.status = 'CEKA_POTVRDU'")
    Long countPendingByOrganizatorUsername(@Param("username") String username);

    List<Rezervacija> findByKorisnikUsername(String username);


    @Query("SELECT DISTINCT r FROM Rezervacija r LEFT JOIN FETCH r.rezervacijaGosts")
    List<Rezervacija> findAllWithGuests();

    @Query("SELECT DISTINCT r FROM Rezervacija r LEFT JOIN FETCH r.rezervacijaGosts WHERE r.rezervacijaId = :id")
    Optional<Rezervacija> findByIdWithGuests(@Param("id") Integer id);



}
