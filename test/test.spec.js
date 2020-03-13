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
const server = require('../server');

describe('test', () => {
  it('should return a string', () => {
    expect('hopefully this works').to.equal('hopefully this works');
  });
});
