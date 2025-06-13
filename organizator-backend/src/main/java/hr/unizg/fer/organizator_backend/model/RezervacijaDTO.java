package hr.unizg.fer.organizator_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;


public class RezervacijaDTO {

    private Integer rezervacijaId;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal ukupnaCijena;

    private String posebniZahtjevi;

    @NotNull
    @Size(max = 255)
    private String status;

    @NotNull
    private Integer korisnik;

    @NotNull
    private Integer dogadjaj;

    @NotNull
    private Integer prostorTermin;

    private List<GostDTO> gosti;

    // ... existing getters and setters ...

    public List<GostDTO> getGosti() {
        return gosti;
    }

    public void setGosti(List<GostDTO> gosti) {
        this.gosti = gosti;
    }


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

    public Integer getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(final Integer korisnik) {
        this.korisnik = korisnik;
    }

    public Integer getDogadjaj() {
        return dogadjaj;
    }

    public void setDogadjaj(final Integer dogadjaj) {
        this.dogadjaj = dogadjaj;
    }

    public Integer getProstorTermin() {
        return prostorTermin;
    }

    public void setProstorTermin(final Integer prostorTermin) {
        this.prostorTermin = prostorTermin;
    }

}
