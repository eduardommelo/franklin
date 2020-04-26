const fk = require('../../plugins/index');
const fs = require('fs')
class tempban extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'tempban',
            alternativas: ['tb', 'tbanir', 'tbanned'],
            plugin_grupo: 'moderacao',
            label: ['<@mention>', '<tempo/s/m/h>', '[motivo]'],
            descricao_comando: 'Banir um usuário temporariamente.',
            hasPermission: ['BAN_MEMBERS'],
            mePermission: ['BAN_MEMBERS']
        })
        this.fs = fs;
    }

    async runComando(message, args)
    {   
        let ban_mention = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let argumento_tempo = args[1];
        let motivo = args.slice(2).join(' ')

        let type_s = typeof argumento_tempo != 'undefined'? argumento_tempo.replace(/[^a-z]/g,'') : '';
        if(type_s.length > 1)
        {
            message.reply(`<:no:557599389292429315> **|** Informe argumento \`<time/s/m/h>\` valido.`);
            message.channel.stopTyping(true);
            return;
        }
        if(ban_mention == '' || typeof args[0] == 'undefined')
        {
            
            message.reply(`<:no:557599389292429315> **|** Argumento \`<@mention>\` obrigatório.`);
            message.channel.stopTyping(true)
            return;
        }
        if(!ban_mention)
        {
            message.reply(`<:no:557599389292429315> **|** Membro não encontrado.`);
            message.channel.stopTyping(true)
            return;
        }
        if(typeof motivo == 'undefined' || motivo == '')
        {
            motivo = 'Nenhum motivo especificado'
        }
        if(message.author.id === ban_mention.user.id)
        {
            message.reply(`<:no:557599389292429315> **|** Você não pode se expulsar.`);
            message.channel.stopTyping(true)
            return;
        }
        //===========================
        let membro_args = ban_mention.roles.map(roles => roles.position);
        let membro_message =message.member.roles.map(roles => roles.position);
        /** 
         * Filtrar a role com a maior posição
        */
        let maior_posicao_membro = Math.max.apply(null, membro_args)
        let maior_message = Math.max.apply(null, membro_message)
        if( ban_mention.user.id == this.client.user.id || ban_mention.user.id == message.guild.owner.id || maior_posicao_membro >= maior_message)
        {
            if(message.guild.owner.id === message.author.id)
            {   
                let tempo_inteiro = typeof argumento_tempo.replace(/[^0-9]/g,'')== 'undefined' ? 0 : argumento_tempo.replace(/[^0-9]/g,'');
                if(tempo_inteiro == 0)
                {
                    message.reply(`<:no:557599389292429315> **|**  Você definiu um tempo inválido para aplicar a punição no membro.`);
                    message.channel.stopTyping(true);
                    return;
                }
                banCache(ban_mention, this.fs,argumento_tempo)
                ban(ban_mention, message);
                tempoBan(args[0], argumento_tempo);
                message.channel.stopTyping(true)
                return;
            }
            message.reply(`<:no:557599389292429315> **|**  Você não tem permissão para banir este membro.`);
            message.channel.stopTyping(true)
            return;
            
        }  
        let tempo_inteiro = typeof argumento_tempo.replace(/[^0-9]/g,'')== 'undefined' ? 0 : argumento_tempo.replace(/[^0-9]/g,'');
        if(tempo_inteiro == 0)
        {
            message,reply(`<:no:557599389292429315> **|**  Você definiu um tempo inválido para aplicar a punição no membro.`);
            message.channel.stopTyping(true);
            return;
        }
        banCache(ban_mention, this.fs, argumento_tempo)
       ban(ban_mention, message);
        tempoBan(args[0], argumento_tempo);
        function banCache(ban_mention, fs, tempo_argumento)
        {
            fs.readFile('./Colletores/cache/cacheBan.json', (err, res)=>{
                let resultado = JSON.parse(res);
            
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
                            servidor: [{
                                id_membro : `${ban_mention.user.id}`,
                                tempos_comando: tempo_comando,
                                time: `${number_tempo}${tempos}`
                            }]
                        });
                    }else
                    {
    
                        guilds.servidor.push({
                            id_membro : `${ban_mention.user.id}`,
                            tempos_comando: tempo_comando,
                            time: `${number_tempo}${tempos}`
                        });
                    }
                fs.writeFile('./Colletores/cache/cacheBan.json', JSON.stringify(resultado),(err, res)=>{
                    if(err) return console.log(err)
            });
                }
        
        });
        }
        function tempoBan(mentions, tempo_argumento)
        {
            let segundos = 0;
            if(tempo_argumento == '' || typeof tempo_argumento == 'undefined' || mentions == '') return;
            let usuario = mentions.replace(/[^0-9]/g, '');
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
              message.guild.unban(usuario, 'Tempo excedido do banimento do usuário').then(O_o => {}).catch(O_o => {});
              fs.readFile('./Colletores/cache/cacheBan.json', (err, res)=>{
                let json = JSON.parse(res);
                let guild = json.find(g => g.id_guild === message.guild.id);
                if(typeof guild == 'undefined') return clearTimeout(tempo);
                if(json.length == 1 && guild.servidor.length == 1)
                {
                    json = '[]';
                }else
                {
                    let channel = guild.servidor.find( ch => ch.id_membro === usuario)
                    let posicao_channels = guild.servidor.indexOf(channel);
                    guild.channels.splice(posicao_channels, 1)
                }
                if(guild.servidor.length == 0)
                {
                    let posicao_guild=  json.indexOf(guild);
                    json.splice(posicao_guild, 1);
                }
                if(guild.servidor.length == 0 && json.length == 1)
                {
                    json = []
                }
            
            fs.writeFile('./Colletores/cache/cacheBan.json', json == "[]" ? json : JSON.stringify(json), (err, res) =>{
                if(err) return console.log(err);
            })
            })
            },1000 * segundos);
        }
        function ban(args, message)
        {
            let data = new Date();
            ban_mention.ban(motivo).then(r=>{
                message.reply(`<:yes:557599188419084289> **|**   \`[${data.getDate()}:${data.getMonth()+1}:${data.getFullYear()}]\`  Membro **${ban_mention}** foi banido por: \`${motivo}\`.`);
                message.channel.stopTyping(true)
            }).catch(O_o => {})
        }
    }
}

module.exports = tempban;