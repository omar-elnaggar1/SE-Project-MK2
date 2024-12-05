const db = require('../../connectors/db');

function handlePrivateBackendApi(app) {
 /*   app.put('/api/v1/users/:id', async (req, res) => {
        const { id } = req.params; // Extract user ID from the route parameter
        const { username, role } = req.body; // Extract fields to update from the request body
      
        try {
          // Validate input
          if (!username && !role) {
            return res.status(400).json({ error: 'At least one field (username or role) must be provided for update' });
          }
      
          // Build the dynamic query for updating fields
          let query = 'UPDATE users SET ';
          const fields = [];
          const values = [];
          let index = 1;
      
          if (username) {
            fields.push(`username = $${index}`);
            values.push(username);
            index++;
          }
      
          if (role) {
            fields.push(`role = $${index}`);
            values.push(role);
            index++;
          }
      
          query += fields.join(', ') + ` WHERE user_id = $${index} RETURNING *`;
          values.push(id);
      
          // Execute the query
          const updatedUser = await pool.query(query, values);
      
          if (updatedUser.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser.rows[0],
          });
        } catch (err) {
          console.error(err.message);
      
          // Handle unique constraint violation
          if (err.code === '23505') {
            return res.status(409).json({ error: 'Username already exists' });
          }
      
          res.status(500).json({ error: 'Server error' });
        }
      });*/

      app.get('/api/v1/users/:id', async (req, res) => {
        const userId = req.params.id;
      
        try {
          const result = await db.raw('SELECT * FROM users WHERE user_id = ?', [userId]);
      
          // Check the result structure based on your database
          const rows = result.rows || result[0] || result; // Handle PostgreSQL, MySQL, SQLite
      
          if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json(rows); // Send the rows as JSON
        } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
        }
      });
      app.put('/api/v1/users/:id', async (req, res) => {
        const userId = req.params.id; // Extract the user ID from the URL
        const { name, email, password, role } = req.body; // Extract user data from the request body
      
        try {
          // Ensure all required fields are provided
          if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
          }
      
          // Use db.raw to update the user record
          const result = await db.raw(
            `UPDATE users 
             SET username = ?, email = ?, password = ?, role = ?
             WHERE user_id = ?`,
            [name, email, password, role, userId]
          );
      
          // Check if the user was updated
          if (result.rowCount === 0 || (result.affectedRows && result.affectedRows === 0)) {
            return res.status(404).json({ error: 'User not found or no changes made' });
          }
      
          res.status(200).json({ message: 'User updated successfully' });
        } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
        }
      });
      
};

//my edit

module.exports = {handlePrivateBackendApi};
