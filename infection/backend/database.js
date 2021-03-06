const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.load();

const db = new Sequelize(
  `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${
    process.env.DATABASE_URI
  }:3306/${process.env.DATABASE_NAME}`,
  {}
);

db.authenticate()
  .then(() => {
    console.log('Connection to db has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = db.define('User', {
  username: Sequelize.STRING,
  gamesPlayed: Sequelize.INTEGER,
  wins: Sequelize.INTEGER,
  losses: Sequelize.INTEGER,
  clearanceLevel: Sequelize.STRING,
  photo: Sequelize.STRING,
  email: Sequelize.STRING,
});

// game schema
const Game = db.define('game', {
  numberOfPlayers: Sequelize.INTEGER,
  pal3000Active: Sequelize.BOOLEAN,
  winner: Sequelize.STRING,
  results: {
    type: Sequelize.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('results').split(';');
    },
    set(val) {
      this.setDataValue('results', val.join(';'));
    },
  },
});

Game.sync({ force: false })
  .then(game => {
    // console.log('game model created in db');
  })
  .catch(err => {
    console.error(err);
  });

const findOrCreateUser = (profile, callback) => {
  const username = profile.displayName;
  const photo = profile.photos[0].value.slice(
    0,
    profile.photos[0].value.indexOf('?')
  );
  User.findOrCreate({
    where: { username },
    defaults: {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      clearanceLevel: 'unclassified',
      photo,
      email: '',
    },
  }).spread((user, created) => {
    console.log(
      user.get({
        plain: true,
      })
    );
    callback(user);
  });
};

// Add PAL3000 to the db
User.findOrCreate({
  where: { username: 'PAL3000' },
  defaults: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    clearanceLevel: 'unclassified',
    photo: '',
    email: '',
  },
}).spread((user, created) => {
  console.log(
    user.get({
      plain: true,
    })
  );
  console.log('PAL3000 added to the db:', created, ', false = already in db');
});

const createGameAndGetJoinCode = ({ playerCount, pal3000Active }) => {
  // grab user id to pass into game
  // FIXME: no longer need cb
  return Game.create({ numberOfPlayers: playerCount, pal3000Active })
    .then(game => {
      return new Promise((resolve, reject) => {
        resolve(game.get('id'));
      });
    })
    .catch(err => {
      console.error(err);
    });
};

const palActive = (id, callback) => {
  Game.find({
    where: {
      id,
    },
  }).then(game => {
    // console.log(game, 'game db 115');
    callback(game.pal3000Active);
  });
};

const clearanceLevels = wins => {
  if (wins < 10) {
    return 'unclassified';
  } else if (wins > 9 && wins < 20) {
    return 'confidential';
  } else if (wins > 19 && wins < 50) {
    return 'secret';
  } else if (wins > 49 && wins < 100) {
    return 'top-secret';
  } else if (wins > 99 && wins < 1000) {
    return 'illuminati';
  }
};

// update user stats
const updateUserStats = ({ win, username }, callback) => {
  // check for win or loss
  const result = win ? 'wins' : 'losses';
  // create array of attributes to increment
  const toIncrement = ['gamesPlayed', result];
  // find user
  User.find({ where: { username } })
    // increment fields
    .then(user => user.increment(toIncrement))
    .then(user => {
      const wins = user.wins;
      // check clearanceLevel
      const clearanceLevel = clearanceLevels(wins);
      return user.update({ clearanceLevel });
    })
    .then(() => User.find({ where: { username } }))
    // return the updated user
    .then(user => callback(user));
};

// get user stats
const getUserStats = ({ username }, callback) => {
  // find user
  User.find({ where: { username } })
    // return the user
    .then(user => callback(user));
};

// drop the db
// User.sync({ force: true }).then(() => {
//   console.log('USER DATABASE DROPPED');
// });

// Game.sync({ force: true }).then(() => {
//   console.log('GAME DATABASE DROPPED');
// });

module.exports = {
  // createGame,
  createGameAndGetJoinCode,
  findOrCreateUser,
  updateUserStats,
  getUserStats,
  db,
  User,
  Game,
  palActive,
};
