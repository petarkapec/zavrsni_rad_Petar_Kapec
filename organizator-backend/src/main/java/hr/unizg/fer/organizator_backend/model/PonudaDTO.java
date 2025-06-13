package hr.unizg.fer.organizator_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;


public class PonudaDTO {

    private Integer ponudaId;

    @NotNull
    @Size(max = 255)
    private String naziv;

    private String opis;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal cijena;

    @NotNull
    @Size(max = 255)
    private String tipCijene;

    @NotNull
    @Size(max = 255)
    private String kategorija;

    private Integer korisnik;  // Add this field

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

    public Integer getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Integer korisnik) {
        this.korisnik = korisnik;
    }
}