const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models").Users;
const Movies = require("../models").Movies;
const sequelize =require('sequelize')
const checkAuth = require('../middleware/check-auth');
module.exports = function(router) {
    router.get("/users", (req, res) => {
        Users.findAll({
            // include: [Movies]
            //where: { id: req.params.id ,name:req.params.name,email:req.params.email}

        })
            //  .select('id name email password')
            //.exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            id: doc.id,
                            name: doc.name,
                            email: doc.email,
                            // _id: doc._id,
                            request: {
                                type: "GET",
                                url: "http://localhost:3030/users/" + doc.id
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });


    router.get("/users/:id", (req, res) => {
        //const id = req.params.userId;

        Users.findAll({
            where: {id: req.params.id}//,name:req.params.name,email:req.params.email}
        })
           .then(doc => {
            if (doc) {
                res.status(200).json({
                    users: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3030/users',
                    }
                });
            } else {
                res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"});
            }
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    });

    router.post("/users", (req, res) => {
        Users.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
            //.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Created User successfully",
                    createdUsers: {
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        // _id: result._id,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3030/users/" + result.id,

                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

    router.post("/users/signup", (req, res, next) => {
       // const email = req.params.email;
        Users.findAll({where:{ email:req.body.email }})
            //.exec()
            .then(users => {
                if (users.length >= 1) {
                    return res.status(409).json({
                        message: "Mail exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const users = new Users({
                               // _id: new sequelize.Types.ObjectId(),
                                email: req.body.email,
                                password: hash,
                                name:  req.body.name

                            });
                            return users
                                .save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User created"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    });
                }
            });
    });

    router.post("/users/login", (req, res, next)=> {
        Users.findAll({where:{ email:req.body.email }})
           // .exec()
            .then(users => {
                if (users.length < 1) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: users[0].email,
                                id: users[0].id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1d"
                            }
                        );
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: "Auth failed"
                    });
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });




//Not Working
    router.put("/users/:id", (req, res) => {

        Users.findAll({where: {id: req.body.id}})
        //const id = req.params.id;

        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        Users.update({$set: updateOps},{where: {id: req.body.id}})
            .then(result => {
                res.status(200).json({
                    message: 'User updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3030/users/' + id,
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });


    router.delete("/users/:id", (req, res) => {
        Users.destroy({
            where: {id: req.params.id}
        })
            .then(result => {
                res.status(200).json({
                    message: 'User deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3030/users',
                        body: {name: 'String', email: 'String', password: 'String'}
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });
}