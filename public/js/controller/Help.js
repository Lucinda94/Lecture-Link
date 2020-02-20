import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Help = {
    hashPW (pw) {
        salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(pw, salt);
    },


    passwordCompare (hashedPW, pw) {
        return bcrypt.compare(pw, hashedPW)
    },


    validateEmail (email) {
        return /\S+@\S+\.\S+/.test(email);
    },

    generateWebToken(userID) {
        const webToken = jwt.sign(
        {userId: userID},
        process.env.SECRET,
        {expiresIn: "14d"}
        );

        return webToken;
    }





}