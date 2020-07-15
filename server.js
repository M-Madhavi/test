const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3030;

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

require("./routes/watchlistRoutes")(app);
require("./routes/usersRoutes")(app);
require("./routes/moviesRoutes")(app);

app.listen(port, () => console.log(`Server started on ${port}`));
