module.exports = (sequelize, Sequelize) => {
	const Users = sequelize.define(
		'Users',
		{
			address: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			telephone: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			firstname: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: Sequelize.DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			lastname: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			encryptedPassword: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false,
			},
			salt: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false,
			},
		},
		// CA time stamp for when a user was created and when a users information has been updated
		{
			timestamps: true,
		}
	);

	Users.associate = function (models) {
		// Users.belongsTo(models.Carts);
		Users.belongsTo(models.Roles);
		// Users.belongsTo(models.Membership);
	};

	return Users;
};


