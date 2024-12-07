const { v4 } = require('uuid');
const db = require('../../connectors/db');

function handlePublicBackendApi(app) {

    // Register HTTP endpoint to create new user
    app.post('/api/v1/users', async function(req, res) {
      // Check if user already exists in the system
      const userExists = await db.select('*').from('users').where('email', req.body.email);
      console.log("UE",userExists)
      if (userExists.length > 0) {
        return res.status(400).send('user exists');
      }
      
      try {
        const newUser = req.body;
        const user = await db('users').insert(newUser).returning('*');
        console.log("user new",user);
        return res.status(200).json(user);
      } catch (e) {
        console.log(e.message);
        return res.status(400).send('Could not register user');
      }
    });

    // Register HTTP endpoint to create new user
    app.post('/api/v1/users/login', async function(req, res) {
      // get users credentials from the JSON body
      const { email, password } = req.body
      if (!email) {
        // If the email is not present, return an HTTP unauthorized code
        return res.status(400).send('email is required');
      }
      if (!password) {
        // If the password is not present, return an HTTP unauthorized code
        return res.status(400).send('Password is required');
      }

      // validate the provided password against the password in the database
      // if invalid, send an unauthorized code
      let user = await db.select('*').from('users').where('email', email);
      console.log("user : : ",user)
      if (user.length == 0) {
        return res.status(400).send('user does not exist');
      }
      user = user[0];
      if (user.password !== password) {
        return res.status(400).send('Password does not match');
      }

      // set the expiry time as 30 minutes after the current time
      const token = v4();
      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 18000000); // expire in 3 minutes

      // create a session containing information about the user and expiry time
      // Ensure this outputs a valid user ID
      const session = {
        userId: user.user_id,
        token,
        expiresAt,
      };
      try {
        await db('session').insert(session);

        // In the response, set a cookie on the client with the name "session_cookie"
        // and the value as the UUID we generated. We also set the expiration time.
        return res.cookie("session_token", token, { expires: expiresAt }).status(200).send('login successful');
      } catch (e) {
        console.log(e.message);
        return res.status(400).send('Could not register user');
      }
    });
    app.get('/api/v1/equipments/view' , async function(req , res) {
      try{
        const result = await db.raw(`select * from "equipments"`);
        //console.log(`result here`,result.rows);
        return res.status(200).send(result.rows);
      }catch(err){
        console.log("error message",err.message);
        return res.status(400).send(err.message);
      }
    });
  
    app.get('/api/v1/equipment', async (req, res) => {
      const { name, category, status, rating } = req.query;
    
      try {
        let query = `
          SELECT e.equipment_id, e.equipment_name, e.status, c.category_name, e.rating
          FROM equipments e
          JOIN categories c ON e.category_id = c.category_id
          WHERE 1=1
        `;
        const params = [];
    
        // Add filters dynamically
        if (name) {
          query += ' AND LOWER(e.equipment_name) LIKE ?';
          params.push(`%${name.toLowerCase()}%`);
        }
    
        if (category) {
          query += ' AND LOWER(c.category_name) = ?';
          params.push(category.toLowerCase());
        }
    
        if (status) {
          query += ' AND e.status = ?';
          params.push(status);
        }

        if (rating) {
          query += ' AND e.rating = ?';
          params.push(rating);
        }
    
        const result = await db.raw(query, params);
        const rows = result.rows || result[0] || result; // Adjust based on your DB
    
        res.status(200).json(rows);
      } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Server error' });
      }
    });
    
    app.get('/api/v1/categories', async (req, res) => {
      try {
        const result = await db.raw('SELECT * FROM categories');
        const rows = result.rows || result[0] || result; // Adjust based on your DB
    
        res.status(200).json(rows);
      } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Server error' });
      }
    });
    

  }




module.exports = {handlePublicBackendApi};
