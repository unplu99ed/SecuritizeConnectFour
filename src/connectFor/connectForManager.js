const uuidv4 = require('uuid/v4');
const ConnectForGame = require('./connectForGame');

createBoardResult = (game, index) => ({
  game: game,
  index: index,
})


const findEmptyGame = (games) => {
  let gameResult = null;

  games.forEach((game, index) => {
    if (!gameResult && !game.isFull()) {
      gameResult = createBoardResult(game, index);
    }
  });

  return gameResult;
}

const createNewGame = (games, config) => {
  const game = new ConnectForGame(config);
  return createBoardResult(game, games.push(game) - 1);
}

const getNewGame = (connectForManager, userID, config) => {
  let gameWithRoom = findEmptyGame(connectForManager.games);

  if (gameWithRoom === null) {
    gameWithRoom = createNewGame(connectForManager.games, config);
  }

  connectForManager.users[userID] = gameWithRoom.index;
  gameWithRoom.game.joinGame(userID);
}

const getUserGame = (connectForManager, userID) => {
  return connectForManager.games[connectForManager.users[userID]];
}

class connectForManager {

  constructor(config) {
    this.config = config
    this.games = [];
    this.users = {};

  }

  joinGame() {
    const userID = uuidv4();
    getNewGame(this, userID, this.config)
    return userID;
  }

  getBoard(userID) {
    return getUserGame(this, userID).getBoard();
  }

  takeATurn(userID, col) {
    return getUserGame(this, userID).takeATurn(userID, col);
  }

  isGameEnded(userID) {
    return getUserGame(this, userID).isGameEnded()
  }

}


module.exports = connectForManager