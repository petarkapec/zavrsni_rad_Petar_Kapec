package hr.fer.unizg.organizator_dogadjaja.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;


@Entity
public class Gost {

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
    private Integer gostId;

    @Column(nullable = false, length = 50)
    private String ime;

    @Column(length = 50)
    private String prezime;

    @Column(length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rezervacija_id", nullable = false)
    private Rezervacija rezervacija;

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

    public Rezervacija getRezervacija() {
        return rezervacija;
    }

    public void setRezervacija(final Rezervacija rezervacija) {
        this.rezervacija = rezervacija;
    }

}
