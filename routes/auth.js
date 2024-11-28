const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Database connection

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const result = await db.query(userQuery, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({token});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    console.log('Request headers:', req.headers); 
    console.log('Request body:', req.body);
    const { username, password, email } = req.body;

    try {
        console.log(req.body);
        if (!password || !username || !email) {
            console.log("hi");
            return res.status(400).json({ error: 'All fields are required' });
        }

        const checkUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
        const checkUserResult = await db.query(checkUserQuery, [username, email]);

        if (checkUserResult.rows.length > 0) {
            console.log("username exists");
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const saltRounds = 10;
        
        if (typeof password !== 'string') {
            return res.status(400).json({ error: 'Password must be a string' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const insertQuery = `
            INSERT INTO users (username, password_hash, email)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
        `;
        const result = await db.query(insertQuery, [username, hashedPassword, email]);

        const newUser = result.rows[0];
        // console.log("New User created");
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
