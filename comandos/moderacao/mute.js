const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class mute extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'mute',
            plugin_grupo: 'moderacao',
            alternativas: ['m', 'silenciar', 'mt'],
            label: ['<@mention/id>', '[0s/m/h/d]','[motivo]'],
            descricao_comando: 'Silenciar um membro especifico.',
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS','MANAGE_ROLES']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   

        let membro =  message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let tempo_motivo = args[1];
        let motivo = typeof args.slice(2).join(' ') == 'undefined' ? 'Não especificado':args.slice(2).join(' ');
        let type_s = typeof tempo_motivo != 'undefined'? tempo_motivo.replace(/[^a-z]/g,'') : '';

        const letras = typeof tempo_motivo.replace(/[^a-z]/g,'') == 'undefined' ? '' : tempo_motivo.replace(/[^a-z]/g,'');
        if(letras.length >= 1)
        {
            let verifica_two = letras.substring(1, letras.length);
            if(verifica_two.match(/[^0-9]/g))
            {
                let m  = args.slice(1).join(' ');
                let verifica = m.substring(1, m.length)
                if(m.length == 1 && !m.match(/[^0-9]/))
                {
                    motivo = m
                }
                if(verifica.length > 1)
                {
                    motivo = m;
                }
            }
         

        }
        /*if(type_s.length > 1)
        {
            message.reply(`<:no:557599389292429315> **|** Informe argumento \`<time/s/m/h>\` valido.`);
            message.channel.stopTyping(true);
            return;
        }*/
        if(typeof args[0] == 'undefined' || membro == '' )
        {
            message.reply(`<:no:557599389292429315> **|** Argumento obrigatório \`<@mention>\`.`);
            message.channel.stopTyping(true);
            return;
        }
        if(!membro)
        {
            message.reply(`<:no:557599389292429315> **|** Membro não encontrado.`);
            message.channel.stopTyping(true);
            return; 
        }
        
        if(this.client.muteColletor.muted.get(message.guild.id))
        {
            let membros_silenciado = this.client.muteColletor.muted.get(message.guild.id);

            for(let ct =0;ct<membros_silenciado.length;ct++)
            {
                if(membros_silenciado[ct].id === membro.user.id)
                {
                    message.reply(`<:no:557599389292429315> **|** Esse membro já procura-se mutado.`);
                    message.channel.stopTyping(true);
                    return;  
                }
            }
        }
    
        let membro_args = membro.roles.map(roles => roles.position);
        let membro_message =message.member.roles.map(roles => roles.position);
        /** 
         * Filtrar a role com a maior posição
        */
        let maior_posicao_membro = Math.max.apply(null, membro_args)
        let maior_message = Math.max.apply(null, membro_message)
        if( membro.user.id == this.client.user.id || membro.user.id == message.guild.owner.id || maior_posicao_membro >= maior_message)
        {

            if(message.author.id === membro.user.id)
            {
                message.reply(`<:no:557599389292429315> **|**  Você não pode se silenciar.`);
                message.channel.stopTyping(true)
                return;
            }
            if(message.guild.owner.id === message.author.id)
            {   
                verificaMute(this.client, this.db, message, membro, motivo, tempo_motivo)
                message.channel.stopTyping(true)
                return;
            }
            if(!message.member.hasPermission('MANAGE_CHANNELS'))
            {
                message.reply(`<:no:557599389292429315> **|** Você não possui a permissão para executar este comando.`);
                message.channel.stopTyping(true)
                return;
            }
         
            message.reply(`<:no:557599389292429315> **|**  Você não tem permissão para silenciar este membro.`);
            message.channel.stopTyping(true)
            return;
            
        }
        verificaMute(this.client, this.db, message, membro, motivo, tempo_motivo);
        async function verificaMute(client, db, message, membro, motivo, tempo_motivo)
        {
            let roles_guild = client.muteColletor.role_mute.get(message.guild.id);
            if(!client.muteColletor.role_mute.get(message.guild.id) || !message.guild.roles.find(r => r.id == roles_guild))
            {

                let bot_role = message.guild.me.roles.map(roles => roles.position);
                let posicao_bot = Math.max.apply(null, bot_role);
                let cargo = await message.guild.createRole({
                    name: '྾ | Silenciado',
                    color: "0x808080",
                    permissions:[]
                });
                cargo.setPosition(posicao_bot-2)
                message.guild.channels.forEach((channel) => {
                    channel.overwritePermissions(cargo.id, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                        CONNECT: false
                    })
                 });
                 membro.addRole(cargo.id);
                db.collection('guilds').updateOne({
                    id_guild: message.guild.id
                }, {
                    $set: {
                        "mute.roles":[cargo.id]
                    }
                },(err, res) =>{
                    if(res)
                    {
                        client.muteColletor.registrarRole(message.guild.id, cargo.id);
                        let mb = membro.user.id;
                        client.muteColletor.registrarMutado(message.guild.id, {
                            id: mb,
                            tempo: tempo_motivo == '' ? typeof tempo_motivo == 'undefined' ? 0: tempo_motivo : tempo_motivo                    
                        });
                        muteMembro(client,membro,cargo.id, tempo_motivo, motivo, message);
                    }
                });
                return;
            }
            if(client.muteColletor.role_mute.some(role => message.guild.roles.get(role)))
            {
                let roles = client.muteColletor.role_mute.get(message.guild.id)
                
                const tempoMotivo = typeof tempo_motivo != 'undefined'  ?tempo_motivo.replace(/[^a-z]/g,'') == '' ? 's': tempo_motivo.replace(/[^a-z]/g,'') : 's';
                const segundos = typeof tempo_motivo != 'undefined' ? tempo_motivo.replace(/[^0-9]/g,'') : 0;
                if(tempoMotivo != 's' || tempoMotivo != 'm' || tempoMotivo != 'h' || tempoMotivo.length >=2 || tempoMotivo == '' || typeof tempoMotivo == 'undefined' || tempoMotivo.length == 0)
                {
                    tempo_motivo =  `${segundos}${tempoMotivo}`
                }
                membro.setVoiceChannel(null).then(O_o => {}).then(O_os =>{});
                membro.addRole(roles, motivo);
                if(segundos == 0) {

                    message.reply(`<:yes:557599188419084289> **|**  Usuário \`${membro.user.username}\` foi silenciado por : \`${motivo == '' ? 'Não especificado' : motivo}\`.`);
                    message.channel.stopTyping(true)
                    return;
                };
                if(typeof tempo_motivo == 'undefined' || tempo_motivo == '' || tempo_motivo == '0s') return message.reply(`<:yes:557599188419084289> **|**  Usuário \`${membro.user.username}\` foi silenciado por : \`${motivo == '' ? 'Não especificado' : motivo}\``);
                muteMembro(client,membro,roles, tempo_motivo, motivo, message);
                let time_comandos = (new Date()).getTime();
                client.muteColletor.registrarMutado(message.guild.id, {
                    id: membro.user.id,
                    tempo: tempo_motivo == '' ? typeof tempo_motivo == 'undefined' ? 0: tempo_motivo : tempo_motivo,
                    time_comandos:time_comandos                     
                });
         
               
            
            }else
            {
                message.reply(`<:no:557599389292429315> **|** A role não foi encontrada na nossa **Collection** caso tenha visto esta mensagem, entre em contato com o desenvolvedor.`);
                message.channel.stopTyping(true);
                return;  
            }
        }
        

        function muteMembro(client,membro,id_role, tempo, motivo, message)
        {
            

            let tempo_type = typeof tempo != 'undefined'? tempo.replace(/[^a-z]/g,'') : '';
            let tempo_segs = typeof tempo != 'undefined'? tempo.replace(/[^0-9]/g,''): '';
            let final_tempo ='';
            if(tempo_type == 's' || tempo_type == 'm' || tempo_type == 'h' || tempo_type == '')
            {
                final_tempo = `${tempo_segs}${tempo_type == '' ? 's' : tempo_type}`
            }else
            {
                final_tempo = `${tempo_segs}s`
            }
            message.reply(`<:yes:557599188419084289> **|**  Usuário \`${membro.user.username}\` foi silenciado por : \`${motivo == '' ? 'Não especificado' : motivo}\` ${typeof final_tempo == 'undefined' ?  final_tempo == ''? '': '' : 'até '+ final_tempo}`);
            message.channel.stopTyping(true)
            if(tempo_type == '' && tempo_segs == '' || typeof tempo_segs == 'undefined' || typeof tempo_type == 'undefined') return;
            message.channel.stopTyping(true);
            if(typeof tempo == 'undefined' || tempo == '') return;
            let tempo_tipo = tempo.replace(/[^a-z]/g, '');
            let tempo_time = tempo.replace(/[^0-9]/g,'');
            let time = 0;
            if(tempo_tipo == 's' || tempo_tipo == '')
            {
                time = tempo_time;
            }else if(tempo_tipo =='m')
            {
                time = 60*tempo_time;
            }else if(tempo_tipo == 'h')
            {
                time = 3600*tempo_time
            }else
            {
                time = tempo_time;
            }
            if(tempo_tipo != 's' || tempo_tipo !='m' || tempo_tipo !='')
            setTimeout(()=>{
                
              membro.removeRole(id_role).then(r =>{}).catch(err =>{});
              let mutado_membro = client.muteColletor.muted.get(message.guild.id);
              let silenciados = mutado_membro.find(usr => usr.id === membro.user.id);
              let posicao_silenciados = mutado_membro.indexOf(silenciados)
              mutado_membro.splice(posicao_silenciados, 1); 
              if(mutado_membro == []|| typeof mutado_membro == 'undefined' || typeof silenciados == 'undefined' || mutado_membro == '')
              {client.muteColletor.muted.delete(message.guild.id);}
      
              const fs = require('fs');
              fs.readFile('./Colletores/cache/cacheMute.json', (err, res)=>{
              let resultado = JSON.parse(res)
              let guild_mute = resultado.find(g => g.id_guild === message.guild.id);
              if(typeof guild_mute == 'undefined') return;

              let usuarios_mutados = guild_mute.usuarios_mutado.find( us => us.id === membro.user.id);
              if(typeof usuarios_mutados == 'undefined') return;
              const mutados_posicao = guild_mute.usuarios_mutado.indexOf(usuarios_mutados);
              const guild_posicao = resultado.indexOf(guild_mute);
             if(typeof usuarios_mutados == 'undefined' || usuarios_mutados == '')
              {
                  resultado.splice(guild_posicao, 1);
                  resultado = "[]"
            
              }
                  guild_mute.usuarios_mutado.splice(mutados_posicao, 1)
                  if(guild_mute.usuarios_mutado.length == 0)
                  {
              
                      resultado.splice(guild_posicao, 1);
                 
                  }
               fs.writeFile('./Colletores/cache/cacheMute.json', resultado == "[]" ? resultado : JSON.stringify(resultado), (err, res)=>{
                   if(err) return console.log(err)
               })
            }) 
            }, 1000 * time)

        }

        
    }
}

module.exports = mute;