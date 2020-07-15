'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Watchlist.associate = function(models) {
        Watchlist.belongsTo(models.Users);
       // Watchlist.belongsTo(models.Movies);
      }

    }
  };
  Watchlist.init({
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Watchlist',
  });
  return Watchlist;
};