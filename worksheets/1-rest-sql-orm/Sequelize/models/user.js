module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
	  id: {
        allowNull: false,
		type: DataTypes.INTEGER,
		primaryKey: true,           
		autoIncrement: true
	  },
	  email: DataTypes.STRING,
	  password: DataTypes.STRING,
	  details: DataTypes.HSTORE,
	  created_at: DataTypes.DATE,
	  deleted_at: DataTypes.DATE
    })
}