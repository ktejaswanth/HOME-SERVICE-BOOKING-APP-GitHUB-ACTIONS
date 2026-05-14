-- ============================================================
-- SEED DATA — Services, Admin, Sample Providers
-- ============================================================

-- ============================================================
-- ADMIN ACCOUNT
-- ============================================================
INSERT INTO profiles (id, full_name, email, phone, role, password_hash, is_active, email_verified, city) VALUES
(uuid_generate_v4(), 'Admin User', 'ktejaswanth05@gmail.com', '8688088449', 'admin', 'admin123', true, true, 'Bangalore');

-- ============================================================
-- SERVICE CATEGORIES
-- ============================================================
INSERT INTO services (name, description, category, base_price, duration_minutes, icon_url, is_active, popularity_score) VALUES
-- Repairs & Maintenance
('Electrician', 'Wiring, switchboard repair, fan installation, electrical safety checks', 'repairs', 299.00, 60, '⚡', true, 95),
('Plumbing', 'Pipe fitting, leak repair, tap installation, drainage solutions', 'repairs', 249.00, 60, '🔧', true, 90),
('AC Repair', 'AC servicing, gas refill, installation, deep cleaning', 'repairs', 399.00, 90, '❄️', true, 88),
('Appliance Repair', 'Washing machine, refrigerator, microwave, geyser repair', 'repairs', 349.00, 60, '🔌', true, 75),
('Carpentry', 'Furniture repair, door fixing, cabinet installation', 'repairs', 399.00, 120, '🪚', true, 65),

-- Cleaning Services
('Home Cleaning', 'Deep cleaning, bathroom cleaning, kitchen cleaning', 'cleaning', 499.00, 120, '🧹', true, 92),
('Sofa Cleaning', 'Fabric sofa, leather sofa, upholstery deep cleaning', 'cleaning', 599.00, 90, '🛋️', true, 60),
('Carpet Cleaning', 'Carpet shampooing, stain removal, sanitization', 'cleaning', 449.00, 90, '🧽', true, 55),
('Car Washing', 'Exterior wash, interior cleaning, polishing, detailing', 'cleaning', 299.00, 60, '🚗', true, 70),

-- Beauty & Wellness
('Salon at Home', 'Haircut, styling, hair spa, keratin treatment', 'beauty', 599.00, 90, '💇', true, 85),
('Spa at Home', 'Full body massage, head massage, aromatherapy', 'beauty', 799.00, 90, '💆', true, 80),
('Facial & Skincare', 'Cleanup, facial, bleach, de-tan, waxing', 'beauty', 499.00, 60, '✨', true, 78),

-- Home Improvement
('Painting', 'Interior painting, exterior painting, wall textures', 'improvement', 1499.00, 480, '🎨', true, 72),
('Pest Control', 'Cockroach, ant, termite, bed bug, mosquito treatment', 'improvement', 899.00, 120, '🐛', true, 68),
('Waterproofing', 'Terrace, bathroom, wall waterproofing solutions', 'improvement', 1999.00, 240, '💧', true, 45),

-- Care Services
('Babysitting', 'Professional childcare, nanny services, tutoring', 'care', 399.00, 240, '👶', true, 50),
('Elderly Care', 'Companionship, medical assistance, daily care', 'care', 599.00, 480, '👴', true, 48),
('Pet Care', 'Dog walking, pet grooming, pet sitting', 'care', 349.00, 120, '🐾', true, 52),

-- Moving & Storage
('Packers & Movers', 'Packing, loading, transportation, unpacking', 'moving', 2999.00, 480, '📦', true, 62),
('Storage Solutions', 'Short-term and long-term storage facilities', 'moving', 1499.00, 60, '🏢', true, 30);

-- ============================================================
-- SAMPLE PROVIDERS
-- ============================================================
DO $$
DECLARE
    provider1_profile_id UUID;
    provider2_profile_id UUID;
    provider3_profile_id UUID;
    provider1_id UUID;
    provider2_id UUID;
    provider3_id UUID;
    electrician_id UUID;
    plumbing_id UUID;
    ac_repair_id UUID;
    cleaning_id UUID;
BEGIN
    -- Create provider profiles
    INSERT INTO profiles (id, full_name, email, phone, role, password_hash, is_active, email_verified, city, latitude, longitude)
    VALUES (uuid_generate_v4(), 'Ramesh Kumar', 'ramesh.kumar@example.com', '9876543210', 'provider', 'provider123', true, true, 'Bangalore', 12.9716, 77.5946)
    RETURNING id INTO provider1_profile_id;

    INSERT INTO profiles (id, full_name, email, phone, role, password_hash, is_active, email_verified, city, latitude, longitude)
    VALUES (uuid_generate_v4(), 'Vijay Plumber', 'vijay.plumber@example.com', '9876543211', 'provider', 'provider123', true, true, 'Bangalore', 12.9352, 77.6245)
    RETURNING id INTO provider2_profile_id;

    INSERT INTO profiles (id, full_name, email, phone, role, password_hash, is_active, email_verified, city, latitude, longitude)
    VALUES (uuid_generate_v4(), 'Arun AC Expert', 'arun.ac@example.com', '9876543212', 'provider', 'provider123', true, true, 'Bangalore', 12.9698, 77.7500)
    RETURNING id INTO provider3_profile_id;

    -- Create provider details
    INSERT INTO providers (id, profile_id, specialization, experience_years, rating, total_reviews, total_jobs_completed, hourly_rate, bio, is_verified, verification_status, is_available, latitude, longitude)
    VALUES (uuid_generate_v4(), provider1_profile_id, ARRAY['Electrician', 'Wiring'], 8, 4.8, 1203, 856, 350.00, 'Expert electrician with 8+ years of experience. Specializing in residential and commercial electrical work.', true, 'approved', true, 12.9716, 77.5946)
    RETURNING id INTO provider1_id;

    INSERT INTO providers (id, profile_id, specialization, experience_years, rating, total_reviews, total_jobs_completed, hourly_rate, bio, is_verified, verification_status, is_available, latitude, longitude)
    VALUES (uuid_generate_v4(), provider2_profile_id, ARRAY['Plumbing', 'Pipe Fitting'], 6, 4.7, 891, 654, 300.00, 'Professional plumber specializing in leak detection and repair. Available 24/7 for emergencies.', true, 'approved', true, 12.9352, 77.6245)
    RETURNING id INTO provider2_id;

    INSERT INTO providers (id, profile_id, specialization, experience_years, rating, total_reviews, total_jobs_completed, hourly_rate, bio, is_verified, verification_status, is_available, latitude, longitude)
    VALUES (uuid_generate_v4(), provider3_profile_id, ARRAY['AC Repair', 'HVAC'], 5, 4.9, 567, 432, 400.00, 'Certified HVAC technician. Expert in all brands of AC servicing, installation, and repair.', true, 'approved', true, 12.9698, 77.7500)
    RETURNING id INTO provider3_id;

    -- Link providers to services
    SELECT id INTO electrician_id FROM services WHERE name = 'Electrician' LIMIT 1;
    SELECT id INTO plumbing_id FROM services WHERE name = 'Plumbing' LIMIT 1;
    SELECT id INTO ac_repair_id FROM services WHERE name = 'AC Repair' LIMIT 1;
    SELECT id INTO cleaning_id FROM services WHERE name = 'Home Cleaning' LIMIT 1;

    INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
    (provider1_id, electrician_id, 299.00),
    (provider2_id, plumbing_id, 249.00),
    (provider3_id, ac_repair_id, 399.00);
END $$;

-- ============================================================
-- SAMPLE COUPONS
-- ============================================================
INSERT INTO coupons (code, description, discount_percent, max_uses, min_order_value, valid_from, valid_until, is_active) VALUES
('WELCOME50', 'Get 50% off on your first booking', 50.00, 1000, 199.00, NOW(), NOW() + INTERVAL '90 days', true),
('FLAT100', 'Flat ₹100 off on orders above ₹500', NULL, 500, 500.00, NOW(), NOW() + INTERVAL '30 days', true),
('PREMIUM20', 'Premium members get 20% off', 20.00, 10000, 0, NOW(), NOW() + INTERVAL '365 days', true);

-- Update discount_amount for FLAT100
UPDATE coupons SET discount_amount = 100.00 WHERE code = 'FLAT100';
