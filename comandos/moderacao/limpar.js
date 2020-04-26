const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class limpar extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'clear',
            plugin_grupo: 'moderacao',
            alternativas: ['limpar', 'lmp', 'limparmensagem'],
            label: ['<quantia>', '[canal]'],
            descricao_comando: 'Limpar mensagens.',
            hasPermission: ['MANAGE_MESSAGES'],
            mePermission: ['MANAGE_MESSAGES']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   
        let mensagens = args[0];
        let canal = args[1];
        if(isNaN(mensagens) || !mensagens || typeof mensagens == 'undefined' || mensagens == '')
        {
            message.reply('');
            message.channel.stopTyping(true);
            return;
        }
        if(mensagens > 100)
        {
            message.reply(`<:no:557599389292429315> **|** Permitido limpar apenas até **100** mensagens cada execução do comando.`)
            message.channel.stopTyping(true);
            return;
        }
        deletarMensagens(canal, mensagens, this.client);
        async function deletarMensagens (canal, mensagens, client)
        {
            if(canal == '' || typeof canal == 'undefined' || !canal)
            {
                canal = message.channel.id;
            }
            let channel_canal = canal.replace(/[^0-9]/g,'');
            let canal_delete = client.channels.get(channel_canal);
            if(mensagens == 1)
            {
                mensagens = 2;
            }
            const quantia = await canal_delete.fetchMessages({limit: mensagens});
            canal_delete.bulkDelete(quantia, true).then( msg =>{
                message.reply(`<:yes:557599188419084289> **|** foram limpos \`${msg.size}\` mensagens`).then( r=> r.delete(5000)).catch(O_o =>{});
                message.channel.stopTyping(true)
            })
        }
    }
}

module.exports = limpar;