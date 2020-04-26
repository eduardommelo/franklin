const fs = require('fs');
module.exports = function(franklin){

    franklin.on('guildMemberAdd', member =>{
        if(franklin.muteColletor.muted.get(member.guild.id))
        {
            let membro_mutado = franklin.muteColletor.muted.get(member.guild.id);
            if(membro_mutado.find(u => u.id == member.user.id))
            {
                let role_mute = franklin.muteColletor.role_mute.get(member.guild.id)
                    member.addRole(role_mute);
                    return;
            }
        }

        fs.readFile('./Colletores/cache/cacheMute.json', (err, res) =>{
            let usuarios_mutado = JSON.parse(res);
            const guild = usuarios_mutado.find( server => server.id_guild === member.guild.id);
            if(typeof guild == 'undefined') return;
            const mutados =  guild.usuarios_mutado.find(usr => usr.id === member.user.id);
            if(mutados)
            {
                let role_mute = franklin.muteColletor.role_mute.get(member.guild.id)
                member.addRole(role_mute);
                return;
            }
        });
    })
}