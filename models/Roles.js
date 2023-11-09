module.exports = (sequelize, Sequelize) => {
	const Roles = sequelize.define(
		'Roles',
		{
			name: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},

		},
		// CA time stamp for when a user was created and when a users information has been updated
		{
			timestamps: false,
		}
	);

	Roles.associate = function (models) {
		// Users.belongsTo(models.Carts);
		// Users.belongsTo(models.Roles);
		// Users.belongsTo(models.Membership);
	};

	return Roles;
};

