package hr.fer.unizg.organizator_dogadjaja.repos;

import hr.fer.unizg.organizator_dogadjaja.domain.Dogadjaj;
import hr.fer.unizg.organizator_dogadjaja.domain.Korisnik;
import hr.fer.unizg.organizator_dogadjaja.domain.Rezervacija;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RezervacijaRepository extends JpaRepository<Rezervacija, Integer> {

    Rezervacija findFirstByKorisnik(Korisnik korisnik);

    Rezervacija findFirstByDogadjaj(Dogadjaj dogadjaj);

}
