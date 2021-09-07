# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["My Urls Page"](https://github.com/gabmor38/tinyApp/blob/master/docs/Urls%20page.png?raw=true)
!["Register Page"] (https://github.com/gabmor38/tinyApp/blob/master/docs/Register.png?raw=true)
!["Create New Link"](https://github.com/gabmor38/tinyApp/blob/master/docs/Create%20New%20Url.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How to use TinyApp

In order to create, edit or view shortUrls a user must first register or logged in.

### Creating a new link

- Select the "Create New URL" in the navigation bar and in the "Enter a URL" field add in the url you want to shorten.

To view newly created or existing Urls select "My urls" in the navigation bar.

### Edit or Delete Urls

- Select "My urls" to edit or delete shorten URLS. 

Select the Edit button to update the link for the shortUrl. It will only modify the long link and not the shortone.

If you want to remove a link completely off the list simply select "Delete".

