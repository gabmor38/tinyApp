const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
 return (Math.random() + 1).toString(36).substring(6);
};

// GET


//login in and redirects to main urls page

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username); 
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username', req.body.username); 
  res.redirect('/urls');
});

app.get ('/urls', (req,res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index",templateVars); //urls_index is the filename inside the views file folder, don't need to put the extension.
})

app.get('/register', (req, res) => {
  
  res.render('urls_register');
});

//create new ShortURL
app.get('/urls/new',(req, res) => {
  const username = req.cookies.username;
  res.render('urls_new',{ username });
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

//Edit POST /ulrs/:shortURL  
app.post('/urls/:shortURL', (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;  //req.body is the object longURL:
  res.redirect(`/urls/${req.params.shortURL}`);
});

//Delete POST /urls/shortURL/Delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});