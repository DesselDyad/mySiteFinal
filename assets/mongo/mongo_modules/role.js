var Role = require('../../models/role');

/**
 * @module Role
 */
module.exports = {
    /**
     * gets all roles
     * @param {object} req - the request object
     * @param {object} res - the response object
     */
    getAll: () => {
		return new Promise((resolve, reject) => {
			Role.find((err, roles ) => {
				if(err) reject(err);
				resolve(roles);
			})
		})
    }
}