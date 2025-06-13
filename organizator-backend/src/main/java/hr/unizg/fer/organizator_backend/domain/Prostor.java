package hr.unizg.fer.organizator_backend.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Set;


@Entity
public class Prostor {

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
    private Integer prostorId;

    @Column(nullable = false)
    private String naziv;

    @Column(columnDefinition = "text")
    private String opis;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cijena;

    @Column(nullable = false, columnDefinition = "text")
    private String adresa;

    @Column(nullable = false)
    private Integer kapacitet;

    @OneToMany(mappedBy = "prostor")
    private Set<Dogadjaj> prostorDogadjajs;

    @OneToMany(mappedBy = "prostor", fetch = FetchType.EAGER)
    private Set<Termin> prostorTermins;

    @ManyToOne
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public Integer getProstorId() {
        return prostorId;
    }

    public void setProstorId(final Integer prostorId) {
        this.prostorId = prostorId;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(final String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(final String opis) {
        this.opis = opis;
    }

    public BigDecimal getCijena() {
        return cijena;
    }

    public void setCijena(final BigDecimal cijena) {
        this.cijena = cijena;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(final String adresa) {
        this.adresa = adresa;
    }

    public Integer getKapacitet() {
        return kapacitet;
    }

    public void setKapacitet(final Integer kapacitet) {
        this.kapacitet = kapacitet;
    }

    public Set<Dogadjaj> getProstorDogadjajs() {
        return prostorDogadjajs;
    }

    public void setProstorDogadjajs(final Set<Dogadjaj> prostorDogadjajs) {
        this.prostorDogadjajs = prostorDogadjajs;
    }

    public Set<Termin> getProstorTermins() {
        return prostorTermins;
    }

    public void setProstorTermins(final Set<Termin> prostorTermins) {
        this.prostorTermins = prostorTermins;
    }

}
