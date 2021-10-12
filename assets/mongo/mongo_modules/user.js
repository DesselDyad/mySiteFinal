var User = require('../../models/user');
const security = require('../../services/security');

module.exports = {
	registerUser: (req, fileName = 'no-image.png') => {
		return new Promise(async (resolve, reject) => {
			var dateTime = require('node-datetime');
			var dt = dateTime.create();
			var formatted = dt.format('Y-m-d H:M:S');

			var name = req.body.name;
			var email = req.body.email;
			var adress = req.body.adress;
			var phone = req.body.phone;
			var username = req.body.username;
			var password = req.body.password;
			var password2 = req.body.password2;
			var profile_img = fileName;
			var role = req.body.role;
			var signature = req.body.signature;
			var created = formatted.toString();
			var theme = 0;
			var profile_searchable = true;

			// Validation
			req.checkBody('name', 'Name is required').notEmpty();
			req.checkBody('phone', 'Phone number can not contain letters').isNumeric();
			req.checkBody('email', 'Email is required').notEmpty();
			req.checkBody('email', 'Email is not valid').isEmail();
			req.checkBody('email2', 'Emails do not match').equals(req.body.email);
			req.checkBody('adress', 'Adress is required').notEmpty();
			req.checkBody('phone', 'Phone number is required').notEmpty();
			req.checkBody('username', 'Username is required').notEmpty();
			req.checkBody('password', 'Password is required').notEmpty();
			req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

			var errors = req.validationErrors();

			if (errors) {
				resolve({ errors: errors });
			}
			else {
				//checking for email and username are already taken
				await User.findOne({
					'local.contact_info.username': {
						"$regex": "^" + username + "\\b", "$options": "i"
					}
				}, async (err, user) => {
					if (err) reject(err);
					await User.findOne({
						'local.contact_info.email': {
							"$regex": "^" + email + "\\b", "$options": "i"
						}
					}, async (err, mail) => {
						if (err) reject(err);
						await User.findOne({
							'local.contact_info.phone': {
								"$regex": "^" + phone + "\\b", "$options": "i"
							}
						}, async (err, phone_number) => {
							if (err) reject(err);
							if (user || mail || phone_number) {
								resolve({
									user_err: user,
									mail: mail,
									phone_number: phone_number
								});
							}
							else {
								var newUser = new User({
									local: {
										account: {
											username: username,
											password: password,
										}, contact_info: {
											name: name,
											email: email,
											adress: adress,
											phone: phone
										},
										preferences: {
											theme: theme,
											profile_searchable: profile_searchable
										},
										profile_img: profile_img,
										role: role,
										created: created,
										signature: signature
									}
								});
								newUser.local.account.password = await security.createPassword(newUser.local.account.password);
								newUser.save(newUser, function (err, user) {
									if (err) reject(err);
								});
								resolve({
									'success_msg': 'success_msg',
									'message': 'You are registered and can now login'
								});
							}
						}
						)
					});
				});
			}
		})
	},
	updateUser: (req, fileName = null) => {
		return new Promise(async (resolve, reject) => {

			var name = req.body.name;
			var email = req.body.email;
			var adress = req.body.adress;
			var phone = req.body.phone;
			var username = req.body.username;
			var role = req.body.role;
			var signature = req.body.signature;
			var profile_img;
			if (fileName != null || fileName != undefined) {
				profile_img = fileName;
			}
			else {
				profile_img = req.body.oldImage;
			}
			// Validation
			req.checkBody('name', 'Name is required').notEmpty();
			req.checkBody('phone', 'Phone number can not contain letters').isNumeric();
			req.checkBody('email', 'Email is required').notEmpty();
			req.checkBody('email', 'Email is not valid').isEmail();
			req.checkBody('email2', 'Emails do not match').equals(req.body.email);
			req.checkBody('adress', 'Adress is required').notEmpty();
			req.checkBody('phone', 'Phone number is required').notEmpty();
			req.checkBody('username', 'Username is required').notEmpty();
			var errors = req.validationErrors();

			if (errors) {
				resolve({ errors: errors });
			}
			else {
				await User.findOne({
					'local.account.username': {
						"$regex": "^" + username + "\\b", "$options": "i"
					}
				}, async (err, user) => {
					if (err) reject(err);
					await User.findOne({
						'local.contact_info.email': {
							"$regex": "^" + email + "\\b", "$options": "i"
						}
					}, async (err, mail) => {
						if (err) reject(err);
						await User.findOne({
							'local.contact_info.phone': {
								"$regex": "^" + phone + "\\b", "$options": "i"
							}
						}, async (err, phone_number) => {
							if (err) reject(err);
							//at this point all is still good - no comparison is being made to any other user
							//however, now it is up to figure out whether to compare it to the user being edited, or to the user that is logged in
							// (if it is via the profile-settings, it is the user logged in - if it is via admin panel it is the user being edited - which in turn can be the user logged in)
							if (req.params.id) {
								//admin panel, compare to this user
								await User.findOne({ _id: req.params.id }, (err, myself) => {
									if (err) reject(err);
									let obj = {};
									if (user && user.local.account.username != myself.local.account.username) {
										obj.user_err = user;
									}
									if (mail && mail.local.contact_info.email != myself.local.contact_info.email) {
										obj.mail = mail;
									}
									if (phone_number && phone_number.local.contact_info.phone != myself.local.contact_info.phone) {
										obj.phone_number = phone_number;
									}
									if (obj.user_err || obj.mail || obj.phone_number) {
										resolve(obj);
									}
									else {
										User.update({ _id: req.params.id }, 
											{
												'local.account.username': username,
												'local.contact_info.name': name,
												'local.contact_info.email': email,
												'local.contact_info.adress': adress,
												'local.contact_info.phone': phone,
												'local.profile_img': profile_img,
												'local.role': role,
												'local.signature': signature
											}, function (err, user) {
											if (err) reject(err);
										});
										resolve({
											'success_msg': 'success_msg'
										});
									}
								})
							}
							else {
								//user profile, no id was sent using params
								await User.findOne({ _id: req.session.passport.user }, (err, myself) => {
									if (err) reject(err);
									let obj = {};
									if (user && user.username != myself.username) {
										obj.user_err = user;
									}
									if (mail && mail.email != myself.email) {
										obj.mail = mail;
									}
									if (phone_number && phone_number.phone != myself.phone) {
										obj.phone_number = phone_number;
									}
									if (obj.user_err || obj.mail || obj.phone_number) {
										resolve(obj);
									}
									else {
										User.update({ _id: req.session.passport.user }, 
											{
												'local.account.username': username,
												'local.contact_info.name': name,
												'local.contact_info.email': email,
												'local.contact_info.adress': adress,
												'local.contact_info.phone': phone,
												'local.profile_img': profile_img,
												'local.role': role,
												'local.signature': signature
											}, function (err, user) {
											if (err) reject(err);
										});
										resolve({
											'success_msg': 'success_msg'
										});
									}
								})
							}
						})
					})
				})
			}
		})
	},
	getSingle: (id) => {
		return new Promise((resolve, reject) => {
			User.findById({ _id: id }, (err, user) => {
				if (err) reject(err);
				else {
					resolve(user);
				}
			})
		})
	},
	getAll: () => {
		return new Promise((resolve, reject) => {
			User.find((err, users) => {
				if (err) reject(err);
				resolve(users);
			})
		})
	},
	deleteUser: (id) => {
		return new Promise((resolve, reject) => {
			User.findByIdAndRemove({ _id: id }, (err, response) => {
				if (err) reject(err);
				else {
					resolve(response)
				}
			})
		})
	},
	updateUserTheme: (id, theme) => {
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate({ _id: id }, { 'local.preferences.theme': theme }, err => {
				if (err) reject(err);
				resolve({
					'success_msg': 'success_msg',
					'message': 'User theme updated successfully!'
				})
			})
		})
	},
	makeProfilePublic: (id) => {
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate({ _id: id }, { 'local.preferences.profile_searchable': true }, err => {
				if (err) reject(err);
				resolve({
					'success_msg': 'success_msg',
					'message': 'User profile is now searchable!'
				})
			})
		})
	},
	makeProfilePrivate: (id) => {
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate({ _id: id }, { 'local.preferences.profile_searchable': false }, err => {
				if (err) reject(err);
				resolve({
					'success_msg': 'success_msg',
					'message': 'User profile is now private!'
				})
			})
		})
	},
	check_old_password: (id, password) => {
		return new Promise((resolve, reject) => {
			User.findOne({ _id: id }, (err, user) => {
				security.comparePassword('local.account.password', user.password, (err, isMatch) => {
					if (err) reject(err);
					if (isMatch) {
						resolve('valid');
					} else {
						resolve('invalid');
					}
				})
			})
		})
	},
	change_password: (id, password) => {
		return new Promise(async (resolve, reject) => {
			let newPassword = await security.hashPassword(password);
			User.findByIdAndUpdate({ _id: id }, { 'local.account.password': newPassword }, (err, result) => {
				if (err) reject(err);
				resolve({ "ID": id, "password": newPassword });
			})
		})
	},
	unlinkGoogle: (user) => {
		return new Promise((resolve, reject) => {
			user.google = null;
			user.save(err => {
				if(err)reject(err);
				resolve("success")
			})
		})
	},
	unlinkFacebook: (user) => {
		return new Promise((resolve, reject) => {
			user.facebook = null;
			user.save(err => {
				if(err)reject(err);
				resolve("success")
			})
		})
	},
	unlinkGithub: (user) => {
		return new Promise((resolve, reject) => {
			user.github = null;
			user.save(err => {
				if(err)reject(err);
				resolve("success")
			})
		})
	}
}