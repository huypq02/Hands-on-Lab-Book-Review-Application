require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        let token = req.session.authorization['token']
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(!err) {
                console.log(decoded)
                next()
            } else {
                console.log(err)
                res.status(403).json({message: "Unauthorized!"})
            }
        })
    } else {
        res.status(401).json({message: "Invalid Authorization"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running at port ${PORT}`));
