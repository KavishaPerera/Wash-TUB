const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('../config/db.config');

async function migrate() {
  try {
    // 1. customers — depends on users(id)
    console.log('Creating customers table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id INT PRIMARY KEY,
        CONSTRAINT fk_customers_user
          FOREIGN KEY (customer_id) REFERENCES users(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log('✅ customers table ready');

    // 2. staff — depends on users(id)
    console.log('Creating staff table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        staff_id INT PRIMARY KEY,
        staff_role VARCHAR(60) NOT NULL,
        CONSTRAINT fk_staff_user
          FOREIGN KEY (staff_id) REFERENCES users(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log('✅ staff table ready');

    // 3. delivery_people — depends on users(id)
    console.log('Creating delivery_people table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS delivery_people (
        delivery_person_id INT PRIMARY KEY,
        CONSTRAINT fk_delivery_user
          FOREIGN KEY (delivery_person_id) REFERENCES users(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log('✅ delivery_people table ready');

    // 4. addresses — depends on users(id)
    console.log('Creating addresses table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS addresses (
        address_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        line1 VARCHAR(200) NOT NULL,
        line2 VARCHAR(200) NULL,
        city VARCHAR(100) NULL,
        postal_code VARCHAR(20) NULL,
        notes VARCHAR(255) NULL,
        is_default TINYINT(1) NOT NULL DEFAULT 0,
        CONSTRAINT fk_addresses_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE,
        INDEX idx_addresses_user (user_id)
      ) ENGINE=InnoDB
    `);
    console.log('✅ addresses table ready');

    // 5. carts — depends on customers(customer_id)
    console.log('Creating carts table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS carts (
        cart_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        status ENUM('ACTIVE','CONVERTED','ABANDONED') NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_carts_customer
          FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
          ON DELETE CASCADE,
        INDEX idx_carts_customer (customer_id, status)
      ) ENGINE=InnoDB
    `);
    console.log('✅ carts table ready');

    // 6. cart_items — depends on carts and services
    console.log('Creating cart_items table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cart_items (
        cart_item_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        cart_id BIGINT UNSIGNED NOT NULL,
        service_id BIGINT UNSIGNED NOT NULL,
        quantity INT NOT NULL,
        CONSTRAINT fk_cart_items_cart
          FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_cart_items_service
          FOREIGN KEY (service_id) REFERENCES services(service_id),
        UNIQUE KEY uq_cart_service (cart_id, service_id)
      ) ENGINE=InnoDB
    `);
    console.log('✅ cart_items table ready');

    // 7. pickup_delivery — depends on orders(id), addresses, delivery_people
    console.log('Creating pickup_delivery table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pickup_delivery (
        pickup_delivery_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL UNIQUE,
        pickup_address_id BIGINT UNSIGNED NOT NULL,
        delivery_address_id BIGINT UNSIGNED NOT NULL,
        pickup_scheduled_at DATETIME NULL,
        pickup_actual_at DATETIME NULL,
        delivery_scheduled_at DATETIME NULL,
        delivery_actual_at DATETIME NULL,
        delivery_person_id INT NULL,
        pd_status ENUM('NOT_REQUIRED','SCHEDULED','IN_PROGRESS','DONE','FAILED') NOT NULL DEFAULT 'SCHEDULED',
        CONSTRAINT fk_pd_order
          FOREIGN KEY (order_id) REFERENCES orders(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_pd_pickup_addr
          FOREIGN KEY (pickup_address_id) REFERENCES addresses(address_id),
        CONSTRAINT fk_pd_delivery_addr
          FOREIGN KEY (delivery_address_id) REFERENCES addresses(address_id),
        CONSTRAINT fk_pd_delivery_person
          FOREIGN KEY (delivery_person_id) REFERENCES delivery_people(delivery_person_id),
        INDEX idx_pd_delivery_person (delivery_person_id, pd_status)
      ) ENGINE=InnoDB
    `);
    console.log('✅ pickup_delivery table ready');

    console.log('\n✅ All migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
