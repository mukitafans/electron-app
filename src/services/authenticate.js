//const moment = require('moment');

const jwt = require('jsonwebtoken');

module.exports = {

    login(req, res) {

        //Implement in future
        /*if(
          !(req.body.username && req.body.password) ||
          !validator.isAlphanumeric(req.body.username)
        ) return res.status(400).send({ status: 701 });*/

        //No users in BD, replace in future
        if (req.body.username === "cmobile" && req.body.password === "cmobile") { //if the password is correct
            const payload = { user: req.body.username };
            const options = { expiresIn: '10h', issuer: 'https://localhost' };

            const secret = process.env.JWT_SECRET;

            const token = jwt.sign(payload, secret, options);

            payload.token = token;

            //send token
            return res.status(200).send(
                { status: 200, user: payload }
            ); //send OK , the user and the token

        } else {
            return res.status(401).send("User or password incorrect!");
            //if the password isn't correct
        }
    }
    /*****************************************************************/


};
