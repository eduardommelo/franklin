const fk = require('../../plugins/index');
const {RichEmbed} = require('../../discordAPI')
class botinfo extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'botinfo',
            alternativas: ['binfo', 'binformacao'],
            plugin_grupo: 'global',
            descricao_comando: 'Informações sobre o bot.',
            dm : true
        })
        this.client = franklin;
    }

    async runComando(message, args)
    {
        let countComando = require('../../config/colletor.json')
        let total = (this.client.uptime / 1000);
        let dias = Math.floor(total / 86400);
        let horas = Math.floor(total / 3600) > 24 ? 0 : Math.floor(total / 3600);
        total %= 3600;
        let minutos = Math.floor(total / 60);
        let segundos = total % 60; 
        let data_conta = this.client.user.createdAt.toString();
        let date_get = data_conta.split(" ");;
        let horas_data = date_get[4].split(":");
        let mes_data = date_get[1];
        let mes_final = '';
        if (mes_data == 'Jan') { mes_final = 'janeiro' }
        if (mes_data == 'Feb') { mes_final = 'fevereiro' }
        if (mes_data == 'Mar') { mes_final = 'março' }
        if (mes_data == 'Apr') { mes_final = 'abril' }
        if (mes_data == 'May') { mes_final = 'maio' }
        if (mes_data == 'Jun') { mes_final = 'junho' }
        if (mes_data == 'Jul') { mes_final = 'julho' }
        if (mes_data == 'Aug') { mes_final = 'agosto' }
        if (mes_data == 'Sep') { mes_final = 'setembro' }
        if (mes_data == 'Oct') { mes_final = 'outubro' }
        if (mes_data == 'Nov') { mes_final = 'novembro' }
        if (mes_data == 'Dec') { mes_final = 'dezembro' }
        let data_conta_mmebro = date_get[2] + ' de ' + mes_final + ' de ' + date_get[3] + ' ás ' + `${horas_data[0]} horas e ${horas_data[1]} minutos`;
        const embed = new RichEmbed()
        embed.setTitle('Informações do bot')
        embed.setColor('#66c35f')
        embed.setDescription('Oi, meu nome é Franklin e sou eu que serei o condutor da sua jornada para o monte Olympo. <:felizao:505073579193401354> '+ '\n' +
        '**Aproveita e [me adicione ao seu servidor!](https://discordapp.com/oauth2/authorize?client_id=500473582980300801&scope=bot&permissions=8)**')
        embed.addField('<:prefix:566494162338316290> Prefixo', this.client.prefixo, true)
        embed.addField('Criação da aplicação', `${data_conta_mmebro}`, true)
        embed.addField('<:servers:566487224204525568> Servidores', `\`\`\`css
#${this.client.guilds.size}
\`\`\``, true)
        embed.addField('<:tag:510573602148712448> Canais',`\`\`\`css
#${this.client.channels.size}
\`\`\``, true)
        embed.addField('<:members:566489277979033600> Membros',`\`\`\`css
#${this.client.users.size}
\`\`\``, true)
        embed.setAuthor(message.author.tag, message.author.avatarURL === null ? message.author.defaultAvatarURL : message.author.avatarURL)
        embed.addField('<:codes:566845038957428736> Comandos Executados', `${countComando.comando_count}`, true)
        embed.addField('<:cooldown:565333738700013598> Uptime',`**${dias} dia(s), ${horas} horas, ${minutos} minuto(s) e ${segundos.toFixed(0.1)} segundo(s)**`, true)
        embed.setTimestamp((new Date()))
        message.channel.send(embed)
        message.channel.stopTyping(true)
    }
}

module.exports = botinfo;