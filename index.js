require('dotenv').config();

const express = require("express");
const app = express();
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing");
app.use(express.urlencoded());

// to be able to use files I made in this pc rather than in framework.
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

// setting up mailchimp
mailchimp.setConfig({
    apiKey: process.env.API_KEY,   // process.env.<element_name> (to use from .env)
    server: process.env.SERVER      // process.env.<element_name> (to use from .env)
});

// As sign in button is pressed, execute this.
app.post("/", (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    const listId = process.env.LIST_ID;


    // Creating an object with users data above ine 19.
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };



    // uploading the data to server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        // Logging the contacts ID.
        res.sendFile(__dirname + "/success.html")
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`)
          
    }

    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => res.sendFile(__dirname + "/failure.html"));


})
// This will show try again button on failure.
app.post("/failure", (req, res)=>{
    res.redirect("/");
})


app.listen(3000, () => {
    console.log("Server is running smooth on 3000 port.")
})


