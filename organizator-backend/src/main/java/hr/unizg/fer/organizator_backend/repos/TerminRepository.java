package hr.unizg.fer.organizator_backend.repos;

import hr.unizg.fer.organizator_backend.domain.Prostor;
import hr.unizg.fer.organizator_backend.domain.Termin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TerminRepository extends JpaRepository<Termin, Integer> {

    Termin findFirstByProstor(Prostor prostor);
    List<Termin> findByProstorProstorId(Integer prostorId);
    List<Termin> findByProstorProstorIdOrderByDatumPocetkaAsc(Integer prostorId);
    void deleteByProstorProstorId(Integer prostorId);



}
