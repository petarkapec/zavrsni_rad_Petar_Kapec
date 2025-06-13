package hr.unizg.fer.organizator_backend.model;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDTO {
    private Long totalEvents;
    private Long totalReservations;
    private Long totalOffers;
    private Long totalSpaces;
    private Long upcomingReservations;

    // Getters and setters
    public Long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(Long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public Long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(Long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public Long getTotalOffers() {
        return totalOffers;
    }

    public void setTotalOffers(Long totalOffers) {
        this.totalOffers = totalOffers;
    }

    public Long getTotalSpaces() {
        return totalSpaces;
    }

    public void setTotalSpaces(Long totalSpaces) {
        this.totalSpaces = totalSpaces;
    }

    public Long getUpcomingReservations() {
        return upcomingReservations;
    }

    public void setUpcomingReservations(Long upcomingReservations) {
        this.upcomingReservations = upcomingReservations;
    }
}
