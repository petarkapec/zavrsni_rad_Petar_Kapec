package hr.unizg.fer.organizator_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;


public class ProstorDTO {

    private Integer prostorId;

    @NotNull
    @Size(max = 255)
    private String naziv;

    private String opis;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal cijena;

    @NotNull
    private String adresa;

    @NotNull
    private Integer kapacitet;

    private Integer korisnik;


    public Integer getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Integer korisnik) {
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

}
