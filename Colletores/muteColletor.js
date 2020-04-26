const discord = require('../discordAPI')
class muteColletor {
    constructor()
    {
        this.muted = new discord.Collection();
        this.role_mute = new discord.Collection();
        this.tempMute = 0;
    }


    registrarMutado(id, mutado)
    {
        const fs = require('fs');
        if(typeof id == 'undefined') return new Error('[ERRO] argumento id e tempo obrigatorio.');
        if(this.muted.get(id))
        {
           let mt = this.muted.get(id);
           mt.push(mutado)
           fs.readFile('./Colletores/cache/cacheMute.json', (err, res)=>{
                let arquivoCache = JSON.parse(res);
                let caches = arquivoCache.find( u => u.id_guild === id);

                let dados = {
                    id: mutado.id,
                    tempo_mute: mutado.tempo,
                    comando_executado: mutado.time_comandos
                }
                caches.usuarios_mutado.push(dados)
                let resultado = JSON.stringify(arquivoCache)
            fs.writeFile('./Colletores/cache/cacheMute.json', resultado,(err, res)=>{
                    if(err) console.log(err);})
           
           })
            return;
        }  
        fs.readFile('./Colletores/cache/cacheMute.json', (err, res)=>{
        
            let membros_mutado = JSON.parse(res);
            let mutados = membros_mutado.find(usr => usr.id_guild === id);
            if(typeof mutados == 'undefined')
            {
                let json_m = {
                    id_guild: id,
                    usuarios_mutado: [
                        {
                            id: mutado.id,
                            tempo_mute: mutado.tempo,
                            comando_executado: mutado.time_comandos
                        }
                    ]
                }
;
                membros_mutado.push(json_m);
                fs.writeFile('./Colletores/cache/cacheMute.json', JSON.stringify(membros_mutado), (err, res)=> {
                    if(err) return console.log(err);
                })
            return;
            }        
    });
   
        this.muted.set(id, [mutado]);   
    }

    registrarRole(guild,id_role)
    {
        if(typeof guild == 'undefined') return new Error('[ERRO] argumento id e tempo obrigatorio.');
        if(this.role_mute.get(guild))
        {
            this.role_mute.delete(guild)
        }
        this.role_mute.set(guild, id_role);
    } 
}

module.exports = muteColletor;