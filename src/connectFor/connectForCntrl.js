const express = require('express');
const connectForManager = require('./connectForManager');

getUserTokenFromRequest = (req) => {
  return req.headers["user-token"];
}

const handleErrorResponse = (res, error) => {
  res.status(error.statusCode ? error.statusCode : 500).send(error.message);
}

class connectForCntrl {
  constructor(config) {
    this.connectForManager = new connectForManager(config)
  }

  joinGame(req, res, next) {
    try {
      const userID = this.connectForManager.joinGame()
      res.status(200).json({ 'user-token': userID });
    }
    catch (error) {
      handleErrorResponse(res, error);
    }
  }

  getBoard(req, res, next) {
    try {
      const userID = getUserTokenFromRequest(req);
      res.status(200).json({ gameBoard: this.connectForManager.getBoard(userID) });
    }
    catch (error) {
      handleErrorResponse(res, error);
    }
  }

  takeATurn(req, res, next) {
    try {

      const userID = getUserTokenFromRequest(req);
      const col = parseInt(req.body.col);
      const TurnResult = this.connectForManager.takeATurn(userID, col);
      res.status(200).json({ TurnResult: TurnResult });
    }
    catch (error) {
      handleErrorResponse(res, error);
    }
  }

  checkGameEnded(req, res, next) {
    try {
      const userID = getUserTokenFromRequest(req);
      res.status(200).json({ GameEnded: this.connectForManager.isGameEnded(userID) });
    }
    catch (error) {
      handleErrorResponse(res, error);
    }
  }

  getRouter() {
    const router = express.Router();

    router.post('/joinGame', this.joinGame.bind(this));
    router.get('/board', this.getBoard.bind(this));
    router.post('/takeATurn', this.takeATurn.bind(this));
    router.get('/checkGameEnded', this.checkGameEnded.bind(this));

    return router;
  }

}


module.exports = connectForCntrl;