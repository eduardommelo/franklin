const mongoose = require('mongoose');
module.exports = function(franklin)
{
    

    franklin.on('guildCreate', guild =>{
        const db = mongoose.connection;
        db.collection('guilds').findOne({
            id_guild : guild.id
        }, (err, res) =>{
            if(err) return console.log(err);
            if(res != null) return console.log('\033[32m[GUILD_CREATE] : \033[m'+ guild.name + ' ID : ' +guild.id + ' já cadastrado')
            if(res == null)
            {
                db.collection('guilds').insertOne({
                    id_guild : guild.id,
                    p_mod : false,
                    p_diversao : false,
                    p_musica : false,
                    p_developer: false,
                    p_automatico: false,
                    p_logs: false,
                    p_util: false,
                    starboard:{
                            enabled: false,
                            count: 0,
                            messages: [],
                            channel: '',
                            channelsIgnore: []
                            },
                    config:{
                        message_everyone: false,
                        message_delete: false,
                        message_mention: false
                    }
                }, (err, res)=>{
                    
                        db.collection('guilds').findOne({
                            id_guild: guild.id
                        }, (err, resp)=>{

                            const c = resp.config;
                            franklin.configuracao_guild.configs.set(guild.id, c);
                        })
                        console.log('\033[32m[Servidor] : \033[m'+guild.name+' ID : '+guild.id +' registrado no banco de dados com sucesso!')
                    
                })
            }
        });


    });
}