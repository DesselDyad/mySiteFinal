const contact = require('../../mongo/modules/contact');

module.exports = (app) => {
    // Contact routes
    app.post('/contact/submitForm', contact.submitForm);
    
}