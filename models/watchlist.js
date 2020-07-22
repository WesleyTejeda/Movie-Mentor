//Build model for watchlist

module.exports = function(sequelize, DataTypes) {
    var Watchlist = sequelize.define("Watchlist", {
        listTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        popularity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        releaseDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        movieOrShow: {
            type: DataTypes.STRING,
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        voteAvg: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        trailer: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    //Associate the watchlist table to user
    Watchlist.associate = function(models) {
        Watchlist.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Watchlist;
}