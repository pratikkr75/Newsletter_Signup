const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require("mongoose");


const app = express();

const url ="paste your mongodb database url";

mongoose.connect(url, {
    
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 30000,  // 30 seconds
});


// Define a schema for the user data
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String
});

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // Create a new user instance
    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email
    });

    // Save the user data to the MongoDB database
    newUser.save()
        .then(() => {
            res.sendFile(__dirname + "/success.html");
        })
        .catch((err) => {
            console.error(err);
            res.sendFile(__dirname + "/failure.html");
        });
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
