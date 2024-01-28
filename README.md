# Sequelize ORM Tutorial

This tutorial provides a step-by-step guide on how to use Sequelize, a powerful Object-Relational Mapping (ORM) library, in a Node.js and Express.js project with MySQL.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Setting Up Sequelize](#setting-up-sequelize)
6. [Defining Models](#defining-models)
7. [Database Synchronization](#database-synchronization)
8. [CRUD Operations](#crud-operations)
9. [Validation](#validation)
10. [Funtions](#functions)
11. [Raw Query](#raw-query)
12. [Sequelize.Fn](sequelize.fn)
13. [Getter & Setter](#getter-&-setter)

## Introduction

Welcome to the Sequelize ORM tutorial! In this guide, we'll explore the basics of Sequelize and its integration with Node.js and Express.js. Sequelize simplifies database interactions by providing an intuitive API for working with relational databases.

## Prerequisites

Before diving into the tutorial, ensure you have the following prerequisites:

- Node.js and npm installed
- A MySQL database (locally or remotely) with appropriate credentials

## Getting Started

Let's begin by setting up a new Node.js project. Open your terminal and follow these steps:

```bash
# Create a new project directory
mkdir sequelize-tutorial

# Navigate to the project directory
cd sequelize-tutorial

# Initialize a new Node.js project
npm init -y
```

## Project Structure

```
sequelize-tutorial/
|-- models/
|   |-- user.js
|-- routes/
|   |-- users.js
|-- config/
|   |-- config.js
|-- app.js
|-- package.json

```

## Setting Up Sequelize

Install Sequelize and the MySQL2 driver using the following commands:

```js
npm install sequelize mysql2
```

Next, create a Sequelize configuration file (e.g., config.js) to store your database connection details.

## Connect Database

Create a Sequelize configuration file (e.g., config.js) to store your database connection details:

```js
// config/config.js

module.exports = {
  development: {
    username: "your_username",
    password: "your_password",
    database: "your_database",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  // Add configurations for other environments if needed (e.g., production, test).
};
```

Initialize Sequelize in your Node.js application (e.g., in app.js):
javascript

```js
// app.js

const { Sequelize } = require("sequelize");
const config = require("./config/config");

// Create a Sequelize instance and pass the database configuration
const sequelize = new Sequelize(config.development);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
```

## Defining Models

Define Sequelize models to represent your database tables. In the models directory, create a file for each model. For example, user.js:

```js
// models/user.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return User;
};
```

## Database Synchronization

Use sequelize.sync() to synchronize your Sequelize models with the database. This step creates the necessary tables in the database based on your model definitions.

```js
// app.js

const { Sequelize } = require("sequelize");
const config = require("./config/config");
const userModel = require("./models/user");

const sequelize = new Sequelize(config.development);
const User = userModel(sequelize);

// sync()              -- create table if it doesn't exist
// sync({force:true})  -- drop if it already exist
// sync({alter:true})  -- perform neccessary changes

sequelize.sync({ force: true }).then(() => {
  console.log("Database synced");
});
```

<h3>Note : </h3> Be cautious with { force: true } in a production environment, as it drops existing tables.

## CRUD Operations:

#### User . js

```js
// models/user.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return User;
};
```

#### App . js

```js
// app.js

const express = require("express");
const { Sequelize } = require("sequelize");
const config = require("./config/config");
const userModel = require("./models/user");

const app = express();
const port = 3000;

// Create a Sequelize instance and pass the database configuration
const sequelize = new Sequelize(config.development);

// Define the User model
const User = userModel(sequelize);

// Sync the database (create tables if they don't exist)
sequelize.sync({ force: true }).then(() => {
  console.log("Database synced");

  // Add a sample user
  User.create({
    username: "john_doe",
    email: "john@example.com",
  });
});

app.use(express.json());

// CRUD operations

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.create({ username, email });
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a specific user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await user.update({ username, email });
    res.json(user);
  } catch (error) {
    console.error("Error updating user by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

## Validation

When creating or updating a user instance using Sequelize, these validations will be automatically triggered, and if any validation fails, Sequelize will throw a SequelizeValidationError or SequelizeUniqueConstraintError

```js
// models/user.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Validation
        notEmpty: {
          msg: "Username cannot be empty.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email is already in use.",
      },
      // Validation
      validate: {
        isEmail: {
          msg: "Please provide a valid email address.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // Validation
      validate: {
        len: {
          args: [8, 255],
          msg: "Password must be between 8 and 255 characters.",
        },
      },
    },
  });

  return User;
};
```

## Functions

commonly used Sequelize functions for querying data

### 1. Finding Records:

 <h4>FindAll:</h4> Retrieves all records from a table that match the specified conditions.

```js
const users = await User.findAll({ where: { status: "active" } });
```

 <h4>FindOne:</h4> Retrieves a single record that matches the specified conditions.

```js
const user = await User.findOne({ where: { username: "john_doe" } });
```

<h4>FindByPk:</h4>Retrieves a record by its primary key

```js
const user = await User.findByPk(1);
```

### 2. Creating Records:

<h4>Create:</h4>Creates a new record in the database.

```js
const newUser = await User.create({
  username: "new_user",
  email: "new@example.com",
});
```

### 3. Updating Records:

<h4>Update :</h4>Updates records that match the specified conditions

```js
await User.update({ status: "inactive" }, { where: { userName: "Jhon" } });
```

### 4. Deleting Records:

<h4>Destroy:</h4>Deletes records that match the specified conditions.

```js
await User.destroy({ where: { status: "inactive" } });
```

### 5. Querying with Conditions:

Sequelize provides various operators (Op) for specifying conditions in queries.

```js
const { Op } = require("sequelize");
const activeUsers = await User.findAll({
  where: { status: "active", createdAt: { [Op.gt]: new Date("2023-01-01") } },
});
```

### 6. Sorting and Limiting:

<h4>Order :</h4>pecifies the order in which records are returned.

```js
const users = await User.findAll({ order: [["createdAt", "DESC"]] });
```

<h4>Limit & Offset : </h4>Limits the number of records returned and sets the starting point.

```js
const users = await User.findAll({ limit: 10, offset: 0 });
```

### 7. Creating Records:

<h4>Count :</h4>Counts the number of records that match the specified conditions.

```js
const activeUserCount = await User.count({ where: { status: "active" } });
```

<h4>Sum : </h4>Calculates the sum of a specific field for records that match the specified conditions.

```js
const totalAge = await User.sum("age", { where: { status: "active" } });
```

## Operators

Sequelize uses special operators, often referred to as Op operators, for building complex conditions in queries

### 1. Comparison Operators

```js
1.  Op.eq: Equal
2.  Op.ne: Not Equal
3.  Op.gt: Greater Than
4.  Op.gte: Greater Than or Equal
5.  Op.lt: Less Than
6.  Op.lte: Less Than or Equal
7.  Op.between: Between
8.  Op.notBetween: Not Between
9.  Op.in: In array
10. Op.notIn: Not In array
11. Op.like: Like
12. Op.notLike: Not Like
13. Op.iLike: Case-insensitive Like (only supported by Postgres)
14. Op.notILike: Case-insensitive Not Like (only supported by Postgres)
15. Op.startsWith: Starts with
16. Op.endsWith: Ends with
16. Op.substring: Contains substring

```

### 2. Logical Operators

```js
1.  Op.and: Logical AND
2.  Op.or: Logical OR
3.  Op.not: Logical NOT
```

### 3. Other Operators

```js
1.  Op.is: Strict comparison (null-safe)
2.  Op.not: Negation (unary operator)
3.  Op.col: Reference to a database column
4.  Op.fn: Database function
5.  Op.literal: Literal SQL expression
```

### Example

```js
const { Op } = require("sequelize");

const users = await User.findAll({
  where: {
    age: {
      [Op.gte]: 21, // Age greater than or equal to 21
      [Op.lt]: 30, // Age less than 30
    },
    username: {
      [Op.like]: "john%", // Username starts with 'john'
    },
    createdAt: {
      [Op.between]: [new Date("2023-01-01"), new Date()],
    },
    [Op.or]: [
      { status: "active" },
      { lastLogin: { [Op.gt]: Date.now() - 30 * 24 * 60 * 60 * 1000 } },
    ],
  },
});
```

## Raw Query

Sequelize provides a way to execute raw SQL queries using the sequelize.query method. This method allows you to run arbitrary SQL statements against your database.

```js
const { sequelize } = require("./models");

// Example: Execute a raw SQL query
sequelize
  .query("SELECT * FROM users WHERE status = :status", {
    replacements: { status: "active" },
    type: sequelize.QueryTypes.SELECT,
  })
  .then((results) => {
    console.log("Query results:", results);
  })
  .catch((error) => {
    console.error("Error executing raw query:", error);
  });
```

## sequelize.fn

In Sequelize, you can use MySQL functions through the sequelize.fn method. This allows you to incorporate MySQL built-in functions into your queries. The sequelize.fn method takes the MySQL function name as its first argument and additional arguments as needed by the function.

### 1. Using sequelize.fn for Aggregate Functions:

```js
const { sequelize, Sequelize } = require("./models");

// Example: Calculating the average age of users
const averageAge = await User.findOne({
  attributes: [[sequelize.fn("AVG", sequelize.col("age")), "averageAge"]],
});

console.log("Average Age:", averageAge.dataValues.averageAge);
```

### 2. Using sequelize.fn for String Functions:

```js
const { sequelize, Sequelize } = require("./models");

// Example: Concatenating first and last names
const usersWithFullName = await User.findAll({
  attributes: [
    "id",
    [
      sequelize.fn(
        "CONCAT",
        sequelize.col("firstname"),
        " ",
        sequelize.col("lastname")
      ),
      "fullName",
    ],
  ],
});

console.log(
  "Users with Full Name:",
  usersWithFullName.map((user) => user.dataValues.fullName)
);
```

### 3. Using sequelize.fn for Date Functions:

```js
const { sequelize, Sequelize } = require("./models");

// Example: Extracting the year from the birthdate
const usersWithYear = await User.findAll({
  attributes: [
    "id",
    [sequelize.fn("YEAR", sequelize.col("birthdate")), "birthYear"],
  ],
});

console.log(
  "Users with Birth Year:",
  usersWithYear.map((user) => user.dataValues.birthYear)
);
```
## Getter & Setter

Getters and setters allow you to manipulate data before it is stored in the database (setter) or before it is retrieved from the database (getter). 

```js
const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql', // or any other supported dialect
});

// Define a model with getters and setters
const User = sequelize.define('User', {
  // Regular attributes
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.VIRTUAL, // Virtual attribute that doesn't exist in the database
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
      // Assuming that the full name is in the format "FirstName LastName"
      const parts = value.split(' ');
      this.setDataValue('firstName', parts[0]);
      this.setDataValue('lastName', parts[1]);
    },
  },
}, {
  // Other model options
});

// Sync the model with the database
(async () => {
  await sequelize.sync({ force: true });
  console.log('Model synchronized');
})();

```
