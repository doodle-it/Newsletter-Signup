const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const client = require("mailchimp-marketing");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/signup.html');
})


app.post("/", function(req, res){
    const firstName = req.body.FName;
    const lastName = req.body.LName;
    const email = req.body.Email;
    const data = {
       members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
              }
        }
       ]     // members only has one object since we subscribe one person at a time
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us9.api.mailchimp.com/3.0/lists/3ca9b4174a';

    const options = {
        method: "POST",
        auth: "sai18:abf4ccd9c9fa8c3f1202b9e330f2e78b-us9"
    };
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200)
            res.send("Seccessfully subscribed");
        else
            res.send("There was an error!");

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);// to send the request back to mailchimp
    request.end();
});

app.listen(3000, function(){
    console.log("server is running on port 3000");
});