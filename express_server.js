const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));

const bcrypt = require('bcrypt');



app.set("view engine", "ejs");
//
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$g31dC72oWJW/pVr4i37b3eBh1OrAIhUexlGemwsOXyLuItsQavgYW" // 'purple-monkey-dinosaur'
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$kEcm00J.pVKwQnI.oK0ESeGuOhAZVECzIhrtQ5BCdSKCKbWlOG8aa" // 'dishwasher-funk'
  }
};


//-----HELPER FUNCTIONS=====================================//
const { getUserEmail } = require('./helpers');

//creates a random string
const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(6);
};


const saltRounds = 10;

//returns URLS where UserID equal to the id of current logged-in user
const urlsForUser = (id) => {
  let userURLS = {};

  for (const shortURL in urlDatabase) {
    
    if (urlDatabase[shortURL].userID === id) {
      userURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLS;
};

// GET====REGISTER ====================================//

app.get('/register', (req, res) => {
  
  if (req.session.user_id) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('urls_register', templateVars);
});

//POST=====REGISTER==================//

app.post('/register', (req, res) => {
  //1. I am checking whether the email or password is empty
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Please enter an email or password");
  }
  //2. To verify whether the Email is already taken or not
  const user = getUserEmail(req.body.email,users);
  console.log("this is the user",user);
  //If the email is already taken
  if (user) {
    return res.status(400).send("email already in use");
  } else { //Email has not been taken. So we can register the new user.
    const id = 'u' + Math.floor(Math.random() * 1000) + 1;
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    users[id] = { id, email: email, password: hashedPassword};
    req.session['user_id'] = id
    res.redirect('/urls');
  }
  
});
// GET Login
 
app.get('/login', (req,res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render('login',templateVars);
});

//login in and redirects to main urls page -- After the registration has happened.

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  
  if (!email || !password) {
    return res.status(403).send('Email or password cannot be blank');
  }
  
  const user = getUserEmail(email,users);
  
  if (!user) {
    return res.status(403).send('Account doesn\'t exists');
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send('Invalid Password!');
  }
  if (user.email === email && bcrypt.compareSync(password, user.password)) {
    req.session['user_id'] = user.id;
    res.redirect('/urls');
  }
});

//==============================================================================
//This is the logout button once you have logged in
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/register');
});
//INDEX PAGE==CLIENT=============================================================================

//GET
app.get('/urls', (req,res) => {
  const userID = req.session['user_id'];
  const templateVars = {
    urls: urlsForUser(userID, urlDatabase),
    user: users[userID]
  };
  if (!userID) {
    res.status(401).send('Please login');
    
  }
  console.log(userID);
  console.log(templateVars);
  res.render("urls_index",templateVars); //urls_index is the filename inside the views file folder, don't need to put the extension.
});

//create new ShortURL======URLS_SHOW PAGE============
app.get('/urls/new',(req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  
  if (!req.session['user_id']) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars );
  }
  
});

// Edit POST (creating shortURL)

app.post('/urls',(req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.session['user_id'];

  urlDatabase[shortURL] = { longURL, userID };

  res.redirect(`/urls/${shortURL}`);
  
  console.log(shortURL);
  
});

//======GET===== // SHOWS the new LONGURL==========
app.get('/urls/:shortURL',(req, res) => {
  const shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const templateVars = {
    user,
    shortURL,
    longURL
  };
  if (!urlDatabase[shortURL]) {
    res.status(404).send('this shortURL does not exist');
  } else if (!user || !urlDatabase[shortURL]) {
    
    res.status(401).send('Please login');
  } else {
    res.render('urls_show', templateVars);
  }
});

// shows user the short URL new link
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (!urlDatabase[req.params.shortURL]) {  //if shortURL does not exist send status.
    return res.send("URL does not exist!");
  }
  res.redirect(longURL);
});

//Edit POST /ulrs/:shortURL   === updates the longURL
app.post('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session['user_id'];
  
  if (userID === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.longURL;  //req.body is the object longURL:
    res.redirect(`/urls/${req.params.shortURL}`);
  } else {
    res.status(401).send('You must login');
  }
});

//Delete POST /urls/shortURL/Delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});