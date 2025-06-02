package hr.fer.unizg.organizator_dogadjaja.model;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
public class ProstorDTO {

    private Long id;

    @NotNull
    private String adresa;

    @NotNull
    private Integer kapacitet;

    private Integer prostor; // ovo je ponudaId

    private String naziv;
    private String opis;
    private BigDecimal ukCijenaFiksna;
    private String kategorija;
    private BigDecimal cijenaPoOsobi;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
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

    public Integer getProstor() {
        return prostor;
    }

    public void setProstor(final Integer prostor) {
        this.prostor = prostor;
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
}
