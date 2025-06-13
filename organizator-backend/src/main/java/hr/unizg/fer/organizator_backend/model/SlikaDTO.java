package hr.unizg.fer.organizator_backend.model;

import jakarta.validation.constraints.NotNull;


public class SlikaDTO {

    private Integer slikaId;

    @NotNull
    private String url;

    @NotNull
    private Integer ponuda;

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

    public Integer getPonuda() {
        return ponuda;
    }

    public void setPonuda(final Integer ponuda) {
        this.ponuda = ponuda;
    }

}
