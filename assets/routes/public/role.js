const role = require('../../mongo/modules/role');

module.exports = (app) => {
    //role routes
    app.get('/role/getAll', role.getAll);
}