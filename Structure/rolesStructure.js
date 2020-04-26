
class rolesTime {
    constructor(franklin)
    {
        this.client = franklin;
    }


    roleBan(guild)
    {
        const res = require('../Colletores/cache/cacheBan.json');
            if(res == "[]") return;
            const guilds = res.find(g => g.id_guild === guild.id);
            if(typeof guilds == 'undefined') return;
            
                guilds.servidor.map( r =>{

       
                let canais = guilds.servidor.find( cs => cs.id_membro === r.id_membro);
             
                if(typeof canais == 'undefined') return;
               const tempo = typeof canais.time.replace(/[^0-9]/g, '') == 'undefined' ? '' : canais.time.replace(/[^0-9]/g,'');
                if(tempo == '') return;
                const tempo_tipo = typeof canais.time.replace(/[^a-z]/g,'') == 'undefined' ? '' : canais.time.replace(/[^a-z]/g,'');
                const agora = new Date();
                let segs =  ((canais.tempos_comando - agora.getTime())/1000);
                let segs_restantes = Math.round(Math.abs(segs));
              
                if( tempo_tipo == '') return;
                let time = 0;
                if(tempo_tipo == 's')
                {
                    time = tempo;
                }
                if(tempo_tipo == 'm')
                {
                    time = tempo*60;
                }
                if(tempo_tipo == 'h')
                {
                    time = tempo*3600;
                }
                const tempo_faltando = time - segs_restantes;
                if(tempo_faltando < 0)
                {

                    const servidor = this.client.guilds.get(guilds.id_guild);
                     servidor.unban(canais.id_membro, 'Tempo excedido do banimento do usuário').then(O_o => {}).catch(O_o =>{});;
                    removePrepare(guild.id, canais.id_membro);
                    return;
                }
                setTimeout(()=>{
                  
                    const servidor = this.client.guilds.get(guilds.id_guild);
                    servidor.unban(canais.id_membro, 'Tempo excedido do banimento do usuário').then(O_o => {}).catch(O_o =>{});
                    removePrepare(guild.id, canais.id_membro);
                }, 1000 * tempo_faltando);
            })
                function removePrepare(id_guild, canal)
                {
                   
                    const fs = require('fs');
                    fs.readFile('./Colletores/cache/cacheBan.json', (err, res)=>{
                        let dados = JSON.parse(res);  
                        let gls = dados.find(gs => gs.id_guild === id_guild);
                        if(typeof gls == 'undefined') return;
                        if(dados.length == 1 && gls.servidor.length == 0)
                        {
                            dados = "[]";
                        }else
                        {
                            
                            let canais = gls.servidor.find(f => f.id_membro === canal);
                            if(typeof  canais == 'undefined') return;
                            let posicao_canal = gls.servidor.indexOf(canais);
                            gls.servidor.splice(posicao_canal, 1);
                        }
                        if(gls.servidor.length == 0)
                        {
                            let posicao_guild = dados.indexOf(gls);
                            dados.splice(posicao_guild,1);
                        }
                        const cacheBans = require('../Colletores/cache/cacheBan.json')
                        if( gls.servidor.length == 0 && cacheBans.length == 1)
                        {
                            dados = "[]";
                        }
                    fs.writeFile('./Colletores/cache/cacheBan.json' ,dados == "[]" ? dados : JSON.stringify(dados), (err, res)=>{
                        if(err) return console.log(err);
                    })
                    });
                }
        
    }
    roleSlow(guild)
    {
    
            const res = require('../Colletores/cache/cacheSlow.json');
            if(res == "[]") return;
            const guilds = res.find(g => g.id_guild === guild.id);
            if(typeof guilds == 'undefined') return;
            guild.channels.map( c => {
                let canais = guilds.channels.find( cs => cs.id_channel === c.id);
                if(typeof canais == 'undefined') return;
               const tempo = typeof canais.time.replace(/[^0-9]/g, '') == 'undefined' ? '' : canais.time.replace(/[^0-9]/g,'');
                if(tempo == '') return;
                const tempo_tipo = typeof canais.time.replace(/[^a-z]/g,'') == 'undefined' ? '' : canais.time.replace(/[^a-z]/g,'');
                const agora = new Date();
                let segs =  ((canais.tempos_comando - agora.getTime())/1000);
                let segs_restantes = Math.round(Math.abs(segs));
              
                if( tempo_tipo == '') return;
                let time = 0;
                if(tempo_tipo == 's')
                {
                    time = tempo;
                }
                if(tempo_tipo == 'm')
                {
                    time = tempo*60;
                }
                if(tempo_tipo == 'h')
                {
                    time = tempo*3600;
                }
                const tempo_faltando = time - segs_restantes;
                if(tempo_faltando < 0)
                {
                    const canss = this.client.channels.get(c.id)
                    canss.setRateLimitPerUser(0,'Tempo excedido do slowmode').then( msg =>{
                        canss.startTyping();
                        canss.send(`<:slowmode:575096842094641163> **|** O canal ${canss} foi retirado do modo lento. `)
                        canss.stopTyping(true);
                    });
              
                    removePrepare(guild.id, c.id);
                    return;
                }
                setTimeout(()=>{
                  
                    const cans = this.client.channels.get(c.id)
                    cans.setRateLimitPerUser(0,'Tempo excedido do slowmode').then( msg =>{
                        cans.startTyping();
                        cans.send(`<:slowmode:575096842094641163> **|** O canal ${cans} foi retirado do modo lento. `)
                        cans.stopTyping(true);
                    });
              
                    removePrepare(guild.id, c.id);
                }, 1000 * tempo_faltando);
                function removePrepare(id_guild, canal)
                {
                   
                    const fs = require('fs');
                    fs.readFile('./Colletores/cache/cacheSlow.json', (err, res)=>{
                        let dados = JSON.parse(res);
                        
                        let gls = dados.find(gs => gs.id_guild === id_guild);
                        if(typeof gls == 'undefined') return;
                        if(dados.length == 1 && gls.channels.length == 0)
                        {
                            dados = "[]";
                        }else
                        {
                            
                            let canais = gls.channels.find(f => f.id_channel === canal);
                            if(typeof  canais == 'undefined') return;
                            let posicao_canal = gls.channels.indexOf(canais);
                            gls.channels.splice(posicao_canal, 1);
                        }
                        if(gls.channels.length == 0)
                        {
                            let posicao_guild = dados.indexOf(gls);
                            dados.splice(posicao_guild,1);
                        }
                        const cacheLock = require('../Colletores/cache/cacheSlow.json')
                        if( gls.channels.length == 0 && cacheLock.length == 1)
                        {
                            dados = "[]";
                        }
                    fs.writeFile('./Colletores/cache/cacheSlow.json' ,dados == "[]" ? dados : JSON.stringify(dados), (err, res)=>{
                        if(err) return console.log(err);
                    })
                    });
                }
            })
    
    }

    roleLock(guild)
    {

            const res = require('../Colletores/cache/cacheLock.json');
            if(res == "[]") return;
            const guilds = res.find(g => g.id_guild === guild.id);
            if(typeof guilds == 'undefined') return;
            guild.channels.map( c => {
                let canais = guilds.channels.find( cs => cs.id_channel === c.id);
                if(typeof canais == 'undefined') return;
               const tempo = typeof canais.time.replace(/[^0-9]/g, '') == 'undefined' ? '' : canais.time.replace(/[^0-9]/g,'');
                if(tempo == '') return;
                const tempo_tipo = typeof canais.time.replace(/[^a-z]/g,'') == 'undefined' ? '' : canais.time.replace(/[^a-z]/g,'');
                const agora = new Date();
                let segs =  ((canais.tempos_comando - agora.getTime())/1000);
                let segs_restantes = Math.round(Math.abs(segs));
              
                if( tempo_tipo == '') return;
                let time = 0;
                if(tempo_tipo == 's')
                {
                    time = tempo;
                }
                if(tempo_tipo == 'm')
                {
                    time = tempo*60;
                }
                if(tempo_tipo == 'h')
                {
                    time = tempo*3600;
                }
                const tempo_faltando = time - segs_restantes;
                if(tempo_faltando < 0)
                {
                    const canss = this.client.channels.get(c.id)
                    canss.overwritePermissions(guild.roles.find(role => role.id === guild.id), {
                        SEND_MESSAGES: true
                    }).then( s => {
                        canss.startTyping();
                        canss.send(`<:lock:572383068183330817> **|** O canal de texto ${cans} foi desbloqueado com sucesso.`);
                        canss.stopTyping(true);
                    }).catch(O_o =>{});
                    // remover do arquivo Json
                    removePrepare(guild.id, c.id);
                    return;
                }
                setTimeout(()=>{
                  
                    const cans = this.client.channels.get(c.id)
                    cans.overwritePermissions(guild.roles.find(role => role.id === guild.id), {
                        SEND_MESSAGES: true
                    }).then( s => {
                        cans.startTyping();
                        cans.send(`<:lock:572383068183330817> **|** O canal de texto ${cans} foi desbloqueado com sucesso.`);
                        cans.stopTyping(true);
                    }).catch(O_o =>{});
                    // remover do arquivo Json
                    removePrepare(guild.id, c.id);
                }, 1000 * tempo_faltando);
                function removePrepare(id_guild, canal)
                {
                   
                    const fs = require('fs');
                    fs.readFile('./Colletores/cache/cacheLock.json', (err, res)=>{
                        let dts = '';
                        let dados = JSON.parse(res);
                        
                        let gls = dados.find(gs => gs.id_guild === id_guild);
                        if(typeof gls == 'undefined') return;
                        if(dados.length == 1 && gls.channels.length == 0)
                        {
                            dados = "[]";
                        }else
                        {
                            
                            let canais = gls.channels.find(f => f.id_channel === canal);
                            if(typeof  canais == 'undefined') return;
                            let posicao_canal = gls.channels.indexOf(canais);
                            gls.channels.splice(posicao_canal, 1);
                        }
                        if(gls.channels.length == 0)
                        {
                            let posicao_guild = dados.indexOf(gls);
                            dados.splice(posicao_guild,1);
                        }
                        const cacheLock = require('../Colletores/cache/cacheLock.json')
                        if( gls.channels.length == 0 && cacheLock.length == 1)
                        {
                            dados = "[]";
                        }
                    fs.writeFile('./Colletores/cache/cacheLock.json' ,dados == "[]" ? dados : JSON.stringify(dados), (err, res)=>{
                        if(err) return console.log(err);
                    })
                    });
                }
            })
    
    }
    roleMutado(clientGuild)
    {
        let fs = require('fs');
        let cargo_sil =  this.client.muteColletor.role_mute.get(clientGuild.id)
        if(typeof cargo_sil == 'undefined') return;
       let mutados_membros = require('../Colletores/cache/cacheMute.json');
        let silenciados = mutados_membros.find( gls=> gls.id_guild == clientGuild.id);
        if(typeof silenciados != 'undefined')
        {
            silenciados.usuarios_mutado.map( usr_m =>{
                let membro_get = clientGuild.members.get(usr_m.id)
                let data = new Date()
                let segundos =  ((usr_m.comando_executado - data.getTime())/1000);
                let segundos_restantes = Math.round(Math.abs(segundos));
                let tempo_tipo = typeof usr_m.tempo_mute != 'undefined' ? usr_m.tempo_mute.replace(/[^a-z]/g,'') : '';
                let tempo_int = typeof usr_m.tempo_mute != 'undefined' ? usr_m.tempo_mute.replace(/[^0-9]/g, '') : '';
               if(tempo_tipo == '' || tempo_int == '') return;
                let uptimes = 0;
                let calculo_times = 0;

                if(tempo_tipo == 's' || tempo_tipo == '')
                {
                    uptimes = tempo_int;
                }
                if(tempo_tipo == 'm')
                {
                    uptimes = 60*tempo_int;
                }
                if(tempo_int == 'h')
                {
                    uptimes = 3600*tempo_int;
                }
                calculo_times = uptimes - segundos_restantes;
                if(calculo_times <= 0)
                {
                    let usuario_pendente = silenciados.usuarios_mutado.find( u => u.id == usr_m.id);
            
                    removerCargo(membro_get, cargo_sil);
                    let posicao_usuario = silenciados.usuarios_mutado.indexOf(usuario_pendente);
                    if(posicao_usuario > -1)
                    {
                        silenciados.usuarios_mutado.splice(posicao_usuario, 1)
                    }         
                    if(silenciados.usuarios_mutado.length == 0)
                    {
                    mutados_membros.splice(posicao_usuario, 1)
                        if(silenciados.usuarios_mutado.length == 0 && mutados_membros.length == 1)
                        {
                            mutados_membros = "[]"
                        }
                    }
                    if(mutados_membros == "[]" || mutados_membros == '')
                    {
                        mutados_membros = "[]"
                    }
                    fs.writeFile('./Colletores/cache/cacheMute.json',mutados_membros != "[]" ? mutados_membros.length == 1  ? JSON.stringify(mutados_membros) : JSON.stringify(mutados_membros) : mutados_membros, (err, res)=>{
                        if(err) return console.log(err);
                    })
                    return;
                }
                 setTimeout(() =>{  
                    removerCargo(membro_get, cargo_sil);
                    let mute_membros = mutados_membros.indexOf(silenciados)
                    let usuario_pendentes = silenciados.usuarios_mutado.find( u => u.id == usr_m.id)
                    let posic_mutados = silenciados.usuarios_mutado.indexOf(usuario_pendentes)
                    silenciados.usuarios_mutado.splice(posic_mutados, 1);
                    let verifica_confirms = silenciados.usuarios_mutado.find( u => u.id == usr_m.id);
                    if(verifica_confirms == '' || typeof verifica_confirms == 'undefined')
                    {
                        if(mutados_membros.length >= 2)
                        {
                            mutados_membros.splice(mute_membros)
                        }else if(mutados_membros.length == 1)
                        {
                            mutados_membros = "[]"
                        }
                    }
                    fs.writeFile('./Colletores/cache/cacheMute.json',mutados_membros != "[]"? JSON.stringify(mutados_membros) : mutados_membros, (err, res)=>{
                        if(err) return console.log(err);
                    })
                }, 1000 * calculo_times)
            })
        }
        function removerCargo(membro_get, cargo_sil)
        {
            membro_get.removeRole(cargo_sil).then(() =>{}).catch(O_o =>{});
        }
  
    }
}

module.exports = rolesTime;