package hr.unizg.fer.organizator_backend.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Set;


@Entity
public class Ponuda {

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
    private Integer ponudaId;

    @Column(nullable = false)
    private String naziv;

    @Column(columnDefinition = "text")
    private String opis;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cijena;

    @Column(nullable = false)
    private String tipCijene;

    @Column(nullable = false)
    private String kategorija;

    @ManyToMany(mappedBy = "dogadjajPonudaPonudas")
    private Set<Dogadjaj> dogadjajPonudaDogadjajs;

    @OneToMany(mappedBy = "ponuda")
    private Set<Slika> ponudaSlikas;

    @ManyToOne
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    public Korisnik getKorisnik() {
        return korisnik;
    }
    public void setKorisnik(Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public Integer getPonudaId() {
        return ponudaId;
    }

    public void setPonudaId(final Integer ponudaId) {
        this.ponudaId = ponudaId;
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

    public String getTipCijene() {
        return tipCijene;
    }

    public void setTipCijene(final String tipCijene) {
        this.tipCijene = tipCijene;
    }

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(final String kategorija) {
        this.kategorija = kategorija;
    }

    public Set<Dogadjaj> getDogadjajPonudaDogadjajs() {
        return dogadjajPonudaDogadjajs;
    }

    public void setDogadjajPonudaDogadjajs(final Set<Dogadjaj> dogadjajPonudaDogadjajs) {
        this.dogadjajPonudaDogadjajs = dogadjajPonudaDogadjajs;
    }

    public Set<Slika> getPonudaSlikas() {
        return ponudaSlikas;
    }

    public void setPonudaSlikas(final Set<Slika> ponudaSlikas) {
        this.ponudaSlikas = ponudaSlikas;
    }

}
