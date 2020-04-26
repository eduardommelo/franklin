const discord = require('discord.js')
const token = require('./config/auth.json')
let shard = new discord.ShardingManager('./app.js', {
    respawn: true,
    token: token.token_beta
});
shard.spawn(2)
