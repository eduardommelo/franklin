const fk = require('../../plugins/index');

class ban extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'ban',
            alternativas: ['b', 'banir', 'banned'],
            plugin_grupo: 'moderacao',
            label: ['<@mention>', '[motivo]'],
            descricao_comando: 'Banir um membro em específico.',
            hasPermission: ['BAN_MEMBERS'],
            mePermission: ['BAN_MEMBERS']
        })
    }

    async runComando(message, args)
    {   
        let ban_mention = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let motivo = args.slice(1).join(' ')
        if(typeof args[0] == 'undefined' || ban_mention == '')
        {
            message.reply(`<:no:557599389292429315> **|** Argumento \`<@mention>\` obrigatório`);
            message.channel.stopTyping(true)
            return;
        }
        if(!ban_mention)
        {
            message.reply(`<:no:557599389292429315> **|** Membro não encontrado ou argumento informado inválido.`);
            message.channel.stopTyping(true)
            return;
        }
        if(typeof motivo == 'undefined' || motivo == '')
        {
            motivo = 'Nenhum motivo especificado'
        }
        if(message.author.id === ban_mention.user.id)
        {
            message.reply(`<:no:557599389292429315> **|** Você não pode se expulsar.`);
            message.channel.stopTyping(true)
            return;
        }
        //===========================
        let membro_args = ban_mention.roles.map(roles => roles.position);
        let membro_message =message.member.roles.map(roles => roles.position);
        /** 
         * Filtrar a role com a maior posição
        */
        let maior_posicao_membro = Math.max.apply(null, membro_args)
        let maior_message = Math.max.apply(null, membro_message)
        if( ban_mention.user.id == this.client.user.id || ban_mention.user.id == message.guild.owner.id || maior_posicao_membro >= maior_message)
        {
            if(message.guild.owner.id === message.author.id)
            {   kick(ban_mention, message)
                message.channel.stopTyping(true)
                return;
            }
            if(!message.member.hasPermission('BAN_MEMBERS'))
            {
                message.reply(`<:no:557599389292429315> **|** Você não possui a permissão para executar este comando.`);
                message.channel.stopTyping(true)
                return;
            }
            message.reply(`<:no:557599389292429315> **|**  Você não tem permissão para banir este membro.`);
            message.channel.stopTyping(true)
            return;
            
        }
       kick(ban_mention, message);
        function kick(args, message)
        {
            message.channel.stopTyping(true)
            let data = new Date();
            ban_mention.ban(motivo).then(r=>{
                message.reply(`<:yes:557599188419084289> **|**   \`[${data.getDate()}:${data.getMonth()+1}:${data.getFullYear()}]\`  Membro **${ban_mention}** foi banido por: \`${motivo}\`.`)
            }).catch( o_o =>{})
        }
    }
}

module.exports = ban;