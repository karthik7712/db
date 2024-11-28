const express = require('express');
const db = require('../models/db');
const router = express.Router();

// Get details of a specific doctor or patient
router.get('/search', async (req, res) => {
    const { name, type } = req.query; // type: 'doctor' or 'patient'
    try {
        const table = type === 'doctor' ? 'doctors' : 'patients';
        const result = await db.query(`SELECT * FROM ${table} WHERE name ILIKE $1`, [`%${name}%`]);

        if (result.rows.length > 0) {
            let responseHtml = '';
            result.rows.forEach(item => {
                responseHtml += `
                    <div class="search-result">
                        <p><strong>${type === 'doctor' ? 'Doctor' : 'Patient'}:</strong> ${JSON.stringify(item)}</p>
                        <button class="update-btn" data-id="${item.id}" data-type="${type}">Update</button>
                        <button class="delete-btn" data-id="${item.id}" data-type="${type}">Delete</button>
                    </div>
                `;
            });
            res.status(200).send(responseHtml);  // Send HTML content
        } else {
            res.status(200).send('<p>No results found.</p>');
        }
    } catch (err) {
        res.status(500).send('<p>Error fetching details</p>');
    }
});


// CRUD for doctors
router.post('/doctors', async (req, res) => {
    const { name, specialization, phone_number, email, availability } = req.body;
    try {
        await db.query(
            `INSERT INTO doctors (name, specialization, phone_number, email, availability) 
            VALUES ($1, $2, $3, $4, $5)`,
            [name, specialization, phone_number, email, availability]
        );
        res.status(201).json({ message: 'Doctor added' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding doctor' });
    }
});

router.put('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    const { name, specialization, phone_number, email, availability } = req.body;
    try {
        await db.query(
            `UPDATE doctors 
            SET name = $1, specialization = $2, phone_number = $3, email = $4, availability = $5 
            WHERE id = $6`,
            [name, specialization, phone_number, email, availability, id]
        );
        res.status(200).json({ message: 'Doctor updated' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating doctor' });
    }
});

router.delete('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM doctors WHERE id = $1`, [id]);
        res.status(200).json({ message: 'Doctor deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting doctor' });
    }
});

// Similarly, implement CRUD for patients
router.post('/patients', async (req, res) => {
    const { name, age, address, phone_number, doctor_id } = req.body;
    try {
        await db.query(
            `INSERT INTO patients (name, age, address, phone_number, doctor_id) 
            VALUES ($1, $2, $3, $4, $5)`,
            [name, age, address, phone_number, doctor_id]
        );
        res.status(201).json({ message: 'Patient added' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding patient' });
    }
});

router.put('/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, address, phone_number, doctor_id } = req.body;
    try {
        await db.query(
            `UPDATE patients 
            SET name = $1, age = $2, address = $3, phone_number = $4, doctor_id = $5 
            WHERE id = $6`,
            [name, age, address, phone_number, doctor_id, id]
        );
        res.status(200).json({ message: 'Patient updated' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating patient' });
    }
});

router.delete('/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM patients WHERE id = $1`, [id]);
        res.status(200).json({ message: 'Patient deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting patient' });
    }
});

module.exports = router;
