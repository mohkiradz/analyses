const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// Set CORS headers to allow requests from any origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed request headers
  next();
});

// Create a PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'LaboPharm',
  password: 'zdnetf',
  port: 5432, // Default PostgreSQL port
});

// Define endpoint to handle form submissions
app.post('/submit-form', async (req, res) => {
  try {
    // Extract form data from request body
    const { name, lastName, dob, num, pre, selectedOptionsData } = req.body;

    // Insert form data into the database
    const client = await pool.connect();
    
    // Insert data into the patient table
    const patientQuery = 'INSERT INTO patient (nom, prenom, date_naissance) VALUES ($1, $2, $3) RETURNING id';
    const patientResult = await client.query(patientQuery, [name, lastName, dob]);
    const patientId = patientResult.rows[0].id;   

    // Insert data into the form_data table
    const formDataQuery = 'INSERT INTO form_data (name, last_name, dob, num, prelevement, patient_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const formDataResult = await client.query(formDataQuery, [name, lastName, dob, num, pre, patientId]);
    const formDataId = formDataResult.rows[0].id;   

    // Insert selected options into the database
    for (const option of selectedOptionsData) {
      const selectedOptionsQuery = 'INSERT INTO selected_options (form_data_id, option_value) VALUES ($1, $2)';
      await client.query(selectedOptionsQuery, [formDataId, option]);
    }
    
    client.release();

    res.status(200).json({ message: 'Form data submitted successfully' });
  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


// Define endpoint to fetch options from the analysemedicale table
app.get('/options', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT designation, abreviation, prix_labo FROM analysemedicale');
    const options = result.rows.map(row => `${row.designation}_(${row.abreviation})_(${row.prix_labo})`);
    client.release();
    res.json(options);
  } catch (err) {
    console.error('Error fetching options from analysemedicale table:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is good on http://localhost:${port}`);
  app.use(express.static(__dirname));
});
