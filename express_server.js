const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));
// app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


app.set("view engine", "ejs");
// 
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//-----HELPER FUNCTIONS=====================================//

function generateRandomString() {
 return (Math.random() + 1).toString(36).substring(6);
};

const getUserEmail = (email) => {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

//===========================================================//

// GET Login
 
app.get('/login', (req,res) => {

  res.render('login');
})



//login in and redirects to main urls page -- After the a registration has happened.

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  
  if (!email || !password) {
    return res.status(403).send('Email or password cannot be blank');
  }
  
  const user = getUserEmail(email);

  if (!user) {
    return res.status(403).send('Account doesn\'t exists');
  }
  if (user.password !== password) {
    return res.status(403).send('Invalid Password!');
  }
  if (user.email === email && user.password === password) {
  res.cookie('user', user.id);
  res.redirect('/urls');
  }
  
});
//==============================================================================
//This is the logout button once you have logged in 
app.post('/logout', (req, res) => {
  res.clearCookie('user', req.body.id); 
  res.redirect('/register');
});
//===============================================================================
app.get ('/urls', (req,res) => {
  let templateVars = {
    // username: req.cookies['username'],
    urls: urlDatabase,
    user: users[req.cookies['user']],
    useremail: users[req.cookies['user']].email
  };
  console.log(req.cookies);
  console.log(templateVars);
  res.render("urls_index",templateVars); //urls_index is the filename inside the views file folder, don't need to put the extension.
})

app.get('/register', (req, res) => {
  
  res.render('urls_register');
});


app.post('/register', (req, res) => {
  const id = 'u' + Math.floor(Math.random() *1000) + 1;
  // const email = req.body.email;
  // const password = req.body.password;
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).send("Please enter an email or password");
  }

  const user = getUserEmail(email);
    if(user) {
      return res.status(400).send ("email already in use");
    }

  users[id] = { id, email, password };
  res.cookie('user', id)
  
  res.redirect('/urls');
});

//create new ShortURL
app.get('/urls/new',(req, res) => {
  let templateVars = {
    user: users[req.cookies['user']]
  };
  const username = req.cookies.username;
  res.render('urls_new', templateVars );
});

// Edit POST (creating shortURL)

app.post('/urls',(req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  
});

app.get('/urls/:shortURL',(req, res) => { // redirects to the LONGURL page
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: longURL,
    user: users[req.cookies['user']]
  };
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