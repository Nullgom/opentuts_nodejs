module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Topics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
		allowNull: false,  
        type: Sequelize.STRING(100)
      },
      description: {
		allowNull: false,  
        type: Sequelize.TEXT
      },
      author: {
		allowNull: false,  
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
		defaultValue: Sequelize.Now  
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Topics');
  }
};