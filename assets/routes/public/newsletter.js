const newsletter = require('../../mongo/modules/newsletter');

module.exports = (app) => {
    app.get('/newsletter/subscribe', newsletter.subscribe);
    app.get('/newsletter/unsubscribe/:email', newsletter.unsubscribe);
    app.post('/newsletter/requestUserValidation', newsletter.requestUserValidation);
}