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
   
    }  
  
module.exports = {handlePublicFrontEndView};