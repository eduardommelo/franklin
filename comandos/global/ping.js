const fk = require('../../plugins/index');

class ping extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'ping',
            alternativas: ['pl'],
            plugin_grupo: 'global',
            descricao_comando: 'Latência entre a api do discord com o bot.',
            dm: true
        })
        this.client = franklin;
    }

    async runComando(message, args)
    {
        
            const pingMessage = await message.reply(`<:loading:565336231840448512> **|** Aguarde...`);
            message.channel.stopTyping(true);
            return pingMessage.edit(`
            ${message.channel.type !== 'dm' ? `:ping_pong: ${message.author},` : ''}
:envelope_with_arrow:  **|** **Ping Mensagem:**   \`${pingMessage.createdTimestamp - message.createdTimestamp}\`ms.
${this.client.ping ? `:signal_strength:  **|** **Ping API:**  \`${Math.round(this.client.ping)}ms.\`` : ''}
        `);
        message.channel.stopTyping(true);
        
    }
}

module.exports = ping;