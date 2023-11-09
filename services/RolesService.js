const { QueryTypes } = require('sequelize');

class RoleService {
	constructor(db) {
		this.client = db.sequelize;
		this.Roles = db.Roles;
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

	async get() {}

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

	async create(user) {}

	async initializeRoles() {
		try {
			const result = await this.client.query("INSERT INTO Roles (name) VALUES ('Admin'),('Organizer'),('Speaker'),('Attendee')", { raw: true, type: QueryTypes.INSERT });
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
}

module.exports = RoleService;

