var crypto = require('crypto');

var genRandomString = function (length) {
	return crypto
		.randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length);
};

var sha512 = function (password, salt) {
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt: salt,
		passwordHash: value,
	};
};

async function saltHashPassword(userpassword) {
	var salt = genRandomString(16);
	var passwordData = sha512(userpassword, salt);

	return { hashedPassword: passwordData.passwordHash, salt: passwordData.salt };
}

async function saltHashPasswordFromSalt(userpassword, salt) {

	var passwordData = sha512(userpassword, salt);
	return { hashedPassword: passwordData.passwordHash};
}

module.exports = { saltHashPassword, saltHashPasswordFromSalt };

