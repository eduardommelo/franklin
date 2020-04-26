const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class unmute extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'unmute',
            plugin_grupo: 'moderacao',
            alternativas: ['unm', 'descalar', 'unmt', 'desmutar'],
            label: ['<@mention/id>','[motivo]'],
            descricao_comando: 'Desmutar o membro especifico.',
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   

        let membro =  message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let motivo = typeof args.slice(0).join(' ') == 'undefined' ? 'Não especificado':args.slice(2).join(' ');

        if( membro == ''|| typeof args[0] == 'undefined')
        {
            message.reply(`<:no:557599389292429315> **|** Argumento obrigatório \`<@mention>\`.`);
            message.channel.stopTyping(true);
            return;
        }
        if(!membro)
        {
            message.reply(`<:no:557599389292429315> **|** Membro não encontrado`);
            message.channel.stopTyping(true);
            return;
        }
        let membro_args = membro.roles.map(roles => roles.position);
        let membro_message =message.member.roles.map(roles => roles.position);
        /** 
         * Filtrar a role com a maior posição
        */
        let maior_posicao_membro = Math.max.apply(null, membro_args)
        let maior_message = Math.max.apply(null, membro_message)
        if(membro.user.id == this.client.user.id || membro.user.id == message.guild.owner.id || maior_posicao_membro >= maior_message)
        {

            if(message.author.id === membro.user.id)
            {
                message.reply(`<:no:557599389292429315> **|**  Você não pode se desmutar.`);
                message.channel.stopTyping(true)
                return;
            }
            if(message.guild.owner.id === message.author.id)
            {   
                verificaMute(this.client, this.db, message, membro, motivo)
                message.channel.stopTyping(true)
                return;
            }
            if(!message.member.hasPermission('MANAGE_CHANNELS'))
            {
                message.reply(`<:no:557599389292429315> **|** Você não possui a permissão para executar este comando.`);
                message.channel.stopTyping(true)
                return;
            }
            message.reply(`<:no:557599389292429315> **|**  Você não tem permissão para desmutar este membro.`);
            message.channel.stopTyping(true)
            return;
            
        }
        verificaMute(this.client, this.db, message, membro, motivo);
        async function verificaMute(client, db, message, membro, motivo)
        {
            if(client.muteColletor.role_mute.some(role => message.guild.roles.get(role)))
            {
                let roles = client.muteColletor.role_mute.get(message.guild.id);
               
                if(!message.guild.member(membro.user.id).roles.find(rls => rls.id === roles))
                {
                    message.reply(`<:no:557599389292429315> **|** O usuário já foi desmutado.`);
                    message.channel.stopTyping(true)
                    return;
                }
                membro.removeRole(roles).then(r =>{
                    message.reply(`<:yes:557599188419084289> **|**  Membro \`${membro.user.tag}\` desmutado por: \`${motivo =='' ? 'Não especificado': motivo}\` com sucesso!`);
                    message.channel.stopTyping(true)
                }).catch(() =>{
                    message.reply(`<:no:557599389292429315> **|**  A role já foi removida ou a role foi deletada do servidor..`);
                    message.channel.stopTyping(true)
                    return;
                });
                const fs = require('fs');
                fs.readFile('./Colletores/cache/cacheMute.json', (err, res) =>{
                    let json = JSON.parse(res);
                    const guilds = json.find(g => g.id_guild === message.guild.id)
                    if(typeof guilds == 'undefined') return;
                    const usuarios_mutado = guilds.usuarios_mutado.find(gs => gs.id === membro.user.id);
                    const users_posicao = guilds.usuarios_mutado.indexOf(usuarios_mutado)
                    guilds.usuarios_mutado.splice(users_posicao,1)
                    const posicao_guild = json.indexOf(guilds)
                    if(guilds.usuarios_mutado.length == 0)
                    {
                        json.splice(posicao_guild,1);
                    }
                    if(json.length == 1 && guilds.usuarios_mutado.length == 0)
                    {
                        json = "[]";
                    }
                    fs.writeFile('./Colletores/cache/cacheMute.json', JSON.stringify(json), (err, res)=>{
                        if(err) return console.log(err);
                    });

           

                })
            
            }else
            {
                message.reply(`<:no:557599389292429315> **|** A role não foi encontrada na nossa **Collection** caso tenha visto esta mensagem, entre em contato com o desenvolvedor.`);
                message.channel.stopTyping(true);
                return;  
            }
        }
        

        
    }
}

module.exports = unmute;