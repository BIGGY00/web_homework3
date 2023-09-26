const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const createNew = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content cannot be empty" });
    }
    const salt = bcrypt.genSaltSync(10);
    const userObj = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt),
    });
    User.create(userObj, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error has occured while creating"
            });
        } else {
            res.send(data);
        }
    });
};

const validUsername = (req, res) => {
    User.checkUsername(req.params.us, (err, data) => {
        if (err) {
            if (err.kind = "not_found") {
                res.send({
                    message: "Not found " + req.param.us,
                    valid: true,
                });
            } else {
                res.status(500).send({ message: "Error retrieving " + req.params.us })
            }
        } else {
            res.send({ record: data, valid: false });
        }
    });
};

const login = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty.",
        });
    }
    const account = new User({
        username: req.body.username,
        password: req.body.password
    });
    User.login(account, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(401).send({
                    message: "Not found " + req.body.username
                });
            } else if (err.kind == "invalid_pass") {
                res.status(401).send({
                    message: "Invalid Password"
                });
            } else {
                res.status(500).send({
                    message: "Error retriving " + req.body.username
                });
            }
        } else {
            res.send(data);
        }
    });
};

const getAllUsers = (req, res) => {
    User.getAllUsers((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Error while retrieving users."
            });
        } else {
            res.send(data);
        }
    });
};

const updateUser = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const id = req.params.id;
    const updatedUser = {
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    };

    User.updateUser(id, updatedUser, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `User with id ${id} not found` });
            } else {
                res.status(500).send({ message: `Error updating user with id ${id}` });
            }
        } else {
            res.send(data);
        }
    });
};

const deleteUser = (req, res) => {
    const id = req.params.id;

    User.deleteUser(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `User with id ${id} not found` });
            } else {
                res.status(500).send({ message: `Could not delete user with id ${id}` });
            }
        } else {
            res.send(data);
        }
    });
};

module.exports = { createNew, validUsername, login, getAllUsers, updateUser, deleteUser }