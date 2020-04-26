module.exports = function(franklin)
{
    const mongoose = require('./mongoose.js');
    mongoose(franklin);
    console.log(`[SUCESSO] ${franklin.user.username} iniciado com sucesso`)
    let status = require('./activityMSG.json');
    let setActivity = () =>{
        let alteraStatus = status.activitys[Math.floor(Math.random()*status.activitys.length)];
        let mensagem = alteraStatus.message.replace('{users}', franklin.users.size).replace('{guilds}', franklin.guilds.size)
        franklin.user.setActivity(mensagem, {type: alteraStatus.type, url: 'http://twitch.tv/#'})
    }
    setActivity();
    setInterval(()=>setActivity(), 1000 * 15);

   
}