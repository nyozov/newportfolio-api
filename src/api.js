const express = require('express');
const serverless = require('serverless-http');
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    'api': 'version 1'
  })
})

router.post("/email", (req, res) => {

  let { name, message } = req.body;
  const msg = {
    to: "n_yozov@hotmail.com", // Change to your recipient
    from: "etunetest@outlook.com", // Change to your verified sender
    subject: `Portfolio Message From ${name}`,

    html: `<h2>From ${name}</h2>
  
   <p>${message}<p>

  `,
  };
  
    sgMail
      .send(msg)
      .then((result) => {
        res.json({success:true})
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  
});


app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app)