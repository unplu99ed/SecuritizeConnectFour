const ConnectForCntrl = require('../connectFor/connectForCntrl');

module.exports = {
  register: function (app, configs) {
    let connectForCntrl = new ConnectForCntrl(configs);
    app.use('/', connectForCntrl.getRouter());
  }
}
