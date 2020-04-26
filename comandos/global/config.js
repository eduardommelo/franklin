const fk = require('../../plugins/index');
const mongoose = require('mongoose');

class config extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'config',
            alternativas: ['cfg', 'configuracao'],
            label: ['[number]'],
            plugin_grupo: 'global',
            descricao_comando: 'Painel de configurações do bot.'
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   
        let argumento = args[0];
        let config_list =  this.client.configuracao_guild.configs.get(message.guild.id);
        if(!message.member.hasPermission('ADMINISTRATOR'))
        {
            message.reply(`<:err:565568697536872509> **|** Você precisa ser \`ADMINISTRADOR\` para executar este comando`);
            message.channel.stopTyping(true);
            return;
        }
        
        if(!argumento || isNaN(argumento) || typeof argumento == 'undefined')
        {
            argumento = 'NaN';
        }
        if(argumento == 1)
        {
            if(!message.guild.me.hasPermission('MANAGE_MESSAGES'))
            {
                if(message.channel.type != 'dm')
                {
                    message.reply(`<:err:565568697536872509> **|** Estou sem permissão \`MANAGE_MESSAGES\` para ativar esta configuração no seu servidor.`);
                    message.channel.stopTyping(true);
                }else
                {
                    message.author.send(`<:err:565568697536872509> **|** Estou sem permissão \`MANAGE_MESSAGES\` para ativar esta configuração no seu servidor.`)
                }
                return;
            }
            message.channel.stopTyping(true);
            config_list.message_delete == false ? update(this.client,this.db,{'config.message_delete': true}, message.guild.id, '`deletar mensagem de comando executado` ativado com sucesso', 'msg'):update(this.client,this.db,{'config.message_delete': false}, message.guild.id, '`deletar mensagem de comando executado` desativado com sucesso', 'msg')
            return;
        }
        if(argumento == 2)
        {
            message.channel.stopTyping(true);
            config_list.message_everyone == false ? update(this.client,this.db,{'config.message_everyone': true}, message.guild.id, '`mencionar todos` ativado com sucesso', 'msg'):update(this.client,this.db,{'config.message_everyone': false}, message.guild.id, '`mencionar todos` desativado com sucesso', 'msg')
            return;
        }
        if(argumento == 3)
        {
            message.channel.stopTyping(true);
            config_list.message_mention == false ? update(this.client,this.db,{'config.message_mention': true}, message.guild.id, '`mencionar mensagem` ativado com sucesso', 'msg'):update(this.client,this.db,{'config.message_mention': false}, message.guild.id, '`mencionar mensagem` desativado com sucesso', 'msg')
            return;
        }
        let message_config = {
            embed:{
                title: `Painel de configuração para: ${message.guild.name}`,
                color: 0x00FA9A,
                description: `Você pode ativar digitando \`${this.client.prefixo}config [numero]\` ou clicando nas reações.
${config_list.message_delete == false ? '<:off:557429990032146435>': '<:on:557429957228232715>'} :one: **| Apagar as mensagens assim que executar o comando**
\`MANAGE_MESSAGES:${message.guild.me.hasPermission('MANAGE_MESSAGES') ? 'COM PERMISSÂO' : 'SEM PERMISSÂO'}\`
${config_list.message_everyone == false ? '<:off:557429990032146435>': '<:on:557429957228232715>'} :two: **| Mencionar todos os membros \`@everyone\`**\n
${config_list.message_mention == false ? '<:off:557429990032146435>': '<:on:557429957228232715>'} :three: **| Mencionar quem executou o comando do bot**\n`,
            }
        }



    const parseEmoji = numero => numero+'\u20E3';
     message.author.send(message_config).then(r =>{
         message.channel.stopTyping(true);
         if(message.channel.type != 'dm')
         {
            message.reply({
                embed:{
                    color: 0x5d72bb,
                    description:`<:dm:566773567161761794> **|** **Uma mensagem foi mandada no seu DM(Mensagem direta), confira! ou clique  [aqui]( https://discordapp.com/channels/@me/${r.channel.id}/${r.channel.lastMessageID})**`
                }
            });
            message.channel.stopTyping(true);
         }

        reacoes(this.client,this.db,r);
      }).catch(() =>{
            message.reply(message_config).then(r =>{
                reacoes(this.client,this.db,r);
            })
        })


        function reacoes(client,db,r)
        {
            let one = setInterval(async ()=>{
                r.react(parseEmoji('1'))
                clearInterval(one)
            }, 1000)
            let two = setInterval(async ()=>{
                r.react(parseEmoji('2'))
                clearInterval(two)
            }, 2000)
            let three = setInterval(async ()=>{
                r.react(parseEmoji('3'))
                clearInterval(three)
            }, 3000)
                const r_one = (reaction, user) => reaction.emoji.name === parseEmoji('1') && user.id === message.author.id;
                const r_two = (reaction, user) => reaction.emoji.name === parseEmoji('2') && user.id === message.author.id;
                const r_three = (reaction, user) => reaction.emoji.name === parseEmoji('3') && user.id === message.author.id;
                const message_delete = r.createReactionCollector(r_one);
                const message_everyone = r.createReactionCollector(r_two);
                const message_mention = r.createReactionCollector(r_three);
                message_delete.on('collect', m =>{
                    if(!message.guild.me.hasPermission('MANAGE_MESSAGES'))
                    {
                                r.edit(`<:err:565568697536872509> **|** Estou sem permissão \`MANAGE_MESSAGES\` para ativar esta configuração no seu servidor.`)
                                message.channel.stopTyping(true);
                                return;
                    }
                    let config_delete =  client.configuracao_guild.configs.get(message.guild.id);
                    config_delete.message_delete == false ? update(client,db,{'config.message_delete': true}, message.guild.id, '`deletar mensagem de comando executado` ativado com sucesso', 'edit', r):update(client,db,{'config.message_delete': false}, message.guild.id, '`deletar mensagem de comando executado` desativado com sucesso', 'edit', r)
                })
    

                message_everyone.on('collect', m =>{
                    let config_everyone =  client.configuracao_guild.configs.get(message.guild.id);
                    config_everyone.message_everyone == false ? update(client,db,{'config.message_everyone': true}, message.guild.id, '`mencionar todos` ativado com sucesso', 'edit', r):update(client,db,{'config.message_everyone': false}, message.guild.id, '`mencionar todos` desativado com sucesso', 'edit', r)
                })
       

                message_mention.on('collect', m =>{
                    let config_mention =  client.configuracao_guild.configs.get(message.guild.id);
                    config_mention.message_mention == false ? update(client,db,{'config.message_mention': true}, message.guild.id, '`mencionar mensagem` ativado com sucesso', 'edit', r):update(client,db,{'config.message_mention': false}, message.guild.id, '`mencionar mensagem` desativado com sucesso', 'edit', r)
                })
 

        }

        function update(client,db,object, guild, tipo, tipo_mensagem, r)
        {
                db.collection('guilds').updateOne({
                       id_guild: guild
                }, {$set:
                   object
                }, (err, res)=>{
                  
                    if(res)
                    {

                 
                        if(tipo_mensagem == 'edit')
                        {
                            r.edit(`<:yes:557599188419084289> **|** Configuração ${tipo}`)
                        }
                        if(tipo_mensagem == 'msg')
                        {
                            message.reply(`<:yes:557599188419084289> **|** Configuração ${tipo}`);
                            message.channel.stopTyping(true)
                        }
                       client.configuracao_guild.configs.delete(message.guild.id);

                    db.collection('guilds').findOne({
                        id_guild: guild
                    }, (err, resp) =>{
                        if(resp)
                        {
                     
                            client.configuracao_guild.configs.set(message.guild.id, resp.config)
                        }
                    })
                       
                    }
                })
        }
    }
}

module.exports = config;