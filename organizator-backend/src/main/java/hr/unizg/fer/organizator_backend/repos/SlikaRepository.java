package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Ponuda;
import hr.unizg.fer.organizator_backend.domain.Slika;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SlikaRepository extends JpaRepository<Slika, Integer> {

    Slika findFirstByPonuda(Ponuda ponuda);

}
