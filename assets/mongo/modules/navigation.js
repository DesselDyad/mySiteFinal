const user = require('../mongo_modules/user');
const zombie_mongo = require('../mongo_modules/zombie_mongo');
const equipment = require('../mongo_modules/equipment');
const forum = require('../mongo_modules/forum');

const res_loader = require('../../services/res_loader');
const zombie_content = require('../../../public/js/zombie_content');

module.exports = {
	loadIndexPage: async (req, res, next) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.title = 'Home';
			res.render('pages/index', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadContactPage: async (req, res, next) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.title = 'Contact';
			res.render('pages/contact', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadStatsPage: async (req, res, next) => {
		try {
			let obj = await res_loader.data(req.ip.toString());
			obj.title = 'Stats';
			res.render('pages/stats', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadLoginPage: async (req, res) => {
		try {
			if(!req.user) {
				let obj = await res_loader.data(req.ip);
				obj.title = 'Login';
				res.render('pages/login', obj)
			} else {
				res.redirect('profile')
			}
		}
		catch (err) {
			console.log(err);
		} 
	},
	loadRegisterPage: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.title = 'Register';
			res.render('pages/register', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadForumPage: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.title = 'Forum';
			res.render('pages/forum', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadSingleForum: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.singleForum = await forum.loadSingleForum(req.params.id);
			// console.log(obj);
			obj.title = 'Forum';
			res.render('pages/forum', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadSingleSubForum: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.singleSubForum = await forum.loadSingleSubForum(req.params.id);
			console.log('THIS IS MY ID', req.params.id);
			obj.parentForum = await forum.getParentForum(req.params.id);
			// console.log(obj);
			obj.title = 'SubForum';
			res.render('pages/forum', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadThread: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			obj.singleThread = await forum.loadSingleThread(req.params.id);
			obj.parentSubForum = await forum.getParentSubForum(obj.singleThread[0]._id);
			obj.parentForum = await forum.getParentForum(obj.parentSubForum[0]._id);
			obj.title = obj.singleThread.title;
			res.render('pages/thread', obj);
		}
		catch (err) {
			console.log(err);
		}
	} ,
	loadProfilePage: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			//for later, check if you can't just use req.user and save yourself the extra call
			obj.user = await user.getSingle(req.session.passport.user);
			obj.title = 'Profile';
			console.log('profile page response', obj.user);
			res.render('pages/profile', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	process_movies: async (req, res) => {
		// console.log(req.body);
		let response = await zombie_mongo.processMovies(req.body);
		res.send('success');
	},
	loadZombiePage: async (req, res) => {
		try {
			let obj = await res_loader.data(req.ip);
			//for later, check if you can't just use req.user and save yourself the extra call
			if(typeof req.session.passport != 'undefined') {
				obj.user = await user.getSingle(req.session.passport.user);
			}
			//iterate through zombie JSON file & set page title accordingly
			// console.log(obj.zombie);
			for(let i = 0; i < obj.zombie.length; i++)  {
				for(let j = 0; j < obj.zombie[i].items.length; j++) {
					if(obj.zombie[i].items[j].name.toLowerCase() == req.query.page.toLowerCase().replace(/_/g, ' ')) {
						obj.title = obj.zombie[i].items[j].name;
					}
				}
			}
			obj.zombie_content = await zombie_content.zombie_data(req.query.page);
			console.log(req.query.page);
			if(req.query.page == 'zombie_movies') {
				obj.movies = await zombie_mongo.getMovies();
			}
			if(req.query.page.toLowerCase().replace(/_/g, ' ') == 'equipment') {
				obj.equipment = await equipment.getAll();
			}
			res.render('pages/zombiemania', obj);
		}
		catch (err) {
			console.log(err);
		}
	},
	loadAdminPage: async (req, res) => {
		try {
			let obj = await res_loader.admin_data();
			obj.title = 'Admin';
			res.render('pages/admin', obj);
		}
		catch (err) {
			console.log(err);
		}
	}
}