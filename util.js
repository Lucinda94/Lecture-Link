module.exports.error = (res, code = 500, msg) => {
    res.status(code).send(msg);
}