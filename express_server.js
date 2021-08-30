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
 return (Math.random() + 1).toString(36).substring(6);
};


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

//Main 
app.get('/urls',(req, res) => { // localhost:8080/urls will show the ejs
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);  //urls_index is the filename inside the views file folder, don't need to put the extension.
});

//create new ShortURL
app.get('/urls/new',(req, res) => {
  res.render('urls_new');
});

// Edit POST (creating shortURL)

app.post('/urls',(req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  console.log(urlDatabase);
});

app.get('/urls/:shortURL',(req, res) => { // redirects to the LONGURL page
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {  // shows user the short URL new link
  const longURL = urlDatabase[req.params.shortURL];
  if (!urlDatabase[req.params.shortURL]) {  //if shortURL does not exist send status.
    return res.send("URL does not exist!");
  }
  res.redirect(longURL);
});

//Delete POST /urls/shortURL/Delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});