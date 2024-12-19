function handlePublicFrontEndView(app) {
  
  app.get('/', function(req, res) {
      return res.render('welcom_page');
    });
    app.get('/homePage', function(req, res) {
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
 
  }  

module.exports = {handlePublicFrontEndView};