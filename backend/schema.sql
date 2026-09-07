-- =========================================================
-- Event Management System - Complete PostgreSQL Schema
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 1. ENUMS
-- =========================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('ATTENDEE', 'ORGANIZER', 'ADMIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled', 'draft');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status') THEN
        CREATE TYPE registration_status AS ENUM ('confirmed', 'cancelled', 'pending');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
    END IF;
END $$;

-- =========================================================
-- 2. USERS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ATTENDEE',
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =========================================================
-- 3. PROFILES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    subcity VARCHAR(100),
    house_number VARCHAR(100),
    profile_picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- =========================================================
-- 4. CATEGORIES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(LOWER(name));

-- =========================================================
-- 5. EVENTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
    organizer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- =========================================================
-- 6. EVENT IMAGES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS event_images (
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    cloudinary_public_id VARCHAR(255),
    caption TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON event_images(event_id);

-- =========================================================
-- 7. REGISTRATIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS registrations (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- =========================================================
-- 8. FEEDBACK TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_event_feedback UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_event_id ON feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);

-- =========================================================
-- 9. NOTIFICATIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'update',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =========================================================
-- 10. PAYMENTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(100),
    transaction_reference VARCHAR(255),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- =========================================================
-- 11. DEFAULT SEED CATEGORIES
-- =========================================================
INSERT INTO categories (name, description)
VALUES 
    ('Technology', 'Conferences, workshops, and meetups for developers, AI engineers, and tech innovators.'),
    ('Music & Concerts', 'Live music shows, festivals, album launches, and musical performances.'),
    ('Business & Networking', 'Corporate summits, startup pitch competitions, and entrepreneurial seminars.'),
    ('Sports & Fitness', 'Marathons, tournaments, yoga workshops, and competitive athletic events.'),
    ('Arts & Culture', 'Art exhibitions, theater plays, gallery showcases, and cultural heritage festivals.'),
    ('Education & Workshops', 'Skill building courses, academic lectures, and certified masterclasses.')
ON CONFLICT (name) DO NOTHING;
