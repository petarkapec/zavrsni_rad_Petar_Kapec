package hr.fer.unizg.organizator_dogadjaja.repos;

import hr.fer.unizg.organizator_dogadjaja.domain.Ponuda;
import hr.fer.unizg.organizator_dogadjaja.domain.Prostor;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProstorRepository extends JpaRepository<Prostor, Long> {


}
