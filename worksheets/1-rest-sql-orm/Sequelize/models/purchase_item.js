module.exports = (sequelize, DataTypes) => {
    return sequelize.define('purchase_item', {
	  id: {
        allowNull: false,
		type: DataTypes.INTEGER,
		primaryKey: true,           
		autoIncrement: true
      },
	  price: DataTypes.DECIMAL,
	  quantity: DataTypes.INTEGER,
	  state: DataTypes.STRING
    })
}