const sql = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");

const User = function (user) {
    this.fullname = user.fullname;
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
    this.img = user.img;
};
const expireTime = "1h";

// Create
User.create = (newUser, result) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        const token = jwt.sign({ id: res.insertId }, scKey.secret, { expiresIn: expireTime } );
        console.log("Created user: ", {
            id: res.insertId,
            ...newUser,
            // userType: "user",
            accessToken: token,
        });
        result(null, {
            id: res.insertId,
            ...newUser,
            // userType: "user",
            accessToken: token,
        });
    });
};

// Check
User.checkUsername = (username, result) => {
    sql.query("SELECT * FROM users WHERE username = '" + username + "'", (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("Found username: " + res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

// Login
User.login = (account, result) => {
    sql.query("SELECT * FROM users WHERE username = '" + account.username + "'", (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if (res.length) {
            const validPassword = bcrypt.compareSync(
                account.password,
                res[0].password
            );
            if (validPassword) {
                const token = jwt.sign({ id: res.insertId }, scKey.secret, { expiresIn: expireTime });
                console.log("Login success. Token was generated: " + token);
                res[0].accessToken = token;
                result(null, res[0]);
                return;
            } else {
                console.log("Password invalid.");
                result({ kind: "invalid_pass" }, null);
                return;
            }
        }
        result({ kind: "not_found" }, null);
    });
};

// getAllUsers
User.getAllUsers = (result) => {
    sql.query("SELECT * FROM users", (err, res) => {
        if (err) {
            console.log("Query error: "+ err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

// Update
User.updateUser = (id, updatedUser, result) => {
    sql.query("UPDATE users SET ? WHERE id = ?", [updatedUser, id], (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Updated user: " + id);
        result(null, { id, ...updatedUser });
    });
};

// Delete
User.deleteUser = (id, result) => {
    sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted user: " + id);
        result(null, { message: "User deleted successfully." });
    });
};

module.exports = User;