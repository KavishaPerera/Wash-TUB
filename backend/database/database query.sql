-- ======================================================
-- DATABASE
-- ======================================================

CREATE DATABASE IF NOT EXISTS washtub_laundry_databases
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE washtub_laundry_databases;

-- ======================================================
-- USERS (SYSTEM LOGIN)
-- ======================================================

CREATE TABLE users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role ENUM('OWNER','STAFF','DELIVERY','CUSTOMER') NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ======================================================
-- CUSTOMER TABLES
-- ======================================================

CREATE TABLE customers (
    customer_id BIGINT UNSIGNED PRIMARY KEY,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE walk_in_customers (
    walkin_customer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ======================================================
-- STAFF
-- ======================================================

CREATE TABLE staff (
    staff_id BIGINT UNSIGNED PRIMARY KEY,
    staff_role VARCHAR(60),
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE delivery_people (
    delivery_person_id BIGINT UNSIGNED PRIMARY KEY,
    FOREIGN KEY (delivery_person_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- ADDRESSES
-- ======================================================

CREATE TABLE addresses (
    address_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    line1 VARCHAR(200),
    line2 VARCHAR(200),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    notes VARCHAR(255),
    is_default TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- SERVICE CATEGORIES
-- ======================================================

CREATE TABLE service_categories (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

-- ======================================================
-- SERVICES
-- ======================================================

CREATE TABLE services (
    service_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED,
    service_name VARCHAR(120) NOT NULL,
    description TEXT,
    unit_type ENUM('KG','PIECE','ITEM') DEFAULT 'ITEM',
    is_active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES service_categories(category_id)
) ENGINE=InnoDB;

-- ======================================================
-- SERVICE PRICE HISTORY
-- ======================================================

CREATE TABLE service_price_history (
    service_price_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT UNSIGNED NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    effective_from DATETIME DEFAULT CURRENT_TIMESTAMP,
    effective_to DATETIME NULL,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- POS SESSIONS (CASHIER SHIFT)
-- ======================================================

CREATE TABLE pos_sessions (
    session_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT UNSIGNED NOT NULL,
    opened_at DATETIME NOT NULL,
    closed_at DATETIME,
    opening_cash DECIMAL(10,2),
    closing_cash DECIMAL(10,2),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
) ENGINE=InnoDB;

-- ======================================================
-- ORDER STATUSES
-- ======================================================

CREATE TABLE order_statuses (
    status_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    status_code VARCHAR(40) UNIQUE
) ENGINE=InnoDB;

INSERT INTO order_statuses (status_code) VALUES
('PLACED'),
('PROCESSING'),
('READY'),
('OUT_FOR_DELIVERY'),
('COMPLETED'),
('CANCELLED');

-- ======================================================
-- ORDERS
-- ======================================================

CREATE TABLE orders (
    order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED,
    walkin_customer_id BIGINT UNSIGNED,
    order_type ENUM('WALK_IN','ONLINE') NOT NULL,
    placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_status_id SMALLINT UNSIGNED,
    total_amount DECIMAL(10,2) DEFAULT 0,
    special_instructions VARCHAR(500),
    created_by_staff_id BIGINT UNSIGNED,
    session_id BIGINT UNSIGNED,
    cancelled_at DATETIME,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (walkin_customer_id) REFERENCES walk_in_customers(walkin_customer_id),
    FOREIGN KEY (created_by_staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (session_id) REFERENCES pos_sessions(session_id),
    FOREIGN KEY (current_status_id) REFERENCES order_statuses(status_id)
) ENGINE=InnoDB;

-- ======================================================
-- ORDER ITEMS
-- ======================================================

CREATE TABLE order_items (
    order_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    garment_notes VARCHAR(200),

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id)
) ENGINE=InnoDB;

-- ======================================================
-- ORDER STATUS HISTORY
-- ======================================================

CREATE TABLE order_status_history (
    history_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    status_id SMALLINT UNSIGNED NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_by_user_id BIGINT UNSIGNED,

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES order_statuses(status_id),
    FOREIGN KEY (changed_by_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- ======================================================
-- PICKUP & DELIVERY
-- ======================================================

CREATE TABLE pickup_delivery (
    pickup_delivery_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED UNIQUE,
    pickup_address_id BIGINT UNSIGNED,
    delivery_address_id BIGINT UNSIGNED,
    pickup_scheduled_at DATETIME,
    pickup_actual_at DATETIME,
    delivery_scheduled_at DATETIME,
    delivery_actual_at DATETIME,
    delivery_person_id BIGINT UNSIGNED,
    pd_status ENUM('NOT_REQUIRED','SCHEDULED','IN_PROGRESS','DONE','FAILED') DEFAULT 'SCHEDULED',

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (pickup_address_id) REFERENCES addresses(address_id),
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(address_id),
    FOREIGN KEY (delivery_person_id) REFERENCES delivery_people(delivery_person_id)
) ENGINE=InnoDB;

-- ======================================================
-- PAYMENTS
-- ======================================================

CREATE TABLE payments (
    payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED UNIQUE,
    method ENUM('CASH','CARD','ONLINE'),
    amount DECIMAL(10,2),
    status ENUM('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
    paid_at DATETIME,
    provider_txn_id VARCHAR(120),

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- RECEIPTS
-- ======================================================

CREATE TABLE receipts (
    receipt_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT UNSIGNED UNIQUE,
    receipt_number VARCHAR(60) UNIQUE,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),

    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- NOTIFICATIONS
-- ======================================================

CREATE TABLE notifications (
    notification_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    channel ENUM('SMS','EMAIL','PUSH'),
    message TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivery_status ENUM('QUEUED','SENT','FAILED') DEFAULT 'QUEUED',

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- REPORTS
-- ======================================================

CREATE TABLE reports (
    report_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT UNSIGNED,
    report_type ENUM('DAILY','WEEKLY','MONTHLY'),
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),

    FOREIGN KEY (owner_id) REFERENCES users(user_id)
) ENGINE=InnoDB;