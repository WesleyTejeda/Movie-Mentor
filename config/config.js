module.exports = {
    "development": {
      "username": "root",
      "password": "<password>",
      "database": "movie_mentor",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": "your_password",
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "use_env_variable": process.env.JAWSDB_URL,
      "username": process.env.dbUsername,
      "password": process.env.password,
      "database": process.env.database,
      "host": process.env.host,
      "dialect": "mysql"
    }
}