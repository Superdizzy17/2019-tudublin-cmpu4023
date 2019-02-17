module.exports = (sequelize, DataTypes) => {
    return sequelize.define('purchase', {
	  id: {
      allowNull: false,
		  type: DataTypes.INTEGER,
		  primaryKey: true,           
		  autoIncrement: true
	  },
	  name: DataTypes.STRING,
	  address: DataTypes.STRING,
	  state: DataTypes.STRING,
	  created_at: DataTypes.DATE,
    zipcode: DataTypes.STRING,
    })
}