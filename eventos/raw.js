const fs = require('fs');
const mongoose = require('mongoose')
const Discord = require('../discordAPI')
module.exports = function(franklin){
    franklin.on('raw', async raw =>{
        if(raw.t !== "MESSAGE_REACTION_ADD" && raw.t !== "MESSAGE_REACTION_REMOVE") return
        if(raw.t === 'MESSAGE_REACTION_ADD')
        {
            const db = mongoose.connection;
            if(raw.d.emoji.name === '⭐'){
                db.collection('guilds').findOne({
                    id_guild: raw.d.guild_id
                }, async (err, res)=>{
                    if(err) return console.log(err)
                    if(res){
                        if(res.starboard.enabled){
                            if(res.starboard.channelsIgnore.length > 0){
                                if(res.starboard.channelsIgnore.includes(raw.d.channel_id)) return;
                            }
                            if(raw.d.channel_id === res.channel) return;
                            let  messages =res.starboard.messages.find(elem => elem.id === raw.d.message_id)
                            if(typeof messages === 'undefined'){
                                db.collection('guilds').updateOne({
                                    id_guild: raw.d.guild_id
                                }, {
                                    $push:{
                                        'starboard.messages':{
                                            id: raw.d.message_id,
                                            stars: 1,
                                            author: [raw.d.user_id]
                                        }
                                    }
                                }, (err, resp)=>{
                                    if(err) return console.log(err)
                                    db.collection('guilds').findOne({
                                        id_guild: raw.d.guild_id
                                    }, (errs, ress)=>{
                                        if(errs) return console.log(errs)
                                        const indexNumber = ress.starboard.messages.findIndex(t => t.id === raw.d.message_id)
                                        db.collection('guilds').updateOne({
                                            id_guild: raw.d.guild_id
                                        }, {
                                            $inc:{['starboard.messages.'+indexNumber+'.stars']: 1}
                                        },(error , respost)=>{
                                            if(error) return console.log(error)
                                        })
                                        db.collection('guilds').updateOne({
                                            id_guild: raw.d.guild_id
                                        }, {
                                            $push:{['starboard.messages.'+indexNumber+'.author']: raw.d.user_id}
                                        },(error , respost)=>{
                                            if(error) return console.log(error)
                                        })
                                    })
                                })
                           
                            }
                            if(messages){
                                if(messages.author.includes(raw.d.user_id)) return
                                if(messages.stars >= res.starboard.count){
                                    const guild = franklin.guilds.get(raw.d.guild_id)
                                    const channel = guild.channels.find(cha => cha.id === raw.d.channel_id)
                                    const sendStar = guild.channels.find(c => c.id === res.starboard.channel)
                                    const embed = new Discord.RichEmbed()
                                    const messageFetch = await channel.fetchMessage(raw.d.message_id)
                                    const reactsTo = messageFetch.reactions.find(react => react.emoji.name === '⭐')
                                     if(reactsTo.count > res.starboard.count) return
                                    if(res.starboard.channelsIgnore.length > 0){
                                        if(res.starboard.channelsIgnore.includes(raw.d.channel_id)) return;
                                    }
                                    if(raw.d.channel_id === res.starboard.channel) return;
                                    if(messageFetch){
                                        embed.setColor('#f5d742')
                                        embed.setAuthor(messageFetch.author.tag, messageFetch.author.avatarURL === null ? messageFetch.author.defaultAvatarURL : messageFetch.author.avatarURL)
                                        if(messageFetch.content){
                                        embed.setDescription(messageFetch.content)
                                        }
                                        messageFetch.attachments.map(file =>{
                                            if(file.url.endsWith('.png') || file.url.endsWith('.jpg') || file.url.endsWith('.gif')){
                                                embed.setImage(file.url)
                                            }else{
                                                embed.attachFile(file.url)
                                            }
                                        })
                                        embed.setTimestamp((new Date()))
                                        embed.setFooter('starboard', 'https://cdn.discordapp.com/attachments/547964045534167050/622138995006242818/2b50.png')
                                        sendStar.send(embed)
                                        db.collection('guilds').updateOne({
                                            id_guild: raw.d.guild_id
                                        }, {
                                            $pull:{ 'starboard.messages':{'id': raw.d.message_id} }
                                        })
                                    
                                    return
                                    }
                                }
                                    const indexArray = res.starboard.messages.findIndex( men => men.id === raw.d.message_id)
                                        db.collection('guilds').updateOne({
                                            id_guild: raw.d.guild_id
                                        }, {
                                            $inc:{['starboard.messages.'+indexArray+'.stars']: 1}
                                        }, (err, res)=>{
                                            if(err) return console.log(err)
                                            
                                        })
                                        db.collection('guilds').updateOne({
                                            id_guild: raw.d.guild_id
                                        }, {
                                            $push:{['starboard.messages.'+indexArray+'.author']: raw.d.user_id}
                                        }, (err, res)=>{
                                            if(err) return console.log(err)
                                            
                                        })                                
                            }    
                            
                        }
                    }
                })
            }
        }
        });
}