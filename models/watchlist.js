//Build model for watchlist

module.exports = function(sequelize, DataTypes) {
    var Watchlist = sequelize.define("watchlist", {
        movie: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    //Associate the watchlist table to user
    Watchlist.associate = function(models) {
        Watchlist.belongsto(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Watchlist;
}