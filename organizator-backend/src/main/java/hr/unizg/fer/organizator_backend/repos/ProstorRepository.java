package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Prostor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProstorRepository extends JpaRepository<Prostor, Integer> {
    List<Prostor> findByKorisnik(Korisnik korisnik);
    List<Prostor> findByKorisnikUsername(String username);
    Long countByKorisnikUsername(String username);

}
