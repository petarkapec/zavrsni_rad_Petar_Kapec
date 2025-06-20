package hr.unizg.fer.organizator_backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;

import java.util.List;
import java.util.Set;


@Entity
public class Korisnik {
    //Korisnik
    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Integer korisnikId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String ime;

    @Column(nullable = false)
    private String prezime;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String uloga;


    @JsonIgnore
    @OneToMany(mappedBy = "korisnik")
    private Set<Dogadjaj> korisnikDogadjajs;

    @JsonIgnore
    @OneToMany(mappedBy = "korisnik")
    private Set<Rezervacija> korisnikRezervacijas;

    @JsonIgnore
    @OneToMany(mappedBy = "korisnik")
    private List<Ponuda> ponude;

    @JsonIgnore
    @OneToMany(mappedBy = "korisnik")
    private List<Prostor> prostori;

    public List<Ponuda> getPonude() {
        return ponude;
    }

    public void setPonude(List<Ponuda> ponude) {
        this.ponude = ponude;
    }

    public List<Prostor> getProstori() {
        return prostori;
    }

    public void setProstori(List<Prostor> prostori) {
        this.prostori = prostori;
    }

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

    public Set<Dogadjaj> getKorisnikDogadjajs() {
        return korisnikDogadjajs;
    }

    public void setKorisnikDogadjajs(final Set<Dogadjaj> korisnikDogadjajs) {
        this.korisnikDogadjajs = korisnikDogadjajs;
    }

    public Set<Rezervacija> getKorisnikRezervacijas() {
        return korisnikRezervacijas;
    }

    public void setKorisnikRezervacijas(final Set<Rezervacija> korisnikRezervacijas) {
        this.korisnikRezervacijas = korisnikRezervacijas;
    }

}
