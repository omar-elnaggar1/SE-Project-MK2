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
      app.delete('/api/v1/users/:id', async (req, res) => {
        const userId = req.params.id; // Get the userId from the URL params
    
        try {
          const result = await db.raw('DELETE FROM users WHERE user_id = ?', [userId]);
    
          // Check if the user was deleted
          if (result.rowCount === 0 || (result.affectedRows && result.affectedRows === 0)) {
            return res.status(404).json({ error: 'User not found' });
          }
    
          // Send a success message
          res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
        }
      });
    
      
    // Get Categories
    app.get('/api/v1/categories', async (req, res) => {
      try {
          const categories = await db.raw('SELECT * FROM Categories');
          res.json(categories.rows);
      } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });

  // Get Suppliers
  app.get('/api/v1/suppliers', async (req, res) => {
      try {
          const suppliers = await db.raw('SELECT * FROM Suppliers');
          res.json(suppliers.rows);
      } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });
// Add Equipment
app.post('/api/v1/equipment', async (req, res) => {
const { name, image, model_number, purchase_date, quantity, status, location, category_id, supplier_id } = req.body;

console.log('Received equipment data:', {
    name, 
    image, 
    model_number, 
    purchase_date, 
    quantity, 
    status, 
    location, 
    category_id, 
    supplier_id
});

try {
    // Ensure all required fields are provided
    if (!name || !model_number || !purchase_date || quantity === undefined) {
        return res.status(400).json({ error: 'Name, model number, purchase date, and quantity are required' });
    }

    // Validate quantity is a number
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity)) {
        return res.status(400).json({ error: 'Quantity must be a valid number' });
    }

    // Insert the equipment into the database
    const result = await db.raw(
        `INSERT INTO equipments (
            equipment_name, 
            equipment_img, 
            model_number, 
            purchase_date, 
            quantity, 
            status, 
            location, 
            category_id, 
            supplier_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
        RETURNING equipment_id`,
        [
            name, 
            image || null, 
            model_number, 
            purchase_date, 
            parsedQuantity, 
            status , 
            location || null, 
            category_id || null, 
            supplier_id || null
        ]
    );

    // Check if the equipment was inserted
    if (result.rows.length === 0) {
        return res.status(500).json({ error: 'Failed to insert equipment' });
    }

    res.status(201).json({ 
        message: 'Equipment added successfully',
        equipment_id: result.rows[0].equipment_id 
    });
} catch (err) {
    console.error('Full error details:', err);
    res.status(500).json({ 
        error: 'Server error', 
        details: err.message 
    });
}
});
  // Edit Equipment
  app.put('/api/v1/equipment/:id', async (req, res) => {
      const equipmentId = req.params.id;
      const { name, image, model_number, purchase_date, quantity, status, location, category_id, supplier_id } = req.body;

      try {
          // Ensure all required fields are provided
          if (!name || !model_number || !purchase_date || quantity === undefined) {
              return res.status(400).json({ error: 'Name, model number, purchase date, and quantity are required' });
          }

          // Update the equipment in the database
          const result = await db.raw(
              `UPDATE equipments
               SET equipment_name = ?, 
                   equipment_img = ?, 
                   model_number = ?, 
                   purchase_date = ?, 
                   quantity = ?,
                   status = ?,
                   location = ?,
                   category_id = ?,
                   supplier_id = ?
               WHERE equipment_id = ?
               RETURNING *`,
              [
                  name, 
                  image || null, 
                  model_number, 
                  purchase_date, 
                  quantity, 
                  status , 
                  location || null, 
                  category_id || null, 
                  supplier_id || null, 
                  equipmentId
              ]
          );

          // Check if the equipment was updated
          if (result.rows.length === 0) {
              return res.status(404).json({ error: 'Equipment not found or no changes made' });
          }

          res.status(200).json({ 
              message: 'Equipment updated successfully',
              equipment: result.rows[0]
          });
      } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });

  // Delete Equipment
  app.delete('/api/v1/equipment/:id', async (req, res) => {
      const equipmentId = req.params.id;

      try {
          // Delete the equipment from the database
          const result = await db.raw(
              'DELETE FROM equipments WHERE equipment_id = ?', 
              [equipmentId]
          );

          // Check if the equipment was deleted
          if (result.rowCount === 0) {
              return res.status(404).json({ error: 'Equipment not found' });
          }

          res.status(200).json({ message: 'Equipment deleted successfully' });
      } catch (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });
      
};

//my edit

module.exports = {handlePrivateBackendApi};
