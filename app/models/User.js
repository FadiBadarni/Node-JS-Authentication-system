const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

module.exports = User;
