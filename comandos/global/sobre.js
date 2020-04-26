const fk = require('../../plugins/index');

class sobre extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'sobre',
            alternativas: ['about', 'abt'],
            plugin_grupo: 'global',
            descricao_comando: 'Um pouco sobre mim :smile:.',
            dm : true
        })
        this.client = franklin;
    }

    async runComando(message, args)
    {
        message.reply({
            embed:{
                author:{
                    icon_url: this.client.user.avatarURL == null ? this.client.user.defaultAvatarURL : this.client.user.avatarURL,
                    name: this.client.user.tag
                },
                title: `Informações sobre mim`,
                color: 0x1cc6ed,
                description: `Como você é bem curioso de como fui desenvolvido, então ai está algumas informações sobre mim`,
                fields:[
                    {
                        name:`<:lib:588921157252677645> Biblioteca`,
                        value: `**[Discord.js#11.5-dev](https://discord.js.org/#/docs/main/11.5-dev/class/Guild)**`,
                        inline: true
                    },
                    {
                        name:`<:global_plugin:565767846907609088> Linguagem`,
                        value: `**[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)**`,
                        inline: true
                    },
                    {
                        name: `<:alt:566811648782761993> Categorias`,
                        value: `\`Interação, Gestão, Desenvolvimento\`.`,
                        inline: true
                   
                    },
                    {
                        name:`<:codes:566845038957428736> Meu invite`,
                        value: `**[Me adicione](https://discordapp.com/oauth2/authorize?client_id=500473582980300801&scope=bot&permissions=8)**`,
                        inline: true
                    }
                ],
                footer:{
                    icon_url: message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                    text: `Requisitado por: ${message.author.tag}`
                },
                timestamp: new Date()
            }
        }).then( mesg =>{
            mesg.react('◀')
            .then( r => mesg.react('▶'));



            const tras_e = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
            const frente_e = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
            const tras = mesg.createReactionCollector(tras_e, {time: 1000*3600});
            const frente = mesg.createReactionCollector(frente_e, {time: 1000*3600});

            frente.on('collect', e =>{
                e.remove(message.author.id).catch(O_o =>{});
                mesg.edit({
                    embed:{
                        author:{
                            icon_url: this.client.user.avatarURL == null ? this.client.user.defaultAvatarURL : this.client.user.avatarURL,
                            name: this.client.user.tag
                        },
                        title: `Como foi a minha jornada?`,
                        description:` Tudo começou naquele belo dia ensolarado, mas com aquele frio da manhã, meu pai(${this.client.users.get(this.client.donos)}) tomando seu cafezinho, nesta época ` +
                        `ele estudava **TI** (\`Tecnologia da Informação\`) ele sempre teve sua paixão pela área da tecnologia, desde aos seus 10 anos de idade ele sempre procurou `+
                        `saber sempre mais sobre como é desenvolvido debaixo dos panos aqueles sistemas que são de boa prática, ele sempre sonhou em um projeto próprio e sempre focar nele`+
                        ` isso tudo começou quando ele jogava **Habbo Hotel**, ficou fascinado pelo como era desenvolvido que desde então ele teve um junto com uma amiga e nunca desistiu acabando de crescer mais 2k usuários simultaneos.
                        
    Então após ter suas primeiras experiências na área, com seus amigos ( e graças a ele), ele descobriu o discord, ele via vários bots que atendia várias funções, `+
    `como a loritta por exemplo, desde então se inspirou nesses bots prometendo trazer um bot bem organizado tanto na sua estrutura quanto no seu visual, meu pai sempre preza pelos seus membros`
    +` e sempre se preocupou propor a melhor experiência com seus membros.
    
        E então, essa foi a historia de como nasci, interessante né? qualquer idéia pode mandas suas sugestões no nosso servidor clicando **[aqui](https://discord.gg/vwN3dJv)** e te amamos :heart:
                        `,
                        color: 0x1cc6ed,
                        thumbnail:{
                            url: this.client.user.avatarURL == null ? this.client.user.defaultAvatarURL : this.client.user.avatarURL,
                            width: 2048
                        },
                        footer:{
                            icon_url: message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                            text: `Requisitado por: ${message.author.tag}`
                        },
                        timestamp: new Date()
                    }
                })

            });

            tras.on('collect', e =>{
                e.remove(message.author.id).catch(O_o =>{});
                mesg.edit({
                    embed:{
                        author:{
                            icon_url: this.client.user.avatarURL == null ? this.client.user.defaultAvatarURL : this.client.user.avatarURL,
                            name: this.client.user.tag
                        },
                        title: `Informações sobre mim`,
                        color: 0x1cc6ed,
                        description: `Como você é bem curioso de como fui desenvolvido, então ai está algumas informações sobre mim`,
                        fields:[
                            {
                                name:`<:global_plugin:565767846907609088> Linguagem`,
                                value: `**[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)**`,
                                inline: true
                            },
                            {
                                name: `<:alt:566811648782761993> Categorias`,
                                value: `\`Interação, Gestão, Desenvolvimento\`.`,
                                inline: true
                           
                            },
                            {
                                name:`<:codes:566845038957428736> Meu invite`,
                                value: `**[Me adicione](https://discordapp.com/oauth2/authorize?client_id=500473582980300801&scope=bot&permissions=8)**`,
                                inline: true
                            }
                        ],
                        footer:{
                            icon_url: message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                            text: `Requisitado por: ${message.author.tag}`
                        },
                        timestamp: new Date()
                    }
                })

            })
        
    
        })

        message.channel.stopTyping(true)
    }
}

module.exports = sobre;