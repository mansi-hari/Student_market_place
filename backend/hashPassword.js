const bcrypt = require("bcryptjs");

const password = "m@nsi@dmin#123";
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
console.log(hashedPassword);