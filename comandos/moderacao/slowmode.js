const fk = require('../../plugins/index');
const mongoose = require('mongoose')
const fs = require('fs')
class slowmode extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'slowmode',
            plugin_grupo: 'moderacao',
            alternativas: ['lesma', 'modolento', 'mlento'],
            label: ['<time>','[#canal]', '[0s/m/h]'],
            descricao_comando: 'Ativar modo lento no canal.',
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS']
        })
        this.client = franklin;
        this.db = mongoose.connection;
        this.fs = fs;
    }

    async runComando(message, args)
    {   
        let time_args = args[0];
        let canal_args = args[1];
        let tempo_args = args[2];
        let segundos = 0;
        if(time_args == '' || typeof time_args == 'undefined')
        {
            message.reply("<:no:557599389292429315> **|** Argumento <time> obrigatório.");
            message.channel.stopTyping(true);
            return;
        }
        if(canal_args == '' || typeof canal_args == 'undefined')
        {
            canal_args = message.channel.id;
        }
    
        let canal = canal_args.replace(/[^0-9]/g, '');
        let channel = this.client.channels.get(canal);
        if(!channel)
        {
            message.reply("<:no:557599389292429315> **|** Este canal não foi encontrado.");
            message.channel.stopTyping(true);
            return;
        }
        
        let tipo_slow = time_args.replace(/[^a-z]/g,'');
        let tempo = parseInt(time_args.replace(/[^0-9]/g,''));
        let tempo_slow = 0;
        if(tipo_slow == 's' || tipo_slow == '')
        {
            tempo_slow = tempo;
        }
        if(tipo_slow == 'm')
        {
            tempo_slow = 60*tempo;
        }
        if(tipo_slow == 'h')
        {
            tempo_slow = 3600*tempo;
        }
        if(tipo_slow.length > 1)
        {
            message.reply("<:no:557599389292429315> **|** Informe o argumento <time> válido.");
            message.channel.stopTyping(true);
            return;
        }
        if(tempo_slow > 21600)
        {
            message.reply("<:no:557599389292429315> **|** Informe até 6 horas, não mais que isso.");
            message.channel.stopTyping(true);
            return;
        }
            if(typeof tempo_args == 'undefined')
            {
                channel.setRateLimitPerUser(tempo_slow, 'slowmode aplicado pelo' + this.client.user.username).then(msg => {
                    message.channel.send(`<:slowmode:575096842094641163> **|** O canal ${channel} foi setado modo lento para \`${time_args}${tipo_slow == '' ? 's' : ''}\`. `)
                    message.channel.stopTyping(true);
                });
                return;
            }
        
        this.fs.readFile('./Colletores/cache/cacheSlow.json', (err, res)=>{
            let resultado = JSON.parse(res);
            let canal = typeof canal_args.replace(/[^0-9]/g,'') == 'undefined' ? message.channel.id : canal_args.replace(/[^0-9]/g,'');
            let guilds = resultado.find(g => g.id_guild === message.guild.id);
            const tempo_comando = (new Date()).getTime();
            let tempos =  typeof tempo_args.replace(/[^a-z]/g,'') == 'undefined' ? '': tempo_args.replace(/[^a-z]/g,'');
            let number_tempo =  typeof tempo_args.replace(/[^0-9]/g,'') == 'undefined' ? '': tempo_args.replace(/[^0-9]/g,'');
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
        this.fs.writeFile('./Colletores/cache/cacheSlow.json', JSON.stringify(resultado),(err, res)=>{
                if(err) return console.log(err)
      
        });
            }
    
    });
        channel.setRateLimitPerUser(tempo_slow, 'slowmode aplicado pelo' + this.client.user.username).then(msg => {
            message.channel.send(`<:slowmode:575096842094641163> **|** O canal ${channel} foi setado modo lento para \`${time_args}${tipo_slow == '' ? 's' : ''}\`. `)
            message.channel.stopTyping(true);
        });

        tempoSlowmode(tempo_args);
        function tempoSlowmode(tempo_argumento)
        {
            
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
            let tempo = setTimeout(()=>{
                fs.readFile('./Colletores/cache/cacheSlow.json', (err, res)=>{
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
                    channel.startTyping();
                    channel.send(`<:slowmode:575096842094641163> **|** O canal ${channel} foi desativado modo lento. `)
                    channel.stopTyping(true);
                
                fs.writeFile('./Colletores/cache/cacheSlow.json', json == "[]" ? json : JSON.stringify(json), (err, res) =>{
                    if(err) return console.log(err);
                })
                })
            channel.setRateLimitPerUser(0,'Tempo excedido do slowmode').then( msg =>{
          
            })
            },1000 * segundos);
        }
    }
}

module.exports = slowmode;