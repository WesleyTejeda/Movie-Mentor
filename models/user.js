//Build model for user

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    //Associate user with watchlist, on deletion of user then delete their watchlist
    User.associate = function(models) {
        User.hasMany(models.Watchlist, {
            onDelete: "cascade"
        });
    };
    
    return User;
}