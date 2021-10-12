var navigation = require('../../mongo/modules/navigation');
const security = require('../../services/security');

module.exports = (app) => {
	// Get Homepage
	app.get('/', navigation.loadIndexPage);
	
	// Profile
	app.get('/user/profile', security.ensureAuthenticated, navigation.loadProfilePage);

	// Login
	app.get('/user/login', navigation.loadLoginPage);

	// Register
	app.get('/user/register', navigation.loadRegisterPage);

	// Register
	app.get('/forum', navigation.loadForumPage);
	app.get('/forum/:id', navigation.loadSingleForum);
	app.get('/forum/sub_forum/:id', navigation.loadSingleSubForum);
	app.get('/forum/sub_forum/thread/:id', navigation.loadThread);

	app.get('/contact', navigation.loadContactPage);
	app.get('/stats', navigation.loadStatsPage);
    app.get('/zombiemania', navigation.loadZombiePage);
	app.post('/zombieMovies', navigation.process_movies);
	app.get('/admin', security.ensureAuthenticated, navigation.loadAdminPage);
}
