package hr.unizg.fer.organizator_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;


public class DogadjajDTO {

    private Integer dogadjajId;

    @NotNull
    @Size(max = 255)
    private String naziv;

    private String opis;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal ukCijenaPoOsobi;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal ukCijenaFiksna;

    @NotNull
    private Integer otkazniRok;

    @NotNull
    private Integer korisnik;

    private Integer prostorId;
    private String prostorNaziv;
    private String prostorAdresa;
    private Integer prostorKapacitet;
    private String organizatorIme;
    private String organizatorPrezime;


    private List<Integer> dogadjajPonudaPonudas;

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

    public BigDecimal getUkCijenaPoOsobi() {
        return ukCijenaPoOsobi;
    }

    public void setUkCijenaPoOsobi(final BigDecimal ukCijenaPoOsobi) {
        this.ukCijenaPoOsobi = ukCijenaPoOsobi;
    }

    public BigDecimal getUkCijenaFiksna() {
        return ukCijenaFiksna;
    }

    public void setUkCijenaFiksna(final BigDecimal ukCijenaFiksna) {
        this.ukCijenaFiksna = ukCijenaFiksna;
    }

    public Integer getOtkazniRok() {
        return otkazniRok;
    }

    public void setOtkazniRok(final Integer otkazniRok) {
        this.otkazniRok = otkazniRok;
    }

    public Integer getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(final Integer korisnik) {
        this.korisnik = korisnik;
    }

    public List<Integer> getDogadjajPonudaPonudas() {
        return dogadjajPonudaPonudas;
    }

    public void setDogadjajPonudaPonudas(final List<Integer> dogadjajPonudaPonudas) {
        this.dogadjajPonudaPonudas = dogadjajPonudaPonudas;
    }


    public String getProstorNaziv() {
        return prostorNaziv;
    }

    public void setProstorNaziv(String prostorNaziv) {
        this.prostorNaziv = prostorNaziv;
    }

    public String getProstorAdresa() {
        return prostorAdresa;
    }

    public void setProstorAdresa(String prostorAdresa) {
        this.prostorAdresa = prostorAdresa;
    }

    public Integer getProstorKapacitet() {
        return prostorKapacitet;
    }

    public void setProstorKapacitet(Integer prostorKapacitet) {
        this.prostorKapacitet = prostorKapacitet;
    }

    public String getOrganizatorIme() {
        return organizatorIme;
    }

    public void setOrganizatorIme(String organizatorIme) {
        this.organizatorIme = organizatorIme;
    }

    public String getOrganizatorPrezime() {
        return organizatorPrezime;
    }

    public void setOrganizatorPrezime(String organizatorPrezime) {
        this.organizatorPrezime = organizatorPrezime;
    }

    public Integer getProstorId() {
        return prostorId;
    }
    public void setProstorId(Integer prostorId) {
        this.prostorId = prostorId;
    }
}
