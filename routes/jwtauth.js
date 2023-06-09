const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../db/middleware/validInfo');
const authorization = require('../db/middleware/authorization');
// Registration

router.post('/register', validInfo, async (req, res) => {

    try {
         // Take apart req.body (name, email, pass)
            const { name, email, password } = req.body;
           
        // Check if email already exists (if so, throw error)
            const user = await db.query("SELECT * FROM students WHERE email = $1", [
                email
            ]);

            if (user.rows.length > 0) {
                return res.json("An account is already linked to that email!");
              } 
              

              
        // Bcrypt password
              
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            
            const bcryptPassword = await bcrypt.hash(password, salt);

        // Insert details in db
            const newUser = await db.query("INSERT INTO STUDENTS(name, email, password) VALUES($1, $2, $3) RETURNING *", [
                name, email, bcryptPassword
            ]);
            
        
        // Generate JWT 
            const token = jwtGenerator(newUser.rows[0].user_id);
            res.json({ name, token });
        
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', validInfo, async (req, res) => {
    try {
        
        // req.body
        const { email, password } = req.body;
        
    console.log(email, 'Login 1 email')
        // error if no such user
        const user = await db.query("SELECT * FROM students WHERE email = $1", [
            email
        ]);

        if(user.rows.length === 0) {
            return res.status(401).json("Password or Username is incorrect, please reenter.");
        }

        // password = db password?

        const passwordValid = await bcrypt.compare(password, user.rows[0].user_password);
        
        if(!passwordValid) {
            return res.status(401).json("Password or Email is Incorrect.");
        }
        if(user.rows[0].emailverify != 'verified') {
            return res.status(401).json("Email not verified.");
        }


        // provide token

        const token = jwtGenerator(user.rows[0].user_id);
        const name = user.rows[0].user_name;
        res.json({ name, token});

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

    router.post("/verified", authorization, (req, res) => {
        try {
            res.status(200).json(true); 

        } catch (err) {
            res.status(500).send('Server Error');     
        }
    });

module.exports = router;