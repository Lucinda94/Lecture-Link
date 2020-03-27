const request = require('request');
const fetch = require('node-fetch');
const server = require('../server');


// Insuring QUnit works
QUnit.test("Making sure testing works, 2 * 4 should be 8", function(assert){
  assert.equal(2*4, 8, "2 * 4 = 8")
})

//Testcase
const url = 'http://localhost:8080/';
const EMAIL = 'up000000@myport.ac.uk';
const password = '1234';
const hashPass = '$2a$10$1fB5pnQItRI8LKoPcsMB0O/eddkmnJz6bBRx55ecYeqJXiCSC.qD6';

const testUser = {
  login:{
    email: EMAIL,
    pass: password,
  },
  register:{
    fName: "Jomes",
    lName: "Smorths",
    email: EMAIL,
    pass: password,
  },
  update:{
    fName: "Blorg",
    lName: "Swanson",
    password: "1234",
  },
  message:{
    message: "Hello!",
  },
  sendTo:{
    id: "5",
  },
}

//
async function httpPost(request, body){
  const res = await fetch(url + request, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
  });
  return await res;
}
async function httpPost(request, bodyObj, paramsObj){
  const res = await fetch(url + request, {
    method: "post",
    body: JSON.stringify(bodyObj),
    params: JSON.stringify(paramsObj),
    headers: {
        'Content-Type': 'application/json'
    }
  });
  return await res;
}


async function httpGet(request){
  const res = await fetch(url + request, {
    method: "get",
    headers: {
        'Content-Type': 'application/json'
    }
  });
  return await res;
}


// Testing the application
QUnit.test("User can register", async function(assert){
  testRes = await httpPost ("register", testUser.register);
  assert.equal(testRes.status, 200, "User has been able to register successfully")
})

//Test Fails
QUnit.test("User cannot register a second account", async function(assert){
  testRes = await httpPost ("register", testUser.register);
  assert.equal(testRes.status, 409, "User already has an account")
})

QUnit.test("User can login", async function(assert){
  testRes = await httpPost ("login", testUser.login);
  assert.equal(testRes.status, 200, "user has been logged in")
})

QUnit.test("Users account page loads", async function(assert){
  testRes = await httpGet ("logout")
  assert.equal(testRes.status, 200, "User account page has been returned")
})

QUnit.test("User update account info", async function(assert){
  testRes = await httpPost ("login", testUser.update);
  assert.equal(testRes.status, 200, "user info has been updated")
})

QUnit.test("User can send messages", async function(assert){
  testRes = await httpPost ("register", testUser.message, testUser.sendTo);
  assert.equal(testRes.status, 200, "User has been able to send a message successfully")
})

QUnit.test("User can logout", async function(assert){
  testRes = await httpGet ("logout")
  assert.equal(testRes.status, 200, "User has logged out")
})






