const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  
}


// GET

app.get('/',(req, res) => { // if they pass the home page return hello
  res.send('Hello!');
});

app.get('/urls.json',(req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req,res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls',(req, res) => { // localhost:8080/urls will show the ejs
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);  //urls_index is the filename inside the views file folder, don't need to put the extension.
});

app.get('/urls/new',(req,res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL',(req, res) => {
  const longURL = urlDatabase [req.params.shortURL].longURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL };
  res.render('urls_show', templateVars);
});

//POST 

app.post('/urls',(req,res) => {
  console.log(req.body);
  res.send("ok");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});