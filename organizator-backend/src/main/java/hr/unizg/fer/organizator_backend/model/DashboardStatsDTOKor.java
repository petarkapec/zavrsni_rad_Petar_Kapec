package hr.unizg.fer.organizator_backend.model;



import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDTOKor {
    private Long totalReservations;
    private Long upcomingEvents;
    private Long guestLists;
    private List<FeaturedEventDTO> featuredEvents;

    // Static nested class for featured events
    public static class FeaturedEventDTO {
        private Integer dogadjaj_id;
        private String naziv;
        private String opis;
        private String prostor_naziv;
        private BigDecimal uk_cijena_po_osobi;
        private BigDecimal uk_cijena_fiksna;

        // Getters and setters
        public Integer getDogadjaj_id() { return dogadjaj_id; }
        public void setDogadjaj_id(Integer dogadjaj_id) { this.dogadjaj_id = dogadjaj_id; }

        public String getNaziv() { return naziv; }
        public void setNaziv(String naziv) { this.naziv = naziv; }

        public String getOpis() { return opis; }
        public void setOpis(String opis) { this.opis = opis; }

        public String getProstor_naziv() { return prostor_naziv; }
        public void setProstor_naziv(String prostor_naziv) { this.prostor_naziv = prostor_naziv; }

        public BigDecimal getUk_cijena_po_osobi() { return uk_cijena_po_osobi; }
        public void setUk_cijena_po_osobi(BigDecimal uk_cijena_po_osobi) { this.uk_cijena_po_osobi = uk_cijena_po_osobi; }

        public BigDecimal getUk_cijena_fiksna() { return uk_cijena_fiksna; }
        public void setUk_cijena_fiksna(BigDecimal uk_cijena_fiksna) { this.uk_cijena_fiksna = uk_cijena_fiksna; }
    }

    // Getters and setters for main class
    public Long getTotalReservations() { return totalReservations; }
    public void setTotalReservations(Long totalReservations) { this.totalReservations = totalReservations; }

    public Long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(Long upcomingEvents) { this.upcomingEvents = upcomingEvents; }

    public Long getGuestLists() { return guestLists; }
    public void setGuestLists(Long guestLists) { this.guestLists = guestLists; }

    public List<FeaturedEventDTO> getFeaturedEvents() { return featuredEvents; }
    public void setFeaturedEvents(List<FeaturedEventDTO> featuredEvents) { this.featuredEvents = featuredEvents; }
}