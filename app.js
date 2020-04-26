
const client = require('./config/index');
const config = require('./config/auth.json');
const franklin = new client.FranklinClient({
    owner : '',
    invite: '',
    prefixo: config.prefix,
    token: config.token
});

