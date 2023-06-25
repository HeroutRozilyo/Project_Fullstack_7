const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Assuming you have a Sequelize instance configured

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Other user properties as needed
});

module.exports = User;
