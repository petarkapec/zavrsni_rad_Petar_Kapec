package hr.fer.unizg.organizator_dogadjaja.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;


public class RezervacijaDTO {

    private Integer rezervacijaId;

    @NotNull
    private OffsetDateTime datumPocetka;

    @NotNull
    private OffsetDateTime datumZavrsetka;

    private OffsetDateTime otkazniRok;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal ukupnaCijena;

    private String posebniZahtjevi;

    @Size(max = 255)
    private String status;

    @Size(max = 255)
    private String statusPlacanja;

    @NotNull
    private Integer korisnik;

    @NotNull
    private Integer dogadjaj;

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

}
