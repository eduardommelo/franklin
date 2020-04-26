const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class unban extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'unban',
            alternativas: ['ub', 'desbanir', 'unbanned'],
            plugin_grupo: 'moderacao',
            label: ['<id/@mention>'],
            descricao_comando: 'Desbanir o usuário especificado.',
            hasPermission: ['BAN_MEMBERS'],
            mePermission: ['BAN_MEMBERS']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   
        if(!args[0] || typeof args[0] == 'undefined')
        {
            message.reply(`<:no:557599389292429315> **|** Argumento \`<id_membro>\` obrigatório `);
            message.channel.stopTyping(true);
            return;
        }
        let membro_id =  args[0].replace(/[^0-9]/g,'');
        let motivo = args.slice(1).join(' ')
        const fs = require('fs')
        message.guild.unban(membro_id, motivo == '' ? 'Não especificado' : motivo).then(usuario =>
            {
                let data = new Date();
                message.reply(`<:yes:557599188419084289> **|** \`[${data.getDate()}:${data.getMonth()+1}:${data.getFullYear()}]\` Usuário \`${usuario.username}\` foi desbanido do servidor por [\`${motivo == '' ? 'Não especificado' : motivo}\`]`)
                message.channel.stopTyping(true);
            }).catch(() =>{
                message.reply(`<:no:557599389292429315> **|** O membro não foi encontrado ou não foi banido!`);
                message.channel.stopTyping(true);
            })
            fs.readFile('./Colletores/cache/cacheBan.json', (err, res)=>{
                let json = JSON.parse(res);
                let guild = json.find(g => g.id_guild === message.guild.id);
                if(typeof guild == 'undefined') return;
                if(json.length == 1 && guild.servidor.length == 1)
                {
                    json = '[]';
                }else
                {
                    let channel = guild.servidor.find( ch => ch.id_membro === membro_id)
                    let posicao_channels = guild.servidor.indexOf(channel);
                    guild.channels.splice(posicao_channels, 1)
                }
                if(guild.servidor.length == 0)
                {
                    let posicao_guild=  json.indexOf(guild);
                    json.splice(posicao_guild, 1);
                }
                if(guild.servidor.length == 0 && json.length == 1)
                {
                    json = []
                }
            fs.writeFile('./Colletores/cache/cacheBan.json', json == "[]" ? json : JSON.stringify(json), (err, res) =>{
                if(err) return console.log(err);
            })
            })
    }
}

module.exports = unban;