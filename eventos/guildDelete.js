const mongoose = require('mongoose')
module.exports = function(franklin){

    franklin.on('guildDelete', guild =>{
        const db = mongoose.connection;
        db.collection('guilds').deleteOne({
            id_guild: guild.id
        }, (err, res) =>{
            if(err) throw new console.log(err)
            if(res)
            {

                franklin.configuracao_guild.configs.delete(guild.id)
                console.log('\033[31m[GUILD_DELETE]\033[m O ' + franklin.user.username + ' saiu do servidor ' + guild.name + ' ID: ' + guild.id)
            }
        })

    })
}