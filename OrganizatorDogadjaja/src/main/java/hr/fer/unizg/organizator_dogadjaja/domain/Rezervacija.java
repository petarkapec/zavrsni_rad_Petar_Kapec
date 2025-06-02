package hr.fer.unizg.organizator_dogadjaja.domain;

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
import java.time.OffsetDateTime;
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

    @Column(nullable = false)
    private OffsetDateTime datumPocetka;

    @Column(nullable = false)
    private OffsetDateTime datumZavrsetka;

    @Column
    private OffsetDateTime otkazniRok;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ukupnaCijena;

    @Column(columnDefinition = "text")
    private String posebniZahtjevi;

    @Column
    private String status;

    @Column
    private String statusPlacanja;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dogadjaj_id", nullable = false)
    private Dogadjaj dogadjaj;

    @OneToMany(mappedBy = "rezervacija")
    private Set<Gost> rezervacijaGosts;

    public Integer getRezervacijaId() {
        return rezervacijaId;
    }

    public void setRezervacijaId(final Integer rezervacijaId) {
        this.rezervacijaId = rezervacijaId;
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

    public OffsetDateTime getOtkazniRok() {
        return otkazniRok;
    }

    public void setOtkazniRok(final OffsetDateTime otkazniRok) {
        this.otkazniRok = otkazniRok;
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

    public String getStatusPlacanja() {
        return statusPlacanja;
    }

    public void setStatusPlacanja(final String statusPlacanja) {
        this.statusPlacanja = statusPlacanja;
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

    public Set<Gost> getRezervacijaGosts() {
        return rezervacijaGosts;
    }

    public void setRezervacijaGosts(final Set<Gost> rezervacijaGosts) {
        this.rezervacijaGosts = rezervacijaGosts;
    }

}
