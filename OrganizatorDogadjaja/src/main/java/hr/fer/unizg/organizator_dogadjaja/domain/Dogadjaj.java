package hr.fer.unizg.organizator_dogadjaja.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import java.util.Set;


@Entity
public class Dogadjaj {

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
    private Integer dogadjajId;

    @Column(nullable = false, length = 100)
    private String naziv;

    @Column(columnDefinition = "text")
    private String opis;

    @Column
    private String otkazniRok;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prostor_id", nullable = false)
    private Prostor prostor;

    @ManyToMany
    @JoinTable(
            name = "DogadjajPonuda",
            joinColumns = @JoinColumn(name = "dogadjajId"),
            inverseJoinColumns = @JoinColumn(name = "ponudaId")
    )
    private Set<Ponuda> dogadjajPonudaPonudas;

    @OneToMany(mappedBy = "dogadjaj")
    private Set<Slika> dogadjajSlikas;

    @OneToMany(mappedBy = "dogadjaj")
    private Set<Rezervacija> dogadjajRezervacijas;

    public Integer getDogadjajId() {
        return dogadjajId;
    }

    public void setDogadjajId(final Integer dogadjajId) {
        this.dogadjajId = dogadjajId;
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

    public String getOtkazniRok() {
        return otkazniRok;
    }

    public void setOtkazniRok(final String otkazniRok) {
        this.otkazniRok = otkazniRok;
    }

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(final Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public Prostor getProstor() {
        return prostor;
    }

    public void setProstor(final Prostor prostor) {
        this.prostor = prostor;
    }

    public Set<Ponuda> getDogadjajPonudaPonudas() {
        return dogadjajPonudaPonudas;
    }

    public void setDogadjajPonudaPonudas(final Set<Ponuda> dogadjajPonudaPonudas) {
        this.dogadjajPonudaPonudas = dogadjajPonudaPonudas;
    }

    public Set<Slika> getDogadjajSlikas() {
        return dogadjajSlikas;
    }

    public void setDogadjajSlikas(final Set<Slika> dogadjajSlikas) {
        this.dogadjajSlikas = dogadjajSlikas;
    }

    public Set<Rezervacija> getDogadjajRezervacijas() {
        return dogadjajRezervacijas;
    }

    public void setDogadjajRezervacijas(final Set<Rezervacija> dogadjajRezervacijas) {
        this.dogadjajRezervacijas = dogadjajRezervacijas;
    }

}
