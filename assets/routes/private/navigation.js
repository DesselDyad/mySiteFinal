var navigation = require('../../mongo/modules/navigation');
const security = require('../../services/security');

module.exports = (app) => {
	app.get('/admin', security.ensureAuthenticated, navigation.loadAdminPage);
}
