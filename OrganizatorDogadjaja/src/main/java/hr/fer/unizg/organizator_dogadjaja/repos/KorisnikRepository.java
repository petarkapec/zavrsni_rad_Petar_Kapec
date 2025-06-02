package hr.fer.unizg.organizator_dogadjaja.repos;

import hr.fer.unizg.organizator_dogadjaja.domain.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;


public interface KorisnikRepository extends JpaRepository<Korisnik, Integer> {
}
