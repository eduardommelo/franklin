const fk = require('../../plugins/index');
const {RichEmbed} = require('../../discordAPI')
class ping extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'suporte',
            alternativas: ['sup'],
            plugin_grupo: 'global',
            descricao_comando: 'Enviar o convite do servidor de suporte do bot.',
            dm: true
        })
        this.client = franklin;
    }

    async runComando(message, args)
    {
        const embed = new RichEmbed()
        embed.setDescription(`**Olá, esta precisando de uma ajudinha? Alguma duvida ou sugestão? Junte-se a minha casa que iremos te ajudar, basta clicar __[aqui](https://discord.gg/vwN3dJv)__**`)
        embed.setColor('#4287f5')
        message.reply(embed)
        message.channel.stopTyping(true)    
        
    }
}

module.exports = ping;