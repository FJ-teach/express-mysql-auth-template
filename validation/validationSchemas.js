const yup = require('yup');

const userSchema = yup.object().shape({
	username: yup.string().required().required(),
	email: yup.string().email().required(),
	password: yup.string().required(),
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	address: yup.string().required(),
	telephone: yup.string().required(),
});

const userLoginSchema = yup.object().shape({
	username: yup.string().required(),
	password: yup.string().required(),
});

module.exports = { userSchema, userLoginSchema  };

