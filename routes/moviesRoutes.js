const Users = require("../models").Users;
const Movies = require("../models").Movies;

module.exports = function(router) {
    router.get("/movies", (req, res) => {
        Movies.findAll({
            //include: [Users]
        })
            .then(docs => {
                const response = {
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            id: doc.id,
                            title: doc.title,
                            actors: doc.actors,
                            poster: doc.poster,
                            director: doc.director,
                            language: doc.language,
                            released:doc.released,
                            // _id: doc._id,
                            request: {
                                type: "GET",
                                url: "http://localhost:3030/movies/" + doc.id
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



    router.get("/movies/:id", (req, res) => {
        Movies.findAll({
            where: { id: req.params.id}//title:req.params.title,director:req.params.director,actors:req.params.actors,poster:req.params.poster,language:req.params.language }
        })
            .then(doc => {
                if (doc) {
                    res.status(200).json({
                        users: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3030/movies',
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


    router.post("/movies", (req, res) => {
        Movies.create({
            title: req.body.title,
            director: req.body.director,
            actors: req.body.actors,
            poster: req.body.poster,
            language: req.body.language,
            released: req.body.released
        })
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Created Movie successfully",
                    createdUsers: {
                        id: result.id,
                        title: result.title,
                        director: result.director,
                        actors:result.actors,
                        poster:result.poster,
                        language:result.language,
                        released:result.released,

                        // _id: result._id,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3030/movies/" + result.id,

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
//Not working
    router.put("/movies/:id", (req, res) => {
        const id = req.params.id;

        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        Movies.update({$set: updateOps}, {where: {id: req.params.id}})
            .then(result => {
                res.status(200).json({
                    message: 'Movie updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3030/movies/' + id,
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



    router.delete("/movies/:id", (req, res) => {
        Movies.destroy({
            where: { id: req.params.id }
        })
            .then(result => {
                res.status(200).json({
                    message: 'Movie deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3030/movies',
                        body: {title: 'String', actors: 'String', director: 'String'}
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