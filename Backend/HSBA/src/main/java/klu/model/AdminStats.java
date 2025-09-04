package klu.model;

import java.util.List;

public class AdminStats {
    private long userCount;
    private long bookingCount;
    private long feedbackCount;
    private List<UserGrowthTrend> userGrowthTrends;

    public AdminStats(long userCount, long bookingCount, long feedbackCount, List<UserGrowthTrend> userGrowthTrends) {
        this.userCount = userCount;
        this.bookingCount = bookingCount;
        this.feedbackCount = feedbackCount;
        this.userGrowthTrends = userGrowthTrends;
    }

    public long getUserCount() {
        return userCount;
    }

    public void setUserCount(long userCount) {
        this.userCount = userCount;
    }

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }

    public long getFeedbackCount() {
        return feedbackCount;
    }

    public void setFeedbackCount(long feedbackCount) {
        this.feedbackCount = feedbackCount;
    }

    public List<UserGrowthTrend> getUserGrowthTrends() {
        return userGrowthTrends;
    }

    public void setUserGrowthTrends(List<UserGrowthTrend> userGrowthTrends) {
        this.userGrowthTrends = userGrowthTrends;
    }
}
