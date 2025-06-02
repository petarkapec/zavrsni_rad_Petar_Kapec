package hr.fer.unizg.organizator_dogadjaja.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;


public class PonudaDTO {

    private Integer ponudaId;

    @NotNull
    @Size(max = 100)
    private String naziv;

    private String opis;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal ukCijenaFiksna;

    @NotNull
    @Size(max = 255)
    private String kategorija;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal cijenaPoOsobi;

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

}
