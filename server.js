const express = require('express');
const request = require('request');
const https = require('https');
const bodyparser = require('body-parser');
// const { application } = require('express');

// const client = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.get('/', (req, res) => {
     res.sendFile(__dirname+"/sigup.html")

});
app.post('/', (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    console.log(firstname + ' ' + lastname+' ' + email);
    var data ={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsondata = JSON.stringify(data);
    const url ="https://us9.api.mailchimp.com/3.0/lists/cf962cacf3";
    const options = {
        method:"POST",
        auth:"aback:ef0a62b96af423d0577e8121a9bdb89d-us9"
    }
    const request = https.request(url , options,
         function(response){
        if(response.statusCode === 200){
            // res.send("successfully subscribed")
            // res.sendFile("/success.html");
            res.sendFile(__dirname+"/success.html");
        }
        else{
            // res.send("please try again")
            res.sendFile(__dirname+"/faliure.html");
        }
        console.log(response.statusCode);
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsondata);
    request.end();

});
app.post('/faliure', function(req, res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000 ,function(){
    console.log('listening on port 3000');
})
