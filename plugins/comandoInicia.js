const mongoose = require('mongoose');
const consign = require('consign');
const comandoDAO = require('../Colletores/contadores/comandoDAO')
const {Collection} = require('../discordAPI')
class comandoInicia
{

    constructor(franklin, comandosRegistrados, configuracao)
    {
        this.client = franklin;
        this.count = 0;
        this.registrados = comandosRegistrados;
        this.db = mongoose.connection;
        this.config_guild = configuracao;
        this.comandoDAO = new comandoDAO();
        this.cooldown = new Collection()
        this.cooldownUpdate = new Collection()
    }
    async comandoMessage(message)
    {   
        let messages =typeof message[1] !== 'undefined'  ? message[1]: message[0];
        if(messages.author.bot) return
        let clearContent = messages.content
        if(messages.channel.type !== 'dm')
        {
            let config_bot = this.config_guild.configs.get(messages.guild.id);
            if(typeof config_bot !== 'undefined'){if(config_bot.message_everyone == true){clearContent = messages.content.replace(/@(everyone|here)/g, '@\u200b$1');}}
        }
       if(messages.channel.type !== 'dm' && messages.content.indexOf(this.client.prefixo) !== 0) return;
        let args = clearContent.slice(messages.channel.type !== 'dm' ? this.client.prefixo.length : 0).trim().split(/ +/g);
        if(messages.channel.type === 'dm' && clearContent.startsWith(this.client.prefixo)){
            if(messages.content.indexOf(this.client.prefixo) !== 0) return;
            args =clearContent.slice(this.client.prefixo.length).trim().split(/ +/g);
        }
        let command = (args.shift().toLowerCase() || messages.guild.members.get(args[0]));
        if(message[0] && typeof message[1] === 'undefined')
        {
             this.comandoRota(messages,args, this.client,command, false)
             return
        }
        if(typeof message[1] !== 'undefined'){
         this.comandoRota(messages,args, this.client, command, true)
         return  
        }
    }

    comandoRota(message, args,  client, comando,edit)
    {
        try{
            for(const cmd of this.registrados.comandos.values())
            {
                if(comando === cmd.nome_comando || cmd.alternativas.includes(comando))
                {
                   
                    if(message.channel.type == 'dm' && cmd.dm == false) {
                        message.franklinError(`Você não pode executar este comando via mensagem privada(DM)`)
                        message.channel.stopTyping(true);
                        return;
                    } 
                    let config_bot = message.channel.type == 'dm' ? false :this.config_guild.configs.get(message.guild.id);
                    
                    if(this.client.connectedMongoDB !== 1  || typeof config_bot === 'undefined'){
                        message.channel.send(':warning:  **|** **Aguarde, ainda estou estabelecendo conexão com a `API / WebSocket do discord`, aguarde mais um pouco.** :heart:')
                        message.channel.stopTyping(true)
                        return
                    } 
                    const funcCommand = new Date()
                    let setCooldown = 0
                    if(!edit){
                        setCooldown = 4
                        const getCooldown = (setCooldown*1000)+(new Date()).getTime()
                        if(this.cooldown.get(message.author.id)){
                            const getCooldown = this.cooldown.get(message.author.id)
                            const verifyCooldown = new Date()
                            verifyCooldown.setTime(getCooldown)
                            const seconds = Math.round(Math.abs(((verifyCooldown-funcCommand.getTime())/1000)))
                            if(funcCommand.getTime() < verifyCooldown.getTime()){
                                return message.franklinError(`**Aguarde \`${parseInt(seconds) > 1 ? seconds + ' segundos' : seconds+' segundo'}\` para utilizar meus comandos.**`)
                            }
                            if(funcCommand.getTime() > verifyCooldown.getTime()){
                                this.cooldown.delete(message.author.id)
                            }
                        }else{
                            this.cooldown.set(message.author.id, getCooldown)
                        }
                    }else{
                        setCooldown = 30
                        const getCooldown = (setCooldown*1000)+(new Date()).getTime()
                        if(this.cooldownUpdate.get(message.author.id)){
                            const getCooldown = this.cooldownUpdate.get(message.author.id)
                            const verifyCooldown = new Date()
                            verifyCooldown.setTime(getCooldown)
                            if(funcCommand.getTime() < verifyCooldown.getTime()) return 
                            if(funcCommand.getTime() > verifyCooldown.getTime()){
                                this.cooldownUpdate.delete(message.author.id)
                            }
                        }else{
                            this.cooldownUpdate.set(message.author.id, getCooldown)
                        }
                    }

                    if(message.channel.type !== 'dm' && !message.guild.me.hasPermission(cmd.mePermission))
                    {
                        message.franklinError(`**Eu não possuo  ${cmd.mePermission.length > 1 ? 'as permissões de `'+ 
                        cmd.mePermission.join(', ')+'`' : 'a permissão `'+cmd.mePermission.join(', ')+'`'}**`)
                        message.channel.stopTyping(true)
                        return 
                    }
                    if(message.channel.type !== 'dm' && !message.member.hasPermission(cmd.hasPermission)){
                        message.franklinError(`**Você não possui ${cmd.hasPermission.length > 1 ? 'as permissões de '+ 
                        cmd.hasPermission.join(', ') : 'a permissão `'+cmd.hasPermission.join(', ')+'`'}**`)
                        message.channel.stopTyping(true)
                        return
                    }     
                    this.comandoDAO.comandoCount = 1;
                    if(message.channel.type !== 'dm')
                    {
                    if(config_bot.message_delete === true){message.delete();}}
                    message.channel.startTyping();
                    if(cmd.isOwner == true && message.author.id !== this.client.donos)
                    {
                        message.reply(`<:err:565568697536872509> **|** Comando: \`${this.client.prefixo}${cmd.nome_comando}\` disponível somente para desenvolvedores.`)
                        message.channel.stopTyping(true)
                        return;
                    }
                    // sistema de verificar plugins
                    if(cmd.plugin_grupo == 'moderacao')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_mod == true)
                            {  
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Gestão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }
                    if(cmd.plugin_grupo == 'diversao')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_diversao == true)
                            {
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Diversão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }
                    if(cmd.plugin_grupo == 'musica')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_musica == true)
                            {
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Gestão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }
                    if(cmd.plugin_grupo == 'automatico')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_automatico == true)
                            {
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Gestão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }
                    if(cmd.plugin_grupo == 'utilizadores')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_util == true)
                            {
                                
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Gestão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }
                    if(cmd.plugin_grupo == 'developer')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_developer == true)
                            {
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Gestão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }


                    if(cmd.plugin_grupo == 'chatlogs')
                    {
                        this.db.collection('guilds').findOne({
                            id_guild: message.guild.id
                        }, (err, res) =>{
                            if(res.p_logs == true)
                            {
                                cmd.runComando(message, args);
                                message.channel.stopTyping(true);
                                return;
                            }else{
                                this.messageDesabilitado(message, cmd.nome_comando, 'Gestão')
                                message.channel.stopTyping(true);
                                return;
                            }
                        })
                    }
                    if(cmd.plugin_grupo == 'global')
                    {
                        cmd.runComando(message, args);
                        return;
                    }
                    return;
                }
                
            }
            
    }catch (err)
    {
        console.log(err)
        message.reply(`<:err:565568697536872509> **|**  Opss!! não consegui processar o comando, houve algum erro no meu sistema, estarei relatando para os desenvolvedores. `)
        if(this.client.guilds.get('500481408884801547'))
        {
            let canal = this.client.channels.get('522426111699714103');
            canal.send({
                embed: {
                    title: `Repor Error`,
                    color: 0xB22222,
                    description: `
**Guild:** ${message.channel.type === 'dm' ? 'Via DM' :message.guild.name} (ID: ${message.channel.type === 'dm' ? 'Via DM' :message.guild.id})
**Comando:** ${comando}`,
                fields:[
                    {
                        name: `<:erro:525293470110449674> Erro:`,
                        value: `\`\`\`diff
+ ${err.name} : 
- ${err.message}
\`\`\``

                    }
                ],
                timestamp: new Date()
                }
            })
        }
        message.channel.stopTyping(true)
    }

    }

    messageDesabilitado(message, comando_nome, plugin_grupo)
    {
        message.channel.stopTyping(true);
        if (message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author}, <:disable:566629911096459295> **|**  Para executar o comando \`${comando_nome}\` ative o plugin **${plugin_grupo}**`);
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.stopTyping(true);
      
       
    }
}
module.exports = comandoInicia;