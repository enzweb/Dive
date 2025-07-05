-- Schema de base de données pour DiveManager
-- SQLite Database Schema

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    license_number TEXT,
    certification_level TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
    qr_code TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des équipements
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    asset_tag TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    model TEXT,
    manufacturer TEXT,
    status TEXT NOT NULL CHECK (status IN ('available', 'checked_out', 'maintenance', 'retired', 'defective')),
    assigned_to_user_id TEXT,
    location TEXT NOT NULL,
    notes TEXT,
    has_issues BOOLEAN DEFAULT 0,
    issue_count INTEGER DEFAULT 0,
    last_issue_date DATETIME,
    qr_code TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
);

-- Table des mouvements
CREATE TABLE IF NOT EXISTS movements (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checkout', 'checkin', 'maintenance', 'retired')),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    performed_by TEXT NOT NULL,
    has_issues BOOLEAN DEFAULT 0,
    issue_description TEXT,
    method TEXT NOT NULL CHECK (method IN ('manual', 'qr_scan')),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des problèmes
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    reported_by TEXT NOT NULL,
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_to TEXT,
    resolved_at DATETIME,
    resolved_by TEXT,
    resolution TEXT,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('issue', 'maintenance', 'warning', 'info')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    asset_id TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    resolved_at DATETIME,
    resolved_by TEXT,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON assets(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_movements_asset_id ON movements(asset_id);
CREATE INDEX IF NOT EXISTS idx_movements_user_id ON movements(user_id);
CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(date);
CREATE INDEX IF NOT EXISTS idx_issues_asset_id ON issues(asset_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_assets_timestamp 
    AFTER UPDATE ON assets
    BEGIN
        UPDATE assets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;