const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const passport = require('passport')
//const auth = require('./config/passport')()


//initialize the app
const app = express()

//set middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors());

//use the passport middleware
app.use(passport.initialize())

//bring in the strategy
require('./config/passport')(passport)

//set static directory
app.use(express.static(path.join(__dirname, 'public')));

//connect to db
const db = require('./config/keys').mongoURL
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log(`Database connected successfully ${db}`)
}).catch(err =>{
    console.log(`unable to connect to the database ${err}`)
});

//routes
app.get('/', (req, res)=>{
    res.send("Hello World")
})

//bring in the routes
const users = require('./routes/api/users')
app.use('/api/users', users)


app.get('*', ( req,res )=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
//listen for server
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
})