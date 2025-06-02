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
public class Slika {

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
    private Integer slikaId;

    @Column(nullable = false, columnDefinition = "text")
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dogadjaj_id", nullable = false)
    private Dogadjaj dogadjaj;

    public Integer getSlikaId() {
        return slikaId;
    }

    public void setSlikaId(final Integer slikaId) {
        this.slikaId = slikaId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(final String url) {
        this.url = url;
    }

    public Dogadjaj getDogadjaj() {
        return dogadjaj;
    }

    public void setDogadjaj(final Dogadjaj dogadjaj) {
        this.dogadjaj = dogadjaj;
    }

}
