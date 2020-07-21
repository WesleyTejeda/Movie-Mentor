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
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    //Associate the watchlist table to user
    Watchlist.associate = function(models) {
        Watchlist.belongsTo(models.User, {
            foreignKey: "UserId",
            onDelete: "cascade",
            targetKey: 'id'
        });
    };

    return Watchlist;
}