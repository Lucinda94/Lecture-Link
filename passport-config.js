/****
 * Configuration of Passport.js as per the documentation.
 * @module passport-config
 */
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

/**
 * 
 * @param {callback} passport - Passport middleware
 * @param {string} getUserByEmail - The email address of the user trying to login.
 * @param {integer} getUserById - The id of the user trying to login.
 */
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize