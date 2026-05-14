-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
-- Allow backend service role full access (Spring Boot connects with service role)
CREATE POLICY "Service role has full access to profiles"
    ON profiles FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- SERVICES POLICIES
-- ============================================================
CREATE POLICY "Anyone can view active services"
    ON services FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role can manage services"
    ON services FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- PROVIDERS POLICIES
-- ============================================================
CREATE POLICY "Anyone can view verified providers"
    ON providers FOR SELECT
    USING (is_verified = true);

CREATE POLICY "Service role can manage providers"
    ON providers FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- BOOKINGS POLICIES
-- ============================================================
CREATE POLICY "Service role can manage bookings"
    ON bookings FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- PAYMENTS POLICIES
-- ============================================================
CREATE POLICY "Service role can manage payments"
    ON payments FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- REVIEWS POLICIES
-- ============================================================
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage reviews"
    ON reviews FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================
CREATE POLICY "Service role can manage notifications"
    ON notifications FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- CHAT MESSAGES POLICIES
-- ============================================================
CREATE POLICY "Service role can manage chat"
    ON chat_messages FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- FEEDBACK POLICIES
-- ============================================================
CREATE POLICY "Service role can manage feedback"
    ON feedback FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- CONTACT MESSAGES POLICIES
-- ============================================================
CREATE POLICY "Anyone can submit contact messages"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can manage contact messages"
    ON contact_messages FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- SUBSCRIPTIONS POLICIES
-- ============================================================
CREATE POLICY "Service role can manage subscriptions"
    ON subscriptions FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- COUPONS POLICIES
-- ============================================================
CREATE POLICY "Anyone can view active coupons"
    ON coupons FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role can manage coupons"
    ON coupons FOR ALL
    USING (true)
    WITH CHECK (true);
