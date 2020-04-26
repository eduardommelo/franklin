const fk = require('../../plugins/index');
const mongoose = require('mongoose')
const Discord = require('../../discordAPI')
class testes extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'starboard',
            plugin_grupo: 'diversao',
            descricao_comando: 'Favorite as mensagens para não esquecer mais delas.',
            alternativas: ['favoritar', 'star'],
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS'],
            label: ['<#canal>', '<count>']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   
        const channelStarboard = args[0]
        if(!channelStarboard) return message.franklinUndefined('**define um argumento válido.**')
        if(channelStarboard === 'off'){
            this.db.collection('guilds').findOne({
                id_guild: message.guild.id
            }, async (err, res)=>{
                if(err) return console.log(err)
                if(res){
                    if(res.starboard.enabled){
                        this.db.collection('guilds').updateOne({
                            id_guild: message.guild.id
                        },{
                            $set:{
                                starboard:{
                                    enabled: false,
                                    channel: '',
                                    messages:[],
                                    count: 0,
                                    channelsIgnore: []
                                }
                            }
                        }, (err, res)=>{
                            if(err) return console.log(err)
                            message.franklinSuccess('**Foi desativado com sucesso o `starboard`.**')
                        })
                    }else return message.franklinUndefined('**A função `starboard`, já se encontra desativado.**')
                }
            })
            return
        }
        const counts = args[1]
        if(!channelStarboard || !counts) return message.franklinUndefined('**Informe os argumentos obrigatórios `<#channel/ID> <counts>`.**')
        if(isNaN(counts)) return message.franklinUndefined('**Informe o argumento `<count>` do tipo inteiro.**')
        if(parseInt(counts) <= 1) return message.franklinUndefined('**Informe o número de votos em estrelas acima de 1.**')
        const channelID = typeof channelStarboard.replace(/[^0-9]/g,'') === 'undefined' ? false : channelStarboard.replace(/[^0-9]/g,'')
        if(!channelID) return message.franklinUndefined('**Defina o argumento `#canal` válido')
        const channel = message.guild.channels.find(ch => ch.id === channelID)
        if(!channel) return message.franklinUndefined('**O canal não se encontra neste servidor.**')
        const embed = new Discord.RichEmbed()
        this.db.collection('guilds').findOne({
            id_guild: message.guild.id
        }, async (err, res)=>{
            if(err) return console.log(err)
            if(res){
                if(!res.starboard.enabled || res.starboard.enabled){
                    embed.setTitle(':star: Adicionar/Atualizar starboard.')
                    embed.addField(':star2: Estrelas', counts, true)
                    embed.setColor('#e0cf31')
                    embed.addField(':star2: Canal do Starboard', channel, true)
                    const starboads = await message.channel.send(
                    ':star2: '+message.author+' **Digite os canais que o bot ignore para adicionar no `starboard`,'+
                    ' caso contrário digite `cancel` ou `cancelar` .**',embed)
                    await starboads.react(':yes:557599188419084289')
                    const starCollect =starboads.createReactionCollector((reaction, user) => reaction.emoji.id === '557599188419084289' && user.id === message.author.id,{
                        time: 1000 * 120
                    })
                    const messageStar = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
                        time: 1000 * 120
                    })

                    starCollect.on('collect', c =>{
                        this.db.collection('guilds').updateOne({
                            id_guild: message.guild.id
                        },{
                            $set:{
                                starboard:{
                                    enabled: true,
                                    channel: channel.id,
                                    messages:[],
                                    count: parseInt(counts),
                                    channelsIgnore: []
                                }
                            }
                        }, (err, res)=>{
                            if(err) return console.log(err)
                            message.franklinSuccess('**Foi ativado com sucesso o `starboard`.**')
                            messageStar.stop()
                        })
                    })           
                    messageStar.on('collect', ms=>{
                        const channelsArray = ms.content.split(' ')
                        if(ms.content.toLowerCase().startsWith('cancel') || ms.content.toLowerCase().startsWith('cancelar')){
                            starCollect.stop()
                            messageStar.stop()
                            message.franklinSuccess('**O comando foi cancelado com sucesso.**')
                            return
                        }
                        let arrayPush = []
                        let listChannels = []
                        channelsArray.forEach( ch =>{
                            const idCH = typeof ch.replace(/[^0-9]/g,'') === 'undefined' ? false : ch.replace(/[^0-9]/g,'')
                            if(idCH){
                            if(idCH !== channel.id ){
                                if(!arrayPush.includes(idCH) || !arrayPush.includes(channel.id)){
                                    if(message.guild.channels.find(chs => chs.id === idCH)){
                                        arrayPush.push(idCH)
                                        listChannels.push('<#'+idCH+'>')
                                    }
                                }
                        }
                        }
                        })
                        if(arrayPush.length === 0) {
                            starCollect.stop()
                            messageStar.stop()
                            return message.franklinUndefined('**Nenhum canal foi adicionado , ou todos se encontra inválido.**')
                        } 
                        if(arrayPush.length > 0){
                            this.db.collection('guilds').updateOne({
                                id_guild: message.guild.id
                            },{
                                $set:{
                                    starboard:{
                                        enabled: true,
                                        channel: channel.id,
                                        messages:[],
                                        count: parseInt(counts),
                                        channelsIgnore: arrayPush
                                    }
                                }
                            }, (err, res)=>{
                                if(err) return console.log(err)
                                message.delete()
                                message.franklinSuccess('**Foi ativado com sucesso o `starboard`.**'+'\n'+
                                '<:err:565568697536872509> **| Ignorando canais:** '+listChannels.join(', '))
                                messageStar.stop()
                            })
                        }

                    })         

                }else{

                }
            }
        })
       
    }
}

module.exports = testes;