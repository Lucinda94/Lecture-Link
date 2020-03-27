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

QUnit.test("Making sure testing works, 2 * 4 should be 8", function(assert){
  assert.equal(2*4, 8, "2 * 4 = 8")
})



