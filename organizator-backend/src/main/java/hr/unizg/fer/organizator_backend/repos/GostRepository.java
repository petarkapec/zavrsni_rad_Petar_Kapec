package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Gost;
import hr.unizg.fer.organizator_backend.domain.Korisnik;
import hr.unizg.fer.organizator_backend.domain.Rezervacija;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface GostRepository extends JpaRepository<Gost, Integer> {

    Gost findFirstByRezervacija(Rezervacija rezervacija);



}
