const user = require('../mongo/mongo_modules/user');
const role = require('../mongo/mongo_modules/role');
const global = require('../mongo/mongo_modules/global');
const newsletter = require('../mongo/mongo_modules/newsletter');
const crumbs = require('../JSON/json_modules/crumbs');
const zombie = require('../JSON/json_modules/zombie');
const forum = require('../mongo/mongo_modules/forum');
const css_loader = require('./css_loader');
const js_loader = require('./js_loader');

module.exports = {
    data : ip => {
        return new Promise(async (resolve, reject) => {
            try {
                let obj = {};
                //page ressources
                obj.global = await global.update(ip);
                obj.sheets = await css_loader.read_css_sheets();
                obj.scripts = await js_loader.read_scripts();
                obj.crumbs = await crumbs.getAll();
                obj.zombie = await zombie.getAll();
                obj.forums = await forum.getAll();
                //admin resources
                obj.users = await user.getAll();
                obj.subscribers = await newsletter.getAll();
                obj.roles = await role.getAll();
                console.log('sup')
                resolve(obj);
            }
            catch (e) {
                reject(e);
            }
        })
    },
    admin_data : () => {
        return new Promise(async (resolve, reject) => {
            try {
                let obj = {};
                //page ressources
                obj.sheets = await css_loader.read_css_sheets();
                obj.scripts = await js_loader.read_scripts();
                obj.crumbs = await crumbs.getAll();
                obj.zombie = await zombie.getAll();
                //admin resources
                obj.users = await user.getAll();
                obj.subscribers = await newsletter.getAll();
                obj.roles = await role.getAll();
                resolve(obj);
            }
            catch (e) {
                reject(e);
            }
        })
    }
}