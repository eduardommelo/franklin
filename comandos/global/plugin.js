const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class testes extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'plugin',
            plugin_grupo: 'global',
            alternativas: ['plugins', 'plgs', 'funcoes', 'modulos'],
            descricao_comando: 'Painel de controle dos meus plugins.'
        })

        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {

        let lt_plugins = args[0];
       if(!message.member.hasPermission('ADMINISTRATOR'))
        {
            message.reply(`<:err:565568697536872509> **|** Você precisa ser \`ADMINISTRADOR\` para executar este comando`);
            message.channel.stopTyping(true);
            return;
        }
        if(typeof lt_plugins != 'undefined')
        {
            if(lt_plugins == 'list')
            {
                message.channel.send({
                    embed: {
                    color: 0x5d72bb,
                    author: {
                        name : message.author.tag,
                        icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                        url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                    },
                    /**
                     * ⯀ \gestao_auto\: Ativar/Desativar plugin de gestão automática.
                     * ⯀ \dev\: Ativar/Desativar plugin Desenvolvedor. 
                     * ⯀ \logs\: Ativar/Desativar plugin de chatlogs.
                        ⯀ \`util\`: Ativar/Desativar plugin de utilizaveis.
                        ⯀ \`musica\`: Ativar/Desativar plugin de música.
                     */
                    description: `⯀ \`gestao\`: Ativar/Desativar plugin de gestão. 
⯀ \`diversao\`: Ativar/Desativar plugin de Diversão. `,
                    footer:{
                        icon_url:message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                        text: `Requisitado por: ${message.author.tag}`
                    }
                }
                
                })
                message.channel.stopTyping(true)
                return;
            }

                if(lt_plugins == 'gestao')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Gestão', null, message, 'msg')
                        message.channel.stopTyping(true)
                        return;
                    })
                    return;
                }
                if(lt_plugins == 'gestao_auto')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Gestão Automática', null, message, 'msg')
                        
                        return;
                    })
                    return;
                }
                if(lt_plugins == 'diversao')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Diversão', null, message, 'msg')
                        return;
                    })
                    return;
                }
                if(lt_plugins == 'dev')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Desenvolvedor', null, message, 'msg')
                        return;
                    })
                    return;
                }
                if(lt_plugins == 'logs')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Chatlog', null, message, 'msg')
                        return;
                    })
                    return;
                }
                if(lt_plugins == 'util')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Utilizaveis', null, message, 'msg')
                        return;
                    })
                    return;
                }
                if(lt_plugins == 'musica')
                {
                    this.db.collection('guilds').findOne({
                        id_guild: message.guild.id
                    }, (err, res)=>{            
                        ativarDesativar(this.db,message.guild.id, 'Música', null, message, 'msg')
                        return;
                    })
                    return;
                }
    

           
        }


        this.db.collection('guilds').findOne({
            id_guild: message.guild.id
        }, (err, res)=>{
            if(err) throw new console.log(err)
            if(res)
            {
                message.channel.send({
                    embed: {
                        color: 0x5d72bb,
                        author: {
                            name : message.author.tag,
                            icon_url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                            url: message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL
                        },
                        title: `Painel de Plugins : Servidor : ${message.guild.name}`,
                        description: `Você pode utilizar uma das duas formas para ativar os plugins digitando **${this.client.prefixo}plugin [nome_plugin]** assim será ativado os plugin também, para saber quais são os argumentos para ativar digita **${this.client.prefixo}plugin list**`,
                        fields:[
                            {
                                name: `${res.p_diversao == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:diversao:566844312265031680> Diversão`,
                                value: `Mantenha seu servidor agitado utilizando esta função interagindo com os membros.`
                            },
                           /* {
                                name: `${res.p_automatico == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:automatico:566844093955571715> Gestão automatica`,
                                value: `Está tendo dor de cabeça com o seu servidor e quer relaxar sua cabeça um pouco?! me configure de como devo reagir para cada tipo de situação.`
                            },*/
                            {
                                name: `${res.p_mod == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:gest:566716751212183571> Gestão`,
                                value: `Tenha um bom controle e organização no seu servidor`
                            },
                         /*   {
                                name: `${res.p_musica == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:disc:566844701647306753> Música`,
                                value: `Curta as melhores músicas junto com seus amigos com esta função.`
                            },*/
                          /*  {
                                name: `${res.p_developer == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:codes:566845038957428736> Desenvolvedor`,
                                value: `Nesta função irei te dar suporte em vários jeito, caso queira saber a cor hexadecimal por exemplo ou pesquisar documentações e muito mais!`
                            },*/
                           /* {
                                name: `${res.p_logs == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:logs:566845371926577173> Chatlog`,
                                value: `Você pode definir o que posso monitorar e registrar para você em uma sala secreta.`
                            },*/
                         /*   {
                                name: `${res.p_util == true ? '<:on:557429957228232715>' : '<:off:557429990032146435>'} <:utils:566845597328474132> Utilizaveis`,
                                value: `Aqui irei estar personalizando ou até mesmo configurando seu servidor de uma forma bem dinâmica e automatica.`
                            }*/
                        ],
                        footer:{
                            icon_url:message.author.avatarURL != null ? message.author.avatarURL : message.author.defaultAvatarURL,
                            text: `Requisitado por: ${message.author.tag}`
                        }
                    }
                }).then(rm =>{
                    let one = setInterval(async() =>{
                        rm.react('566844312265031680')
                        clearInterval(one)
                    }, 1000 * 1)
                   /* let two = setInterval(async() =>{
                        rm.react('566844093955571715')
                        clearInterval(two)
                    }, 1000 * 2)*/
                    let three = setInterval(async() =>{
                        rm.react('566716751212183571')
                        clearInterval(three)
                    }, 1000 * 2)
                   /* let four = setInterval(async() =>{
                        rm.react('566844701647306753')
                        clearInterval(four)
                    }, 1000 * 4)
                    let five = setInterval(async() =>{
                        rm.react('566845038957428736')
                        clearInterval(five)
                    }, 1000 * 5)
                    let sixx = setInterval(async() =>{
                        rm.react('566845371926577173')
                        clearInterval(sixx)
                    }, 1000 * 6)
                    let seven = setInterval(async() =>{
                        rm.react('566845597328474132')
                        clearInterval(seven)
                    }, 1000 * 7)*/
                  const p_diversao = (reaction, user) => reaction.emoji.id === '566844312265031680' && user.id === message.author.id;
                  const p_automatico = (reaction, user) => reaction.emoji.id === '566844093955571715' && user.id === message.author.id;
                  const p_gestao = (reaction, user) => reaction.emoji.id === '566716751212183571' && user.id === message.author.id;
                  const p_musica = (reaction, user) => reaction.emoji.id === '566844701647306753' && user.id === message.author.id;
                  const p_developer = (reaction, user) => reaction.emoji.id === '566845038957428736' && user.id === message.author.id;
                  const p_chatlog = (reaction, user) => reaction.emoji.id === '566845371926577173' && user.id === message.author.id;
                  const p_utilizaveis = (reaction, user) => reaction.emoji.id === '566845597328474132' && user.id === message.author.id;
                  const diversao = rm.createReactionCollector(p_diversao);
                  const automatica = rm.createReactionCollector(p_automatico);
                  const gestao = rm.createReactionCollector(p_gestao);
                  const musica = rm.createReactionCollector(p_musica);
                  const devloper = rm.createReactionCollector(p_developer);
                  const chatlog = rm.createReactionCollector(p_chatlog);
                  const utilizaveis = rm.createReactionCollector(p_utilizaveis);
                diversao.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Diversão', rm, message, 'edit')
                 })
                automatica.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Gestão Automática', rm, message, 'edit')
                })
                gestao.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Gestão', rm, message, 'edit')
                })
                musica.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Música', rm, message, 'edit')
                })
                devloper.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Desenvolvedor', rm, message, 'edit')
                })
                chatlog.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Chatlog', rm, message, 'edit')
                })
                utilizaveis.on('collect', msg =>{
                    ativarDesativar(this.db,message.guild.id, 'Utilizaveis', rm, message, 'edit')
                })
                })
            }
        })

        // ativar ou desativar o plugin
        function ativarDesativar(db,guild, tipo, rm, message, types)
        {
            db.collection('guilds').findOne({
                id_guild: guild
            }, (err, res)=>{
                if(err) throw new console.log(err)
                if(res)
                {
                    if(tipo == 'Diversão')
                    {
                        if(res.p_diversao == false)
                        {
                        updatePlugin(db, 'Diversão', guild, {$set: {p_diversao: true}},rm, message, 'ativado', types )
                        return;
                        }if( res.p_diversao == true)
                        {
                        updatePlugin(db, 'Diversão', guild, {$set: {p_diversao: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                    if(tipo == 'Gestão Automática')
                    {
                        if(res.p_automatico == false)
                        {
                        updatePlugin(db, 'Gestão Automática', guild, {$set: {p_automatico: true}},rm, message, 'ativado', types  )
                        return;
                        }if( res.p_automatico == true)
                        {
                        updatePlugin(db, 'Gestão Automática', guild, {$set: {p_automatico: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                    if(tipo == 'Gestão')
                    {
                        if(res.p_mod == false)
                        {
                        updatePlugin(db, 'Gestão', guild, {$set: {p_mod: true}},rm, message, 'ativado', types  )
                        return;
                        }if( res.p_mod == true)
                        {
                        updatePlugin(db, 'Gestão', guild, {$set: {p_mod: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                    if(tipo == 'Música')
                    {
                        if(res.p_musica == false)
                        {
                        updatePlugin(db, 'Música', guild, {$set: {p_musica: true}},rm, message, 'ativado', types  )
                        return;
                        }if( res.p_musica == true)
                        {
                        updatePlugin(db, 'Música', guild, {$set: {p_musica: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                    if(tipo == 'Desenvolvedor')
                    {
                        if(res.p_developer == false)
                        {
                        updatePlugin(db, 'Desenvolvedor', guild, {$set: {p_developer: true}},rm, message, 'ativado', types  )
                        return;
                        }if( res.p_developer == true)
                        {
                        updatePlugin(db, 'Desenvolvedor', guild, {$set: {p_developer: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                    if(tipo == 'Chatlog')
                    {
                        if(res.p_logs == false)
                        {
                        updatePlugin(db, 'Chatlog', guild, {$set: {p_logs: true}},rm, message, 'ativado', types  )
                        return;
                        }if( res.p_logs == true)
                        {
                        updatePlugin(db, 'Chatlog', guild, {$set: {p_logs: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                    if(tipo == 'Utilizaveis')
                    {
                        if(res.p_util == false)
                        {
                        updatePlugin(db, 'Utilizaveis', guild, {$set: {p_util: true}},rm, message, 'ativado', types  )
                        return;
                        }if( res.p_util == true)
                        {
                        updatePlugin(db, 'Utilizaveis', guild, {$set: {p_util: false}}, rm, message, 'desativado', types )
                        return;
                        }
                    }
                }
            })
        }

        function updatePlugin(db, tipo, guild, objeto, rm, message, palavra, types)
        {
            db.collection('guilds').updateOne({
                id_guild: guild
            }, objeto, (err, res)=>{
                if(types == 'edit')
                {
                    rm.edit(`${message.author}, <:yes:557599188419084289> **|** O plugin **${tipo}** foi \`${palavra}\` com sucesso!`)
                    return;
                }if(types == 'msg')
                {
                    message.reply(`<:yes:557599188419084289> **|** O plugin **${tipo}** foi \`${palavra}\` com sucesso!`)
                    message.channel.stopTyping(true)
                    return;
                }
                
            })
        }
        message.channel.stopTyping(true)
    }
}

module.exports = testes;