package hr.fer.unizg.organizator_dogadjaja.repos;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Slika;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SlikaRepository extends JpaRepository<Slika, Integer> {

    Slika findFirstByDogadjaj(Dogadjaj dogadjaj);

}
