const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const passport = require('passport')
const User = require('../../models/User')
const key = require('../../config/keys').secret
//const auth = require('../../config/passport')()
const passport = require('passport')


/**
 @route POST api/users/register
**/
router.post('/register', (req, res)=> {
    let { name, username, email, password, confirm_password } = req.body

    if( password !== confirm_password ){
        return res.status(400).json({
            msg: "Password Do Not Match"
        })
    }
    //check for unique username
    User.findOne({ username })
    .then((user)=> {
        if(user){
            return res.status(400).json({
                msg: "Username already taken"
            })
        }
    })

    //check for unique email
    User.findOne({ email })
    .then((user)=> {
        if(user){
            return res.status(400).json({
                msg: "Email already registered"
            })
        }
    })

    //register for the data
    //data is valid
    let newUser = new User({
        name,
        username,
        email,
        password
    })

    //hash the password
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "new user registered",
                    person:  user
                })
            })
        })
    })
})

/**
*@route POST api/users/login 
*/
router.post('/login', (req, res)=> {
    const { username, password } = req.body
    User.findOne({ username }).then(user => {
        if(!user){
            return res.status(404).json({
                msg: "username not found.",
                success: false
            })
        }

        //if there is user, we compare the password
        bcrypt.compare(password, user.password).then( isMatch => {
            if( isMatch ){
                //user password is true
                const payload = {
                    _id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                }

                jwt.sign( payload, key, { 
                    expiresIn: 604800 
                }, ( err, token ) => {
                    // console.log(token)
                    res.status(200).json({
                        success: true,
                        user: user,
                        token: `Bearer ${token}`,
                        msg: "Hurray You Are Now Logged In"
                    })
                })
            } else {
                return res.status(404).json({
                    msg: "Incorrect Password",
                    success: false
                })
            }
        })
    })
})


/*
router.get('/profile', passport.authenticate('jwt',{
    session: false
}), (req, res) =>{
    console.log(req.user)
    return res.json({ user: req.user })
})
*/

router.get('/profile', passport.authenticate('jwt',{ session: false }), (req, res) =>{
    
    return res.json({ user: req.user })
})




module.exports = router