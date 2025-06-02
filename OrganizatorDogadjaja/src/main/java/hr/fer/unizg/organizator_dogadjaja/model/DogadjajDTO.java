package hr.fer.unizg.organizator_dogadjaja.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;


public class DogadjajDTO {

    private Integer dogadjajId;

    @NotNull
    @Size(max = 100)
    private String naziv;

    private String opis;

    @Size(max = 255)
    private String otkazniRok;

    @NotNull
    private Integer korisnik;

    @NotNull
    private Long prostor;

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

    public String getOtkazniRok() {
        return otkazniRok;
    }

    public void setOtkazniRok(final String otkazniRok) {
        this.otkazniRok = otkazniRok;
    }

    public Integer getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(final Integer korisnik) {
        this.korisnik = korisnik;
    }

    public Long getProstor() {
        return prostor;
    }

    public void setProstor(final Long prostor) {
        this.prostor = prostor;
    }

    public List<Integer> getDogadjajPonudaPonudas() {
        return dogadjajPonudaPonudas;
    }

    public void setDogadjajPonudaPonudas(final List<Integer> dogadjajPonudaPonudas) {
        this.dogadjajPonudaPonudas = dogadjajPonudaPonudas;
    }

}
