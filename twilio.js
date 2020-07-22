const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const fetch = require("node-fetch");
const express = require("express");
const app = express();
const alert = require("alert-node");
const mustacheExpress = require("mustache-express");

//middleware
app.use(express.urlencoded());

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use("/css-1", express.static("css"));

console.log();
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/send-fact", (req, res) => {
  fetch("https://uselessfacts.jsph.pl/random.json?language=en")
    .then((r) => r.json())
    .then((response) => {
      let fact = response.text;
      let number = req.body.number;
      client.messages
        .create({
          to: `+1${number}`,
          from: "+12512500835",
          body: `This fact is brought to you by the Random Useless Facts API:
          ${fact}`,
        })
        .then((message) => console.log(message))
        .then(alert("Message was sent"));
      res.redirect("/");
    });
});

app.listen(4000, () => {
  console.log("Server is running...");
});
