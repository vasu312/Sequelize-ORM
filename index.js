const express = require("express");
const { Sequelize, DataTypes, INTEGER } = require("sequelize");
const config = require("./config/config")["development"];

const app = express();

// MySQL ORM

const sequelize = new Sequelize(config);
sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database Connection Failed", err));

// Model

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 22,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Sync

// Params

// sync()              -- create table if it doesn't exist
// sync({force:true})  -- drop if it already exist 
// sync({alter:true})  -- perform neccessary changes

User.sync({alter:true})
  .then((data) => console.log("Model Created"))
  .catch((err) => console.log(err));

// Express Server

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
