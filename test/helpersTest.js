const { assert } = require('chai');

const { getUserEmail } = require('../helpers.js');

const testUsers = {
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

describe('getUserEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, testUsers.userRandomID);
  });

  it('should return undefined if no  email exists', function() {
    const user = getUserEmail("gaby@google.com", testUsers)
    const expectedOutput = "undefined";
    assert.equal(user, undefined);
  });
});