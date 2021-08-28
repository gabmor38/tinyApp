const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});