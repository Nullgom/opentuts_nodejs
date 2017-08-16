'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			authId : {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING(50)
			},
			username: {
				type: Sequelize.STRING(30)
			},
			salt: {
				type: Sequelize.STRING(200)
			},
			password: {
				type: Sequelize.STRING(200)
			},
			displayName: {
				allowNull: false,
				type: Sequelize.STRING(50)
			},
			email: {
				type: Sequelize.STRING(50)
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.Now
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.Now
			}
		});
	},
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};