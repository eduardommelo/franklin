const fk = require('../../plugins/index');
const mongoose = require('mongoose')
class testes extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'teste',
            plugin_grupo: 'global',
            descricao_comando: 'comando de teste.',
            isOwner: true,
            hasPermission: ['MANAGE_CHANNELS'],
            mePermission: ['MANAGE_CHANNELS']
        })
        this.client = franklin;
        this.db = mongoose.connection;
    }

    async runComando(message, args)
    {   
       /* let argumento = args.slice(0).join(' ');
        let teste = argumento.replace(/@(everyone|here)/g, '@\u200b$1');
        let teste3 = argumento.replace(/<|!|>|@/g, '@\u200b$1')
        let teste2 = argumento.replace(/<@!?[0-9]+>/g, input2 =>{
        //    console.log(input2)
        });
     
        let cargo = await message.guild.createRole({
            name: '྾ | Silenciado',
            color: "0x808080",
            permissions:[]
        });

        message.guild.channels.forEach((channel) => {
                channel.overwritePermissions(cargo.id, {
                    SEND_MESSAGES: false,
                    SPEAK: false,
                    CONNECT: false
                })
        });*/

let a = args.slice(0).join(' ');

message.reply(a)
/*try{
    await this.client.shard.broadcastEval(`executa(this);
async function executa(client)
{${a}}`).then( async results => {
    if(typeof results == 'undefined') return message.reply('** Código foi executado uma função')
    await message.reply(results);
    message.channel.stopTyping(true)
    }).catch(err =>{
        message.reply(`
        **${err.name}**
        **${err.message}**
            `) 
    })
}catch (err)
{
    message.reply(`
**${err.name}**
**${err.message}**
    `)
}
    
      
           
*/
    }
}

module.exports = testes;