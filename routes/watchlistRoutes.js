const Watchlist = require("../models").Watchlist;
const Users = require("../models").Users;
const Movies = require("../models").Movies;

module.exports = function(router) {
    router.get("/watchlist", (req, res) => {
        Watchlist.findAll({
            include: [Users, Movies]
        }).then(watchlist => {
            res.json(watchlist);
        });
    });

    router.get("/watchlist/:id", (req, res) => {
        Watchlist.findAll({
            where: { id: req.params.id },
            include: [Users, Movies]
        }).then(watchlist => {
            res.json(watchlist[0]);
        });
    });

    router.post("/watchlist", (req, res) => {
        Watchlist.create({
            userId: req.body.userId,
            movieId: req.body.movieId
        })
            .then(watchlist => {
                res.json(watchlist);
            })
            .catch(err => res.json(err));
    });

    router.put("/watchlist/:id", (req, res) => {
        Watchlist.update(
            { userId: req.body.userId, movieId: req.body.movieId },
            { where: { id: req.params.id } }
        )
            .then(updatedWatchlist => {
                res.json(updatedWatchlist);
            })
            .catch(err => console.log(err));
    });

    router.delete("/watchlist/:id", (req, res) => {
        Watchlist.destroy({
            where: { id: req.params.id }
        }).then(watchlist => {
            res.json(watchlist);
        });
    });
};
