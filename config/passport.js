
const jwtStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const User = require('../models/User')
const key = require('./keys').secret



const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;



module.exports = passport => {
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload._id).then(user => {
                if (user) return done(null, user);
                return done(null, false);
            }).catch(err => console.log(err));
        })
    );
};