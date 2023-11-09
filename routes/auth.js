var express = require('express');
var router = express.Router();
var db = require('../models/index.js');
const { saltHashPasswordFromSalt } = require('../modules/encryption.js');
var authService = require('../services/AuthService');
var authservice = new authService(db);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
const { validate } = require('../middelware/authentication.js');
const { userSchema, userLoginSchema } = require('../validation/validationSchemas.js');

require('dotenv').config();

router.post('/register', validate(userSchema), jsonParser, async (req, res, next) => {
	/* #swagger.tags = ['Authentication']
	 	#swagger.description = "Register / Sign-up a new user"
	 	#swagger.produces = ['application/json']
		#swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Signup"
      }
    }
		#swagger.responses[200] = {
			"schema": {
				$ref: "#definitions/SignupOK"
			}
		}
		#swagger.responses[400] = {
			"schema": {
				$ref: "#definitions/Error"
			}
		}
  */

	try {
		let result = await authservice.create(req.body);
		console.log(result);
	} catch (err) {
		return res.status(500).json({ result: err.message });
	}
	return res.status(200).json({ result: 'Your created an account.' });
});

router.post('/login', validate(userLoginSchema), jsonParser, async (req, res, next) => {
	/* #swagger.tags = ['Authentication']
	 	#swagger.description = "Login new user"
	 	#swagger.produces = ['application/json']
		#swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Authentication"
      }
    }
		#swagger.responses[200] = {
			"schema": {
				$ref: "#definitions/LoginOK"
			}
		}
		#swagger.responses[400] = {
			"schema": {
				$ref: "#definitions/Error"
			}
		}
  */
	const { username, password } = req.body;

	try {
		authservice.getUserFromEmailorUsername(username).then(async (data) => {
			if (data === null) {
				return res.status(401).json({ result: 'Incorrect email/username or password' });
			}

			let { hashedPassword, salt } = await saltHashPasswordFromSalt(password, data.salt);

			if (data.encryptedPassword.toString() != hashedPassword) {
				return res.status(401).json({ result: 'Incorrect username or password' });
			}

			let token;
			try {
				token = jwt.sign({ id: data.id, email: data.email, role: data.RoleId, username:data.username }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
			} catch (err) {
				return res.status(403).json({ result: 'Something went wrong with creating JWT token' });
			}
			res.cookie('Authentication', token);
			return res.status(200).json({ result: 'You are logged in', id: data.id, email: data.email, name: data.firstname + ' ' + data.lastname, token: token });
		});
	} catch (err) {
		return res.status(500).json({ result: err.message });
	}
});

module.exports = router;