const passport = require('passport')

const checkUser = () =>{
    passport.authenticate('jwt',{
        session: false
    }), (req, res) =>{
        console.log(req.user)
    }
}


module.exports = {
    checkUser
}