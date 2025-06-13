package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Dogadjaj;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Ponuda;
import hr.unizg.fer.organizator_backend.domain.Prostor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface DogadjajRepository extends JpaRepository<Dogadjaj, Integer> {

    Dogadjaj findFirstByKorisnik(Korisnik korisnik);

    Dogadjaj findFirstByProstor(Prostor prostor);

    Dogadjaj findFirstByDogadjajPonudaPonudas(Ponuda ponuda);

    List<Dogadjaj> findAllByDogadjajPonudaPonudas(Ponuda ponuda);

    List<Dogadjaj> findByKorisnikUsername(String username);

    @Query("SELECT COUNT(d) FROM Dogadjaj d WHERE d.korisnik.username = :username")
    Long countUpcomingByKorisnikUsername(String username);

    Long countByKorisnikUsername(String username);





}
