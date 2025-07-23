const mysql = require('mysql2/promise');
const JWT_SECRET = 'your_secret_key'; // use env var in production

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'klinklin123',
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS klinklin`);
  await connection.end();
}

let pool;
async function initPoolAndTables() {
  await createDatabaseIfNotExists();

  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'klinklin123',
    database: 'klinklin',
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      dob DATE,
      email VARCHAR(255),
      instagram VARCHAR(255),
      twitter VARCHAR(255),
      facebook VARCHAR(255),
      role ENUM('admin', 'customer', 'laundry_owner') NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS laundry_places (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      rating FLOAT,
      owner_id INT,
      location VARCHAR(255),
      latitude FLOAT,
      longitude FLOAT,
      price_cuci_reguler FLOAT,
      price_dry_cleaning FLOAT,
      price_setrika FLOAT,
      price_jas FLOAT,
      price_selimut FLOAT,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  const [users] = await pool.query(`SELECT * FROM users WHERE username = ?`, ['admin']);
  if (users.length === 0) {
    await pool.query(`
      INSERT INTO users (
        username, password, first_name, last_name, phone, address, dob, email,
        instagram, twitter, facebook, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'admin', 'password123', 'Niko', ' ', '(+62) 81387263269', 'Kebon Jeruk, West Jakarta',
      '1999-10-06', 'niko@gmail.com', '@im_niko', '@im_niko', '@im_niko', 'admin'
    ]);
  }
}

initPoolAndTables().catch(console.error());

module.exports = { pool, JWT_SECRET };