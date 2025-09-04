package klu.model;

import java.time.LocalDate;

public class UserGrowthTrend {
    private LocalDate date;
    private int userCount;

    public UserGrowthTrend(LocalDate date, int userCount) {
        this.date = date;
        this.userCount = userCount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getUserCount() {
        return userCount;
    }

    public void setUserCount(int userCount) {
        this.userCount = userCount;
    }
}
