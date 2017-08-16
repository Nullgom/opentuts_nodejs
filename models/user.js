module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		authId: { type: DataTypes.STRING, unique: true, allowNull: false },
		username: DataTypes.STRING,
		salt:DataTypes.STRING,  
		password: DataTypes.STRING,  
		displayName: DataTypes.STRING,  
		email: { type: DataTypes.STRING, unique: true },
		createdAt: DataTypes.DATE
	}, {
		classMethods: {
			associate: function(models) {
			// associations can be defined here
				User.hasMany(models.Topic);
			}
		}
	});	
	return User;
};