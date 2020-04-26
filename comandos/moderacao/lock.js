const fk = require('../../plugins/index');
const mongoose = require('mongoose')
const fs = require('fs');
class lock extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'lock',
            plugin_grupo: 'moderacao',
            alternativas: ['lck', 'lockchannel'],
            label: ['[canal]', '[time/s/m/h]'],
            descricao_comando: 'Bloquear o canal especificado ou aonde executou o comando.',
            hasPermission: ['MANAGE_MESSAGES'],
            mePermission: ['MANAGE_MESSAGES']
        })
        this.client = franklin;
        this.db = mongoose.connection;
        this.fs = fs;
    }

    async runComando(message, args)
    {   
        let permissao = require('../../plugins/hasPermissions');
        let argumento = args[0];
        let tempo_argumento = args[1];
        let segundos = 0;
        if(argumento == '' || typeof argumento == 'undefined' || typeof tempo_argumento == 'undefined')
        {
            argumento = message.channel.id;
            let canal = message.member.guild.channels.find(cd => cd.id === argumento);
            canal.overwritePermissions(message.guild.roles.find(role => role.id === message.guild.id), {
                SEND_MESSAGES: false
            }).then( s => {
                message.reply(`<:lock:572383068183330817> **|** O canal de texto ${canal} foi bloqueado com sucesso.`);
                message.channel.stopTyping(true);
            }).catch(O_o =>{});
            return;
      
        }
        if(typeof tempo_argumento !== 'undefined' || tempo_argumento != '' ||  typeof tempo_argumento != 'undefined')
        {
            let type_s = typeof tempo_argumento == 'undefined'? 0 : tempo_argumento.replace(/[^a-z]/g,'');
            if(type_s.length > 1 || type_s == 0)
            {
                message.reply(`<:no:557599389292429315> **|** Informe argumento \`<time/s/m/h>\` valido.`);
                message.channel.stopTyping(true);
                return;
            }
            this.fs.readFile('./Colletores/cache/cacheLock.json', (err, res)=>{
                    let resultado = JSON.parse(res);
                    let canal = typeof argumento.replace(/[^0-9]/g,'') == 'undefined' ? message.channel.id : argumento.replace(/[^0-9]/g,'');
                    let guilds = resultado.find(g => g.id_guild === message.guild.id);
                    const tempo_comando = (new Date()).getTime();
                    let tempos =  typeof tempo_argumento.replace(/[^a-z]/g,'') == 'undefined' ? '': tempo_argumento.replace(/[^a-z]/g,'');
                    let number_tempo =  typeof tempo_argumento.replace(/[^0-9]/g,'') == 'undefined' ? '': tempo_argumento.replace(/[^0-9]/g,'');
                    if(tempos == '') {
                        tempos = 's';
                    }
                    if(tempos == 's' || tempos == 'm' || tempos == 'h'){
                        if(typeof guilds == 'undefined')
                        {
                            resultado.push({
                                id_guild: message.guild.id,
                                channels: [{
                                    id_channel : canal,
                                    tempos_comando: tempo_comando,
                                    time: `${number_tempo}${tempos}`
                                }]
                            });
                        }else
                        {
    
                            guilds.channels.push({
                                id_channel : canal,
                                tempos_comando: tempo_comando,
                                time: `${number_tempo}${tempos}`
                            });
                        }
                this.fs.writeFile('./Colletores/cache/cacheLock.json', JSON.stringify(resultado),(err, res)=>{
                        if(err) return console.log(err)
                });
                    }
            
            });
      
            // código do backup

            tempoLock(tempo_argumento)
        }else
        {
            tempo_argumento = 'não definido';
        }
        if(argumento == '' || typeof argumento == 'undefined')
        {
            argumento = message.channel.id;
        }
       let canal =  argumento.replace(/[^0-9]/g,'');
       let canal_tratado = message.member.guild.channels.find(cd => cd.id === canal);

        if(typeof canal_tratado == 'undefined' || canal_tratado == '' || !canal_tratado)
        {
            message.reply(`<:no:557599389292429315> **|** O canal não foi encontrado neste servidor.`)
            message.channel.stopTyping(true);
            return;
        }
        canal_tratado.overwritePermissions(message.guild.roles.find(role => role.id === message.guild.id), {
            SEND_MESSAGES: false
        }).then( s => {
            message.reply(`<:lock:572383068183330817> **|** O canal de texto ${canal_tratado} foi bloqueado com sucesso.`);
            message.channel.stopTyping(true);
        }).catch(O_o =>{});

        function tempoLock(tempo_argumento)
        {
            const fs = require('fs')
            if(tempo_argumento == '' || typeof tempo_argumento == 'undefined') return;
            let tipo = tempo_argumento.replace(/[^a-z]/g, '');
            let time = parseInt(tempo_argumento.replace(/[^0-9]/g, ''));
            if(isNaN(time)) return;
            if(tipo == 's' || tipo == '')
            {
                segundos = time

            }
            if(tipo == 'm')
            {
                segundos = 60*time;
            }
            if(tipo == 'h')
            {
                segundos = 3600*time;
            }
           let tempo =  setTimeout(()=>{
                fs.readFile('./Colletores/cache/cacheLock.json', (err, res)=>{
                    let json = JSON.parse(res);
                    let guild = json.find(g => g.id_guild === message.guild.id);
                    if(typeof guild == 'undefined') return clearTimeout(tempo);
                    if(json.length == 1 && guild.channels.length == 1)
                    {
                        json = '[]';
                    }else
                    {
                        let channel = guild.channels.find( ch => ch.id_channel === canal_tratado)
                        let posicao_channels = guild.channels.indexOf(channel);
                        guild.channels.splice(posicao_channels, 1)
                    }
                    if(guild.channels.length == 0)
                    {
                        let posicao_guild=  json.indexOf(guild);
                        json.splice(posicao_guild, 1);
                    }
                    if(guild.channels.length == 0 && json.length == 1)
                    {
                        json = []
                    }
                    message.channel.startTyping();
                    message.channel.send(`<:lock:572383068183330817> **|** O canal de texto ${canal_tratado} foi desbloqueado com sucesso.`);
                    message.channel.stopTyping(true);
                
                fs.writeFile('./Colletores/cache/cacheLock.json', json == "[]" ? json : JSON.stringify(json), (err, res) =>{
                    if(err) return console.log(err);
                })
                })
                canal_tratado.overwritePermissions(message.guild.roles.find(role => role.id === message.guild.id), {
                    SEND_MESSAGES: true
                }).then( s => {
                  
                }).catch(O_o =>{});
            },1000 * segundos);
        }
        
    }
}

module.exports = lock;