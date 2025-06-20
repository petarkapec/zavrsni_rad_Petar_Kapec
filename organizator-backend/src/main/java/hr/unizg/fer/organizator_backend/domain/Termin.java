package hr.unizg.fer.organizator_backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import java.time.OffsetDateTime;
import java.util.Set;


@Entity
public class Termin {
    //Termin
    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Integer terminId;

    @Column(nullable = false)
    private OffsetDateTime datumPocetka;

    @Column(nullable = false)
    private OffsetDateTime datumZavrsetka;

    @Column
    private Boolean zauzeto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prostor_id", nullable = false)
    private Prostor prostor;

    @OneToMany(mappedBy = "prostorTermin")
    private Set<Rezervacija> prostorTerminRezervacijas;

    public Integer getTerminId() {
        return terminId;
    }

    public void setTerminId(final Integer terminId) {
        this.terminId = terminId;
    }

    public OffsetDateTime getDatumPocetka() {
        return datumPocetka;
    }

    public void setDatumPocetka(final OffsetDateTime datumPocetka) {
        this.datumPocetka = datumPocetka;
    }

    public OffsetDateTime getDatumZavrsetka() {
        return datumZavrsetka;
    }

    public void setDatumZavrsetka(final OffsetDateTime datumZavrsetka) {
        this.datumZavrsetka = datumZavrsetka;
    }

    public Boolean getZauzeto() {
        return zauzeto;
    }

    public void setZauzeto(final Boolean zauzeto) {
        this.zauzeto = zauzeto;
    }

    public Prostor getProstor() {
        return prostor;
    }

    public void setProstor(final Prostor prostor) {
        this.prostor = prostor;
    }

    public Set<Rezervacija> getProstorTerminRezervacijas() {
        return prostorTerminRezervacijas;
    }

    public void setProstorTerminRezervacijas(final Set<Rezervacija> prostorTerminRezervacijas) {
        this.prostorTerminRezervacijas = prostorTerminRezervacijas;
    }

}
