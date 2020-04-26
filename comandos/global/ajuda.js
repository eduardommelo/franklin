const fk = require('../../plugins/index');

class ajuda extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'ajuda',
            alternativas: ['help', 'hl', 'helper', 'ajudas'],
            plugin_grupo: 'global',
            descricao_comando: 'O que eu posso fazer no servidor.',
            label: ['[comando]'],
            dm: true
        })

        this.client = franklin;
    }

    async runComando(message, args)
    {
        let comandoss = args[0];
        let labels = [];
        let alts = [];
        if(typeof comandoss != 'undefined')
        {
            for(let cs of this.client.headComando.comandos.values())
            {
               
                for(let ii = 0;ii<cs.alternativas.length;ii++)
                {   
                    if(comandoss == cs.alternativas[ii])
                    {
                        comandoss = cs.nome_comando
                   
                    }
                    if(comandoss == cs.nome_comando)
                    {
                        alts.push(cs.alternativas[ii])
                    }
                
                }
                if(comandoss == cs.nome_comando)
                {
                  
                    for(let c = 0;c<cs.label.length;c++)
                    {
                        labels.push(cs.label[c])
                    }
                    message.reply({
                        embed: {
                            author:{
                                color: 0x28d2e4,
                                name : message.author.tag,
                                icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                                url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                            },
                            color: 0x28d2e4,
                            title: `Comando: ${cs.nome_comando}`,
                            description:'`'+cs.descricao_comando+'`',
                            fields:[
                                {
                                    name: `<:developer:566612820100120586> ▏COMO USAR`,
                                    value: '`' +this.client.prefixo + cs.nome_comando +' ' +labels.join(' + ') + '`'
                                },
                                {
                                    name: `<:developer:566612820100120586> ▏ALTERNATIVAS`,
                                    value: '`'+ alts.join(', ') + '`'
                                },
                                {
                                    name:`<:developer:566612820100120586> ▏RESPONDE DM`,
                                    value: `${cs.dm == true ? '`Sim`' : '`Não`' }`
                                },
                                {
                                    name: `<:developer:566612820100120586> ▏OBSERVAÇÕES`,
                                    value: `Comando com argumentos que apresenta entre \`[]\` são considerados opcional e os com \`<>\` são os obrigatório.`
                                }
                            ],
                            footer:{
                                icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                                text: `Requisitado por: ${message.author.tag}`
                            },
                            timestamp: new Date()
                        }
                    })
                    message.channel.stopTyping(true)
                    return;
                }
            }
           
        }
      
     
        let pls = '';
        let emoji_array = [];
        let collect_array = [];
        let collecti_colletor = [];
        let pl_nome = [];
        let pl_id = [];
        for(let plugins of this.client.headComando.plugins.values())
        {
            pls += '⯀ ' + plugins.emoji+ ' `'+plugins.pluginID+'`: ' + plugins.descricao+' \n'
            emoji_array.push(plugins.emoji)
            pl_nome.push(plugins.nome)
            pl_id.push(plugins.pluginID)
        }
    
        message.author.send({
            embed:{
                author:{
                    name : message.author.tag,
                    icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                    url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                },
                color: 0x28d2e4,
                description: `Para utilizar cada um dos plugins é preciso que você ative-os através do comando **${this.client.prefixo}plugin** e assim você poderá estar utilizando os comandos de um plugin específico.

${pls}
                `,
                footer:{
                    icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                    text: `Requisitado por: ${message.author.tag}`
                },
                timestamp: new Date()
            }
        }).then(rm =>{
            if(message.channel.type != 'dm'){
                message.reply({
                    embed:{
                        color: 0x28d2e4,
                        description:`<:dm:566773567161761794> **| Uma mensagem foi mandada no seu DM (Mensagem direta). Confira!** \n **<:dm:566773567161761794> | Ou clique [ AQUI ]( https://discordapp.com/channels/@me/${rm.channel.id}/${rm.channel.lastMessageID})**`
                    }
                })
            } 
            message.channel.stopTyping(true)
            rm.react('⬅').then( incio_moji =>{
            
            let cmds = '';
            let c = -1
            let interval = setInterval(() => {
                c++
                if(c >= emoji_array.length) return clearInterval(interval)
                rm.react(emoji_array[c].replace(/[^0-9]/g,'').toString())
            }, 1000);
            for(let i = 0;i<emoji_array.length;i++)
            {
                collect_array[i] = (reaction, user) => reaction.emoji.id === emoji_array[i].replace(/[^0-9]/g,'').toString() && user.id === message.author.id;
                collecti_colletor[i] = rm.createReactionCollector(collect_array[i], {time: 1000* 3600});
                collecti_colletor[i].on('collect', r=>{
                cmds = '';
                   for(let cmd of this.client.headComando.comandos.values())
                   {
                       if(pl_nome[i] == cmd.plugin_grupo)
                       {
                        if(cmd.isOwner != true)
                        {
                            cmds += '⯀ `' + cmd.nome_comando + '` :' + cmd.descricao_comando + ' \n'
                        }
                       }
                   }
                   rm.edit({
                    embed:{
                        color: 0x28d2e4,
                        author:{
                            name : message.author.tag,
                            icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                            url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                        },
                        title: `Comando do plugin: ${pl_id[i]} `,
                        description: `${cmds}`,
                        footer:{
                            icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                            text: `Requisitado por: ${message.author.tag}`
                        },
                        timestamp: new Date()
                    }
                })
                })
            }
        })

        const rm_home = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
        const emojis_home = rm.createReactionCollector(rm_home);

        emojis_home.on('collect', o =>{
            rm.edit({
                embed:{
                    author:{
                        name : message.author.tag,
                        icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                        url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                    },
                    color: 0x28d2e4,
                    description: `Bom , la vai aqui a lista do que eu posso fazer no seu servidor até agora, para utilizar cada um dos plugins é preciso que você ative-os através do comando **${this.client.prefixo}plugin** e assim você poderá estar utilizando os comandos de um plugin específico.
    
    ${pls}
                    `,
                    footer:{
                        icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                        text: `Requisitado por: ${message.author.tag}`
                    },
                    timestamp: new Date()
                }
            })
        })
        }).catch(() =>{
            message.reply({
                embed:{
                    author:{
                        name : message.author.tag,
                        icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                        url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                    },
                    description: `Para utilizar cada um dos plugins é preciso que você ative-os através do comando **${this.client.prefixo}plugin**. Assim você poderá estar utilizando os comandos de um plugin específico.
    
    ${pls}
                    `,
                    footer:{
                        icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                        text: `Requisitado por: ${message.author.tag}`
                    },
                    timestamp: new Date()
                }
            }).then(rm =>{
                message.channel.stopTyping(true)
                rm.react('⬅').then( incio_moji =>{
                let cmds = '';
                for(let i = 0;i<emoji_array.length;i++)
                {
                    rm.react(emoji_array[i].replace(/[^0-9]/g,'').toString())
                    collect_array[i] = (reaction, user) => reaction.emoji.id === emoji_array[i].replace(/[^0-9]/g,'').toString() && user.id === message.author.id, {
                        time: 120000
                    };
                    collecti_colletor[i] = rm.createReactionCollector(collect_array[i]);
                    collecti_colletor[i].on('collect', r=>{
                    cmds = '';
                       for(let cmd of this.client.headComando.comandos.values())
                       {
                           if(pl_nome[i] == cmd.plugin_grupo)
                           {
                            cmds += '⯀ `' + cmd.nome_comando + '` :' + cmd.descricao_comando + ' \n'
                           }
                       }
                       rm.edit({
                        embed:{
                            color: 0x28d2e4,
                            author:{
                                name : message.author.tag,
                                icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                                url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                            },
                            title: `Comando do plugin: ${pl_id[i]}`,
                            description: `${cmds}`,
                            footer:{
                                icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                                text: `Requisitado por: ${message.author.tag}`
                            },
                            timestamp: new Date()
                        }
                    })
                    })
                }
            })
                let rm_home = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
                let emojis_home = rm.createReactionCollector(rm_home);
        
                emojis_home.on('collect', o =>{
                    rm.edit({
                        embed:{
                            author:{
                                color: 0x28d2e4,
                                name : message.author.tag,
                                icon_url : message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                                url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                            },
                            description: `Para utilizar cada um dos plugins é preciso que você ative-os através do comando **${this.client.prefixo}plugin**. Assim você poderá estar utilizando os comandos de um plugin específico.
            
            ${pls}
                            `,
                            footer:{
                                icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                                text: `Requisitado por: ${message.author.tag}`
                            },
                            timestamp: new Date()
                        }
                    })
                })
            })
        })   
    }
}

module.exports = ajuda;