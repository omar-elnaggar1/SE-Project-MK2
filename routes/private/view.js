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

}  
  
module.exports = {handlePrivateFrontEndView};
