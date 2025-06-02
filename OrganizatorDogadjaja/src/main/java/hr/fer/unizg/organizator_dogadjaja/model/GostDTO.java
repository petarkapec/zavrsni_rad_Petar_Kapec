package hr.fer.unizg.organizator_dogadjaja.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class GostDTO {

    private Integer gostId;

    @NotNull
    @Size(max = 50)
    private String ime;

    @Size(max = 50)
    private String prezime;

    @Size(max = 100)
    private String email;

    @NotNull
    private Integer rezervacija;

    public Integer getGostId() {
        return gostId;
    }

    public void setGostId(final Integer gostId) {
        this.gostId = gostId;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(final String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(final String prezime) {
        this.prezime = prezime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public Integer getRezervacija() {
        return rezervacija;
    }

    public void setRezervacija(final Integer rezervacija) {
        this.rezervacija = rezervacija;
    }

}
