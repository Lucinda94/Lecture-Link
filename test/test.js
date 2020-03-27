//Test script
/* example code for sum function
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1,2)).toBe(3);
});
*/

// const appendMessageToChat = require('./main');

// test('Appends Msg to chat', () => {
//     expect()
// })

// test('Get Messages', () => {
//     expect(getMessages(a)).toBe(false);
// })

const expect = require('chai').expect
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
}

//
async function httpPost(request, obj){
  const res = await fetch(url + request, {
    method: "post",
    body: JSON.stringify(obj),
    headers: {
        'Content-Type': 'application/json'
    }
  });
  return await res.json();
}

// Testing the application
QUnit.test("User can register", async function(assert){
  testRes = await httpPost ("register", testUser.register);
  assert.equal(testRes.success, true, "User has been able to register successfully")
})





