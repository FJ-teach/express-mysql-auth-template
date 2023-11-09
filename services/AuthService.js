const moment = require('moment');
const { QueryTypes } = require('sequelize');
// var crypto = require('crypto');
const { saltHashPassword } = require('../modules/encryption');

class UserService {
	constructor(db) {
		this.client = db.sequelize;
		this.Users = db.Users;
		// this.Roles = db.Roles;
		// this.Carts = db.Carts;
	}

	async getOneId(id) {
		return this.Users.findOne({
			where: { id: id },
		});
	}

	async getOneName(name) {
		return this.Users.findOne({
			where: { name: name },
		});
	}

	async getUserFromEmailorUsername(email) {
		try {
			let user = await this.Users.findOne({
				where: { email: email },
			});

			if (!user) {
				user = await this.Users.findOne({
					where: { username: email },
				});
			}
			return user;
		} catch (err) {
			throw err;
		}
	}

	async get() {
		let users = await this.client.query(
			'SELECT users.id as id, email, username, firstname, address, telephone, \
		lastname, RoleId, Roles.name as Role, memberships.name as membership, memberships.id as MembershipId \
		FROM users JOIN roles on users.RoleId = roles.id \
		JOIN Memberships on users.MembershipId = Memberships.id',
			{ raw: true, type: QueryTypes.SELECT }
		);
		return users;
	}

	// async getRoles() {
	// 	let roles = await this.client.query('SELECT * FROM Roles', { raw: true, type: QueryTypes.SELECT });
	// 	return roles;
	// }

	async update(id, email, roleid) {
		try {
			const data = await this.Users.findOne({ where: { id: id } });
			if (!data) {
				throw new Error('User not found');
			}
			const result = await this.Users.update({ email: email, RoleId: roleid }, { where: { id: id } });

			return { message: 'User id[' + id + '] updated' };
		} catch (error) {
			throw error;
		}
	}
	async updateRole(id, name) {
		try {
			const data = await this.Roles.findOne({ where: { id: id } });
			if (!data) {
				throw new Error('Role not found');
			}
			const result = await this.Roles.update({ name: name }, { where: { id: id } });

			return { message: 'Role id[' + id + '] updated to new value: ' + name };
		} catch (error) {
			throw error;
		}
	}

	async updateMembership(userId, newMemberShipId) {
		return await this.Users.update({ MembershipId: MembershipId }, { where: { id: userId } });
	}

	async create(user, role = 4) {
		try {
			const Exists = await this.Users.findOne({ where: { username: user.username } });
			if (Exists) {
				throw new Error('Username already exists');
			}

			const ExistsEmail = await this.Users.findOne({ where: { email: user.email } });
			if (ExistsEmail) {
				throw new Error('Email already exists');
			}

			let { hashedPassword, salt } = await saltHashPassword(user.password);

			const data = await this.Users.create({
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				encryptedPassword: hashedPassword,
				salt: salt,
				address: user.address,
				telephone: user.telephone,
				RoleId: role,
			});

			return data;
		} catch (error) {
			throw error;
		}
	}

	async initializeRoles() {
		try {
			const result = await this.client.query("INSERT INTO Roles (name) VALUES ('Admin'),('User')");
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	async delete(id) {
		try {
			const brand = await this.Users.destroy({ where: { id: id } });
			if (language === 0) {
				throw new Error('Brand not found');
			}
			return brand;
		} catch (error) {
			throw error;
		}
	}

	// async initBrands(SQL_INSERT) {
	// 	try {
	// 		let result = await this.client.query(SQL_INSERT, { type: QueryTypes.INSERT });
	// 		let data = await this.Users.findAll();
	// 		return data;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	async createAdmin() {
		var salt = crypto.randomBytes(16);
		let password = 'password';

		crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
			if (err) {
				return next(err);
			}

			const user = {
				username: 'Admin',
				email: 'admin@noroff.no',
				password: password,
				firstname: 'Admin',
				lastname: 'Support',
				hashedPassword: hashedPassword,
				salt: salt,
				address: 'Online',
				telephone: 911,
				MembershipId: 1,
			};

			const data = await this.Users.create({
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				encryptedPassword: user.hashedPassword,
				salt: user.salt,
				RoleId: 1,
				address: user.address,
				telephone: user.telephone,
				MembershipId: user.MembershipId,
			});
			return data;
		});
	}
}

// async function encryptPassword(password) {
// 	var salt = crypto.randomBytes(16);
// 	crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
// 		if (err) {
// 			return next(err);
// 		}
// 		return { hashedPassword: hashedPassword, salt: salt };
// 	});
// }

module.exports = UserService;

