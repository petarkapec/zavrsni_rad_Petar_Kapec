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
import java.math.BigDecimal;
import java.util.Set;


@Entity
public class Rezervacija {

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
    private Integer rezervacijaId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ukupnaCijena;

    @Column(columnDefinition = "text")
    private String posebniZahtjevi;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dogadjaj_id", nullable = false)
    private Dogadjaj dogadjaj;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prostor_termin_id", nullable = false)
    private Termin prostorTermin;

    @OneToMany(mappedBy = "rezervacija")
    private Set<Gost> rezervacijaGosts;

    public Integer getRezervacijaId() {
        return rezervacijaId;
    }

    public void setRezervacijaId(final Integer rezervacijaId) {
        this.rezervacijaId = rezervacijaId;
    }

    public BigDecimal getUkupnaCijena() {
        return ukupnaCijena;
    }

    public void setUkupnaCijena(final BigDecimal ukupnaCijena) {
        this.ukupnaCijena = ukupnaCijena;
    }

    public String getPosebniZahtjevi() {
        return posebniZahtjevi;
    }

    public void setPosebniZahtjevi(final String posebniZahtjevi) {
        this.posebniZahtjevi = posebniZahtjevi;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(final Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public Dogadjaj getDogadjaj() {
        return dogadjaj;
    }

    public void setDogadjaj(final Dogadjaj dogadjaj) {
        this.dogadjaj = dogadjaj;
    }

    public Termin getProstorTermin() {
        return prostorTermin;
    }

    public void setProstorTermin(final Termin prostorTermin) {
        this.prostorTermin = prostorTermin;
    }

    public Set<Gost> getRezervacijaGosts() {
        return rezervacijaGosts;
    }

    public void setRezervacijaGosts(final Set<Gost> rezervacijaGosts) {
        this.rezervacijaGosts = rezervacijaGosts;
    }

}
