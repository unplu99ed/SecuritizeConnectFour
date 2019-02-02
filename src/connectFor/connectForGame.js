const createError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode;
  return error
}

const checkConnectFor = (board, col, row, config) => {
  let thereIsAWinner = false;

  for (let i = -1; i < 2 && !thereIsAWinner; ++i) {
    for (let j = -1; j < 2 && !thereIsAWinner; ++j) {
      if (i != 0 || j != 0) {
        thereIsAWinner = !thereIsAWinner ? checkConnectForDirection(board, col, row, { col: i, row: j }, config) : thereIsAWinner;
      }
    }
  }

  return thereIsAWinner;
}

const isInRange = (num, min, max) => {
  return num >= min && num <= max;
}

const checkConnectForDirection = (board, col, row, direction, config) => {
  let counter = 0;
  let currentLocation = { col: col, row: row };
  let neededValue = board[col][row];
  while (counter < 4 && isInRange(currentLocation.col, 0, config.board.col - 1)
    && isInRange(currentLocation.row, 0, config.board.row - 1)
    && neededValue === board[currentLocation.col][currentLocation.row]) {

    currentLocation.col += direction.col;
    currentLocation.row += direction.row;
    counter++
  }

  return counter === 4;
}

// const checkGameEnded = (board) => {
//   board.forEach(row =>)
// }

const isItTheUserTurn = (game, userID) => {
  return game.players[game.currentPlayer] === userID;
}

class connectForGame {
  constructor(config) {
    this.config = config.connectFor
    this.players = []
    this.currentPlayer = 0;
    this.gameEnded = false;

    const boardSettings = this.config.board
    this.initBoard(boardSettings.row, boardSettings.col);
  }

  initBoard(row, col) {
    this.board = [];
    for (let i = 0; i < col; ++i) {
      this.board.push([]);
    }
  }

  isFull() {
    return this.players.length == 2;
  }

  joinGame(userID) {
    if (!this.isFull()) {
      this.players.push(userID);
    } else {
      createError('current game is already full', 400);
    }
  }

  takeATurn(userID, col) {
    if (!this.isGameEnded() && isItTheUserTurn(this, userID)
      && this.board[col].length < this.config.board.row) {
      this.board[col].push(this.currentPlayer);
      this.currentPlayer = (this.currentPlayer + 1) % 2;
      this.gameEnded = checkConnectFor(this.board, col, this.board[col].length - 1, this.config)

      return true;
    }
    else {
      throw createError('not your turn or invalid move', 400);
    }
  }

  isGameEnded() {
    return this.gameEnded
  }

  getBoard() {
    return this.board;
  }

}

module.exports = connectForGame;