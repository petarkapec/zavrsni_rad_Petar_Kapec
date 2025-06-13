package hr.unizg.fer.organizator_backend.model;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;


public class TerminDTO {

    private Integer terminId;

    @NotNull
    private OffsetDateTime datumPocetka;

    @NotNull
    private OffsetDateTime datumZavrsetka;

    private Boolean zauzeto;

    @NotNull
    private Integer prostor;

    public Integer getTerminId() {
        return terminId;
    }

    public void setTerminId(final Integer terminId) {
        this.terminId = terminId;
    }

    public OffsetDateTime getDatumPocetka() {
        return datumPocetka;
    }

    public void setDatumPocetka(final OffsetDateTime datumPocetka) {
        this.datumPocetka = datumPocetka;
    }

    public OffsetDateTime getDatumZavrsetka() {
        return datumZavrsetka;
    }

    public void setDatumZavrsetka(final OffsetDateTime datumZavrsetka) {
        this.datumZavrsetka = datumZavrsetka;
    }

    public Boolean getZauzeto() {
        return zauzeto;
    }

    public void setZauzeto(final Boolean zauzeto) {
        this.zauzeto = zauzeto;
    }

    public Integer getProstor() {
        return prostor;
    }

    public void setProstor(final Integer prostor) {
        this.prostor = prostor;
    }

}
