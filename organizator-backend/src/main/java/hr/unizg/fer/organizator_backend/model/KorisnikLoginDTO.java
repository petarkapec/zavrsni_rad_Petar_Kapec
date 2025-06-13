package hr.unizg.fer.organizator_backend.model;

import hr.unizg.fer.organizator_backend.domain.Korisnik;

public class KorisnikLoginDTO {
    private Integer korisnikId;
    private String username;
    private String ime;
    private String prezime;
    private String email;
    private String uloga;

    // Getteri i setteri

    public KorisnikLoginDTO(Korisnik korisnik) {
        this.korisnikId = korisnik.getKorisnikId();
        this.username = korisnik.getUsername();
        this.ime = korisnik.getIme();
        this.prezime = korisnik.getPrezime();
        this.email = korisnik.getEmail();
        this.uloga = korisnik.getUloga();
    }

    public Integer getKorisnikId() {
        return korisnikId;
    }

    public void setKorisnikId(Integer korisnikId) {
        this.korisnikId = korisnikId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUloga() {
        return uloga;
    }

    public void setUloga(String uloga) {
        this.uloga = uloga;
    }
}
