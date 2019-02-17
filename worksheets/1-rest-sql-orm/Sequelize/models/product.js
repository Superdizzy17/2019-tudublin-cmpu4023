module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
	  id: {
        allowNull: false,
		type: DataTypes.INTEGER,
		primaryKey: true,           
		autoIncrement: true
	  },
	  title: DataTypes.STRING,
	  price: DataTypes.DECIMAL,
	  tags: DataTypes.ARRAY(DataTypes.STRING),
	  created_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    })
}