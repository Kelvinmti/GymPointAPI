# GymPointAPI

This is an example of an API that includes some comom routines used to manage a Gym.

# Technologies
* Node.js
* ORM Sequelize
* Postgres


## Setup

To clone and run this application, you will need:
* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/)
* [Postgres Installer](https://www.postgresql.org/) or [Postgres docker image](https://hub.docker.com/_/postgres)

After installing postgres create a new database called "gympoint"and edit the file "src/config/database.js" with your database credentials.

From your command line:
```bash
# Clone this repository:
$ git clone https://github.com/Kelvinmti/GymPointAPI.git
```

```bash
# Go into the repository:
$ cd GymPointAPI
```

```bash
# Install dependencies with yarn:
$ yarn
```

```bash
# Run the database migrations using sequelize, to create the tables:
$ yarn sequelize db:migrate
```

## Usage
Now you are ready to start e teste the API.

From your command line:

```bash
# Start the server
$ yarn start
```

Now you can test the API using [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/download/).
