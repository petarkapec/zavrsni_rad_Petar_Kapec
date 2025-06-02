package hr.fer.unizg.organizator_dogadjaja.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Set;


@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Ponuda {
    @Id
    @Column(nullable = true, updatable = true)
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

    @Column(nullable = false, length = 100)
    private String naziv;

    @Column(columnDefinition = "text")
    private String opis;

    @Column(precision = 10, scale = 2)
    private BigDecimal ukCijenaFiksna;

    @Column(nullable = false)
    private String kategorija;

    @Column(precision = 10, scale = 2)
    private BigDecimal cijenaPoOsobi;

    @ManyToMany(mappedBy = "dogadjajPonudaPonudas")
    private Set<Dogadjaj> dogadjajPonudaDogadjajs;



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

    public BigDecimal getUkCijenaFiksna() {
        return ukCijenaFiksna;
    }

    public void setUkCijenaFiksna(final BigDecimal ukCijenaFiksna) {
        this.ukCijenaFiksna = ukCijenaFiksna;
    }

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(final String kategorija) {
        this.kategorija = kategorija;
    }

    public BigDecimal getCijenaPoOsobi() {
        return cijenaPoOsobi;
    }

    public void setCijenaPoOsobi(final BigDecimal cijenaPoOsobi) {
        this.cijenaPoOsobi = cijenaPoOsobi;
    }

    public Set<Prostor> getProstorProstors() {
        return this.getProstorProstors();
    }

    public void setProstorProstors(final Set<Prostor> prostorProstors) {
        this.setProstorProstors(prostorProstors);
    }

    public Set<Dogadjaj> getDogadjajPonudaDogadjajs() {
        return dogadjajPonudaDogadjajs;
    }

    public void setDogadjajPonudaDogadjajs(final Set<Dogadjaj> dogadjajPonudaDogadjajs) {
        this.dogadjajPonudaDogadjajs = dogadjajPonudaDogadjajs;
    }

}
