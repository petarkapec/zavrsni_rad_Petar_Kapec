package hr.fer.unizg.organizator_dogadjaja.repos;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Korisnik;
import hr.fer.unizg.organizator_dogadjaja.domain.Ponuda;
import hr.fer.unizg.organizator_dogadjaja.domain.Prostor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DogadjajRepository extends JpaRepository<Dogadjaj, Integer> {

    Dogadjaj findFirstByKorisnik(Korisnik korisnik);

    Dogadjaj findFirstByProstor(Prostor prostor);

    Dogadjaj findFirstByDogadjajPonudaPonudas(Ponuda ponuda);

    List<Dogadjaj> findAllByDogadjajPonudaPonudas(Ponuda ponuda);

}
