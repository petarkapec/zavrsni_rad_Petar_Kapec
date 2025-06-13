package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Ponuda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PonudaRepository extends JpaRepository<Ponuda, Integer> {
    List<Ponuda> findByKorisnik(Korisnik korisnik);
    List<Ponuda> findByKorisnikUsername(String username);
    Long countByKorisnikUsername(String username);

}
