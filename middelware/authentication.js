const jwt = require('jsonwebtoken');

function isAuth(req, res, next) {
	// Get token from the cookies
	try {
		const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

		// Check if token is not present
		if (!token) {
			return res.status(401).json({
				statusCode: 401,
				result: 'Authentication token is missing.',
			});
		}

		// Verify token
		jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
			if (err) {
				console.error('JWT Verification Error:', err);
				return res.status(401).json({
					statusCode: 401,
					result: 'Failed to authenticate token.',
				});
			}

			// If token is verified, store user's info for subsequent middleware/routes to use
			req.userId = decoded.id;
			req.username = decoded.username;
			req.roleId = decoded.role;
			console.log('Decoded token:', decoded);

			// Proceed to the next middleware or route handler
			next();
		});
	} catch (error) {
		return res.status(401).json({
			result: 'Failed to authenticate token.',
		});
	}
}

async function isAdmin(req, res, next) {
	try {
			const user = await User.findByPk(req.userId);
			if (!user) {
					return res.status(404).json({ message: 'User not found.' });
			}
			if (user.roleId !== 1 ) {
					return res.status(403).json({ message: 'Access denied. Not an admin.' });
			}
			next();
	} catch (err) {
			console.error('Error in isAdmin middleware:', err);
			res.status(500).json({ message: 'Server error.' });
	}
}

function validate(schema) {
	return async (req, res, next) => {
		try {
			await schema.validate(req.body).then((valid, re) => {
				console.log('🚀 ~ file: authentication.js:56 ~ validate ~ valid:', valid);
			});
			next();
		} catch (err) {
			console.log('🚀 ~ file: authentication.js:59 ~ return ~ err:', err);
			return res.status(500).json({ result: err.message, error: err.name });
		}
	};
}

module.exports = { validate, isAdmin, isAuth };

