const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');


function handlePrivateFrontEndView(app) {

    app.get('/admin' , async (req , res) => {
        
        const user = await getUser(req);
        console.log('user info' , user)
        if(user.role == "admin" ){
            return res.render('admin');
        }
        // role of customer
        return res.render('homePage' , {name : user.name});
    });
    // server.js
app.get('/users', async (req, res) => {
    console.log("GET /users route hit!");

    try {
        // Fetch all users from the database
        const users = await db.raw('SELECT * FROM users');
        res.render('users', { users: users.rows });  // Render the 'users.hjs' template with users data
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).send("Server error");
    }
});

app.get('/equipment', async (req, res) => {
    console.log("GET /equipment route hit!");
    try {
        // Fetch equipment with category and supplier information
        const equipmentQuery = `
            SELECT 
                e.*,
                c.category_name,
                s.supplier_name
            FROM 
                equipments e
            LEFT JOIN 
                Categories c ON e.category_id = c.category_id
            LEFT JOIN 
                Suppliers s ON e.supplier_id = s.supplier_id
        `;
        const equipment = await db.raw(equipmentQuery); 

        // Convert image to base64 if it exists
        const processedEquipment = equipment.rows.map(item => {
            // If equipment_img is a Buffer, convert to base64
            if (item.equipment_img && item.equipment_img.type === 'Buffer') {
                item.equipment_img = `data:image/jpeg;base64,${item.equipment_img.toString('base64')}`;
            }
            return item;
        });

        // Render the 'equipment.hjs' template with the equipment data
        res.render('equipment', { 
            equipment: processedEquipment
        });
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).send("Server error");
    }
});

}  
  
module.exports = {handlePrivateFrontEndView};
