const fk = require('../../plugins/index');

class kick extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'kick',
            alternativas: ['k', 'expulsar', 'chutar'],
            plugin_grupo: 'moderacao',
            label: ['<@mention>', '[motivo]'],
            descricao_comando: 'Expulsar um membro específico.',
            hasPermission: ['KICK_MEMBERS'],
            mePermission: ['KICK_MEMBERS']
        })

        this.client = franklin;
    }

    async runComando(message, args)
    {

        let kick_mention = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let motivo = args.slice(1).join(' ')
        if(!message.guild.me.hasPermission("KICK_MEMBERS"))
        {
            let permissao = require('../../plugins/hasPermissions');
            message.reply(`<:no:557599389292429315> **|** Não possuo permissão para executar este comando 
**⁘**\`KICK_MEMBERS:\` ${permissao.KICK_MEMBERS}`);
            message.channel.stopTyping(true);
            return;
        }
        if(kick_mention == '' || typeof args[0] == 'undefined')
        {
            
            message.reply(`<:no:557599389292429315> **|** Argumento \`<@mention>\` obrigatório.`);
            message.channel.stopTyping(true)
            return;
        }
        if(!kick_mention)
        {
            message.reply(`<:no:557599389292429315> **|** Membro não encontrado.`);
            message.channel.stopTyping(true)
            return;
        }
        if(typeof motivo == 'undefined' || motivo == '')
        {
            motivo = 'Nenhum motivo especificado'
        }
        if(message.author.id === kick_mention.user.id)
        {
            message.reply(`<:no:557599389292429315> **|** Você não pode se expulsar.`);
            message.channel.stopTyping(true)
            return;
        }
        //===========================
        let membro_args = kick_mention.roles.map(roles => roles.position);
        let membro_message =message.member.roles.map(roles => roles.position);
        /** 
         * Filtrar a role com a maior posição
        */
        let maior_posicao_membro = Math.max.apply(null, membro_args)
        let maior_message = Math.max.apply(null, membro_message)
        if( kick_mention.user.id == this.client.user.id || kick_mention.user.id == message.guild.owner.id || maior_posicao_membro >= maior_message)
        {
            if(message.guild.owner.id === message.author.id)
            {   kick(kick_mention, message)
                message.channel.stopTyping(true)
                return;
            }
            if(!message.member.hasPermission('KICK_MEMBERS'))
            {
                message.reply(`<:no:557599389292429315> **|** Você não possui a permissão para executar este comando.`);
                message.channel.stopTyping(true)
                return;
            }
            message.reply(`<:no:557599389292429315> **|**  Você não tem permissão para banir este membro.`);
            message.channel.stopTyping(true)
            return;
            
        }
            
     

       kick(kick_mention, message);
        function kick(args, message)
        {
            message.channel.stopTyping(true)
            let data = new Date();
            kick_mention.kick(motivo).then(r=>{
                message.reply(`<:yes:557599188419084289> **|**   \`[${data.getDate()}:${data.getMonth()+1}:${data.getFullYear()}]\`  Membro **${kick_mention}** foi expulso por: \`${motivo}\`.`);
                message.channel.stopTyping(true);
            }).catch(O_o =>{})
        }

    }
}

module.exports = kick;