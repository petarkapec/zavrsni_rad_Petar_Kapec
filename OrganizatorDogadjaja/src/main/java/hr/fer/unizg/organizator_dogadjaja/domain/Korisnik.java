package hr.fer.unizg.organizator_dogadjaja.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import java.util.Set;


@Entity
public class Korisnik {

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

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String ime;

    @Column(nullable = false, length = 50)
    private String prezime;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String uloga;

    @OneToMany(mappedBy = "korisnik")
    private Set<Dogadjaj> korisnikDogadjajs;

    @OneToMany(mappedBy = "korisnik")
    private Set<Rezervacija> korisnikRezervacijas;

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
