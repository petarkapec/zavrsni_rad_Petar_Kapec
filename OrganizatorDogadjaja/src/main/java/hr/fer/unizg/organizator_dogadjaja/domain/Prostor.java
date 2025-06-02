package hr.fer.unizg.organizator_dogadjaja.domain;

import jakarta.persistence.*;

import java.util.Set;


@Entity
@PrimaryKeyJoinColumn(name = "ponuda_id")
public class Prostor extends Ponuda {
    @Column(nullable = false, columnDefinition = "text")
    private String adresa;

    @Column(nullable = false)
    private Integer kapacitet;

    @OneToMany(mappedBy = "prostor")
    private Set<Dogadjaj> prostorDogadjajs;

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(final String adresa) {
        this.adresa = adresa;
    }

    public Integer getKapacitet() {
        return kapacitet;
    }

    public void setKapacitet(final Integer kapacitet) {
        this.kapacitet = kapacitet;
    }

    public Set<Dogadjaj> getProstorDogadjajs() {
        return prostorDogadjajs;
    }

    public void setProstorDogadjajs(final Set<Dogadjaj> prostorDogadjajs) {
        this.prostorDogadjajs = prostorDogadjajs;
    }
}
