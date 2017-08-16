module.exports = function(sequelize, DataTypes) {
  var Topic = sequelize.define('Topic', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    author: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
		  Topic.belongsTo(models.User);
      }
    }
  });
  return Topic;
};