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
}  
  
module.exports = {handlePrivateFrontEndView};
