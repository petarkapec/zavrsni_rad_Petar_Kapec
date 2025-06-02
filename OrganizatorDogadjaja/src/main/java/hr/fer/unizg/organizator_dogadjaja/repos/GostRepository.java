package hr.fer.unizg.organizator_dogadjaja.repos;

import hr.fer.unizg.organizator_dogadjaja.domain.Gost;
import hr.fer.unizg.organizator_dogadjaja.domain.Rezervacija;
import org.springframework.data.jpa.repository.JpaRepository;


public interface GostRepository extends JpaRepository<Gost, Integer> {

    Gost findFirstByRezervacija(Rezervacija rezervacija);

}
