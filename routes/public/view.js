const db = require('../../connectors/db');
function handlePublicFrontEndView(app) {
  
    app.get('/', function(req, res) {
        return res.render('homePage');
      });
    
      app.get('/register', function(req, res) {
        return res.render('register');
      });
      
      app.get('/login', function(req, res) {
        return res.render('login');
      });
      app.get('/image_uplaod', function(req, res) {
        return res.render('image_uplaod');
      });
      app.get('/equipments/:id', async (req, res) => {
        try {
            const equipmentId = req.params.id;
            const equipment = await db('equipments').where('equipment_id', equipmentId).first();
    
            if (!equipment) {
                return res.status(404).send('Equipment not found');
            }
    
            res.render('equipmentDetails', { equipment });
        } catch (error) {
            console.error('Server error:', error.message);
            res.status(500).send('Server error');
        }
    });
   
    }  
  
module.exports = {handlePublicFrontEndView};