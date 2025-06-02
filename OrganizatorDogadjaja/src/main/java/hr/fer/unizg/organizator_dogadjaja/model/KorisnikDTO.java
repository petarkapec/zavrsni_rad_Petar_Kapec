package hr.fer.unizg.organizator_dogadjaja.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class KorisnikDTO {

    private Integer korisnikId;

    @NotNull
    @Size(max = 50)
    private String username;

    @NotNull
    @Size(max = 50)
    private String ime;

    @NotNull
    @Size(max = 50)
    private String prezime;

    @NotNull
    @Size(max = 100)
    private String email;

    @NotNull
    @Size(max = 255)
    private String password;

    @NotNull
    @Size(max = 255)
    private String uloga;

    public Integer getKorisnikId() {
        return korisnikId;
    }

    public void setKorisnikId(final Integer korisnikId) {
        this.korisnikId = korisnikId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(final String username) {
        this.username = username;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public String getUloga() {
        return uloga;
    }

    public void setUloga(final String uloga) {
        this.uloga = uloga;
    }

}
