const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class voicekick extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'voicekick',
            plugin_grupo: 'moderacao',
            alternativas: ['chutarcanal', 'vk', 'voicek'],
            label: ['<@mention/id>','[motivo]'],
            descricao_comando: 'Chutar membro da sala de voz.',
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {
        let voiceMembro = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let motivo = args.slice(1).join(' ')
        if(typeof args[0] == 'undefined' || voiceMembro == '')
        {
            message.reply(`<:no:557599389292429315> **|** Argumento \`<@mention>\` obrigatório`);
            message.channel.stopTyping(true)
            return;
        }
        if(!voiceMembro)
        {
            message.reply(`<:no:557599389292429315> **|** Membro não encontrado ou argumento informado inválido.`);
            message.channel.stopTyping(true)
            return;
        }
        if(typeof motivo == 'undefined' || motivo == '')
        {
            motivo = 'Nenhum motivo especificado'
        }
        if(message.author.id === voiceMembro.user.id)
        {
            message.reply(`<:no:557599389292429315> **|** Você não pode se chutar do canal de voz.`);
            message.channel.stopTyping(true)
            return;
        }
        //===========================
        let membro_args = voiceMembro.roles.map(roles => roles.position);
        let membro_message =message.member.roles.map(roles => roles.position);
        /** 
         * Filtrar a role com a maior posição
        */
        let maior_posicao_membro = Math.max.apply(null, membro_args)
        let maior_message = Math.max.apply(null, membro_message)
        if( voiceMembro.user.id == this.client.user.id || voiceMembro.user.id == message.guild.owner.id || maior_posicao_membro >= maior_message)
        {
            if(message.guild.owner.id === message.author.id)
            {   voicekick(voiceMembro, message)
                message.channel.stopTyping(true)
                return;
            }
            message.reply(`<:no:557599389292429315> **|**  Você não tem permissão para chutar este membro.`);
            message.channel.stopTyping(true)
            return;
            
        }

        voicekick(voiceMembro, message)
        function voicekick(voiceMembro, message)
        {
            if(!voiceMembro.voiceChannel)
            {
                message.reply(`<:no:557599389292429315> **|**  Este membro não foi encontrado em nenhuma sala de voz.`);
                message.channel.stopTyping(true)
                return;
            }

            voiceMembro.setVoiceChannel(null)
            .then(() => {
                const data = new Date();
                message.reply(`<:yes:557599188419084289> **|**   \`[${data.getDate()}:${data.getMonth()+1}:${data.getFullYear()}]\`  Membro **${voiceMembro}** foi chutado do canal de voz por: \`${motivo}\`.`);
                message.channel.stopTyping(true);
            })
            .catch(err => {
                console.log(err)
                const data = new Date();
                message.reply(`<:no:557599389292429315> **|** Não encontrei este membro para chutar do canal.`);
                message.channel.stopTyping(true)
            });
        }
            
    }

}

module.exports = voicekick