const fk = require('../../plugins/index');
const {RichEmbed} = require('../../discordAPI')
class avatar extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'avatar',
            alternativas: ['pic', 'picture', 'av'],
            label: ['[@mention/id]'],
            plugin_grupo: 'global',
            descricao_comando: 'Expandir o avatar Image do membro especifico ou o seu.',
            dm: true
        })
        this.client = franklin;
    }

    async runComando(message, args)
    {

        let members = args.slice(0).join(' ')
        if(message.channel.type == 'dm'){
            const fetchId = typeof members.replace(/[^0-9]/g,'') == 'undefined' || members.replace(/[^0-9]/g,'') == '' ? message.author.id : members.replace(/[^0-9]/g,'')
            fetchUser(this.client,fetchId)
            return
        }
   
        let member = message.guild.members.find(u => u.user.id === members || u.user.username == members || u.user.tag === members || u.user.discriminator === members || u.nickname === members || u.user.tag === members || u.nickname === members)
        if(member){
            message.channel.stopTyping(true)
            avatarImage(member.user, message, this.client)
            return
        }
        if(!member){
            const fetchMember = typeof members.replace(/[^0-9]/g,'') == 'undefined' || members.replace(/[^0-9]/g,'') == ''? message.author.id : members.replace(/[^0-9]/g,'')
                fetchUser(this.client,fetchMember)
                return
        }
        async function fetchUser(client,fetchMember){
            let fetchUser = await client.fetchUser(fetchMember).catch(e => fetchMember = message.author)
            if(!fetchUser)
            {
                fetchUser = message.author || fetchMember
            }
            message.channel.stopTyping(true)
            avatarImage(fetchUser, message, client)
        }
        async function avatarImage(member, message, client){
                const avatarMember =member.avatarURL == null ? member.defaultAvatarURL : member.avatarURL
                const authorAvatar = message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL
                const image = avatarMember.replace('?size=2048','')
                message.channel.send({
                    embed:{
                        author:{
                            icon_url: authorAvatar,
                            name: message.author.tag
                        },
                        title: `Avatar de : ${member.username}`,
                        color: 0x42bff4,
                        description: `<:avatar:559505149836394496> **| [Link para imagem >>](${image+'?size=2048'})**`,
                        image:{
                            url: image+'?size=2048'
                        },timestamp: new Date()
                    }
                })
                message.channel.stopTyping(true)
        }
        message.channel.stopTyping(true)  
    }
}

module.exports = avatar;