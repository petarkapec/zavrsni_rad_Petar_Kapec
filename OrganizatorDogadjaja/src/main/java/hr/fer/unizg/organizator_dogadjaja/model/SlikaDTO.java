package hr.fer.unizg.organizator_dogadjaja.model;

import jakarta.validation.constraints.NotNull;


public class SlikaDTO {

    private Integer slikaId;

    @NotNull
    private String url;

    @NotNull
    private Integer dogadjaj;

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

    public Integer getDogadjaj() {
        return dogadjaj;
    }

    public void setDogadjaj(final Integer dogadjaj) {
        this.dogadjaj = dogadjaj;
    }

}
