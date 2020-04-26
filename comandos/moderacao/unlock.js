const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class unlock extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'unlock',
            plugin_grupo: 'moderacao',
            alternativas: ['ulck', 'unlockchannel'],
            label: ['[canal]'],
            descricao_comando: 'Desbloquear o canal especificado ou aonde executou o comando.',
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   
        let permissao = require('../../plugins/hasPermissions');
        let argumento = args[0];
        if(argumento == '' || typeof argumento == 'undefined')
        {
            argumento = message.channel.id;
        }
       let canal =  argumento.replace(/[^0-9]/g,'');
       let canal_tratado = message.member.guild.channels.find(cd => cd.id === canal);
        if(typeof canal_tratado == 'undefined' || canal_tratado == '' || !canal_tratado)
        {
            message.reply(`<:no:557599389292429315> **|** O canal não foi encontrado neste servidor.`)
            message.channel.stopTyping(true);
            return;
        }
        const fs = require('fs')
        fs.readFile('./Colletores/cache/cacheLock.json', (err, res)=>{
            let json = JSON.parse(res);
            let guild = json.find(g => g.id_guild === message.guild.id);
            if(typeof guild == 'undefined') return;
            if(json.length == 1 && guild.channels.length == 1)
            {
                json = '[]';
            }else
            {
                let channel = guild.channels.find( ch => ch.id_channel === canal_tratado)
                let posicao_channels = guild.channels.indexOf(channel);
                guild.channels.splice(posicao_channels, 1)
            }
            if(guild.channels.length == 0)
            {
                let posicao_guild=  json.indexOf(guild);
                json.splice(posicao_guild, 1);
            }
            if(guild.channels.length == 0 && json.length == 1)
            {
                json = []
            }
        
        fs.writeFile('./Colletores/cache/cacheLock.json', json == "[]" ? json : JSON.stringify(json), (err, res) =>{
            if(err) return console.log(err);
        })
        })
        canal_tratado.overwritePermissions(message.guild.roles.find(role => role.id === message.guild.id), {
            SEND_MESSAGES: true
        }).then( s => {
            message.reply(`<:lock:572383068183330817> **|** O canal de texto ${canal_tratado} foi desbloqueado com sucesso.`);
            message.channel.stopTyping(true);
        });

        
    }
}

module.exports = unlock;