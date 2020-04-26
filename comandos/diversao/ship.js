const fk = require('../../plugins/index');
const canvas = require('canvas')
const Discord = require('../../discordAPI')
class ship extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'ship',
            alternativas: ['shippar', 'casal'],
            plugin_grupo: 'diversao',
            label: ['<@member/ID>', '[@member/ID]'],
            descricao_comando: 'Veja quem será a sua cremosa.',
            dm: false
        })
        this.client = franklin;
        this.ships = new Discord.Collection()
    }

    async runComando(message, args)
    {
        let memberOne = args[0]
        let memberTwo = args[1]

        if(!memberOne) return message.franklinUndefined('**Informe o argumento obrigatório `<@member/ID>`  válido.**')
        if(!memberTwo){
            memberTwo = memberOne
            memberOne = message.author.id
        }
        if(!memberOne) return message.franklinUndefined('**Informe os o argumento obrigatório `<@member/ID>`  válidos.**')
        const idOneMember = typeof memberOne.replace(/[^0-9]/g,'') === 'undefined' ? false : memberOne.replace(/[^0-9]/g,'')
        const idTwoMember = typeof memberTwo.replace(/[^0-9]/g,'') === 'undefined' ? false : memberTwo.replace(/[^0-9]/g,'')
        if(!idOneMember || !idTwoMember) return message.franklinUndefined('**Um dos membros não foi encontrado neste servidor.**')
        const memberShipOne = message.guild.members.find(memb => memb.user.id === idOneMember)
        const memberShipTwo = message.guild.members.find(membs => membs.user.id === idTwoMember)
        if(!memberShipOne  || !memberShipTwo) return message.franklinUndefined('**Informe os dois argumentos obrigatório `<@member/ID> , <@member/ID>` válidos.**')
       const Canvas = canvas.createCanvas(384, 128)
       const ctx = Canvas.getContext('2d')
       const avatarOne = memberShipOne.user.avatarURL === null ? memberShipOne.user.defaultAvatarURL : memberShipOne.user.avatarURL
       const avatarTwo = memberShipTwo.user.avatarURL === null ? memberShipTwo.user.defaultAvatarURL : memberShipTwo.user.avatarURL
       // Algoritmo do ship
        const some_one = memberShipOne.user.username.substr(0, Math.round(memberShipOne.user.username.length/2))
        const some_two = memberShipTwo.user.username.substr(Math.round(memberShipTwo.user.username.length/2))
        const uniq = `${some_one}${some_two}`
        const phrases = require('../../util/json/ship.json')
        let numbersRandom = Math.floor(Math.random()*100)
        if(!this.ships.get(memberShipOne.user.id+'_ships_'+memberShipTwo.user.id) || !this.ships.get(memberShipTwo.user.id+'_ships_'+memberShipOne.user.id)){
            this.ships.set(memberShipOne.user.id+'_ships_'+memberShipTwo.user.id, numbersRandom)
            this.ships.set(memberShipTwo.user.id+'_ships_'+memberShipOne.user.id, numbersRandom)
            setTimeout(()=>{
                this.ships.delete(memberShipOne.user.id+'_ships_'+memberShipTwo.user.id, numbersRandom)
                this.ships.delete(memberShipTwo.user.id+'_ships_'+memberShipOne.user.id, numbersRandom)
            }, 1000 * 120)
        }
        if(this.ships.get(memberShipOne.user.id+'_ships_'+memberShipTwo.user.id) || this.ships.get(memberShipTwo.user.id+'_ships_'+memberShipOne.user.id)){
            if(this.ships.get(memberShipOne.user.id+'_ships_'+memberShipTwo.user.id)){
                numbersRandom = this.ships.get(memberShipOne.user.id+'_ships_'+memberShipTwo.user.id)
            }
            if(this.ships.get(memberShipTwo.user.id+'_ships_'+memberShipOne.user.id)){
                numbersRandom = this.ships.get(memberShipTwo.user.id+'_ships_'+memberShipOne.user.id)
            }
        }
        let phrase_ship = ''
        let type_emoji ='0'
        if(numbersRandom > 0 && numbersRandom  <=24 ){
            const one = Math.floor(Math.random() * phrases['1'].length)
            phrase_ship = phrases['1'][one]
            .replace('{user_two}', memberShipTwo.user.username)
            .replace('{user_one}', memberShipOne.user.username)
            type_emoji = 0
        }
        if(numbersRandom >= 24 && numbersRandom  <=49 ){
            const two = Math.floor(Math.random() * phrases['2'].length)
            phrase_ship = phrases['2'][two]
            .replace('{user_two}', memberShipTwo.user.username)
            .replace('{user_one}', memberShipOne.user.username)
            type_emoji = 50
        }
        if(numbersRandom > 49 && numbersRandom  <=100 ){
            const three = Math.floor(Math.random() * phrases['3'].length)
            phrase_ship = phrases['3'][three]
            .replace('{user_two}', memberShipTwo.user.username)
            .replace('{user_one}', memberShipOne.user.username)
            type_emoji = 100
        }
       /**
        * Aqui começa gerar a imagem
        */
        // Fundo do ship
       ctx.beginPath()
       const planShip = await canvas.loadImage('./util/img/ship/fundo_ship.png')
       ctx.drawImage(planShip,0,0,384, 128)
       ctx.closePath()
       //Imagem do primeiro membro
       ctx.beginPath()
       ctx.save()
       const clipMemberOne = await canvas.loadImage(avatarOne)
       ctx.arc(64, 64, 56, 0, 2*Math.PI)
       ctx.lineWidth = 5
       ctx.strokeStyle = '#d214c2'
       ctx.stroke()
       ctx.clip()
       ctx.drawImage(clipMemberOne, 0, 0, 128, 120)
       ctx.restore()
       ctx.closePath()
       //Porcentagem no meio
       ctx.beginPath()
       ctx.font = 'Helvetica 40px sans-serif'
       ctx.fillStyle = '#ffffff'
       const probability = numbersRandom+'%'
       const masureNumber = ctx.measureText(probability).width   
       ctx.fillText(probability, (Canvas.width/2) - (masureNumber/2), 64)
       ctx.closePath()
       // Segundo membro do ship
       ctx.beginPath()
       ctx.save()
       const clipMemberTwo = await canvas.loadImage(avatarTwo)
       ctx.arc((Canvas.width - 64),64,56,0,2*Math.PI)
       ctx.lineWidth = 5
       ctx.strokeStyle = '#d214c2'
       ctx.stroke()
       ctx.clip()
       ctx.drawImage(clipMemberTwo, (Canvas.width - 128),0, 128, 120)
       ctx.restore()
       ctx.closePath()
       // barra de porcentagem ship
       ctx.beginPath()
       ctx.moveTo(20, 110);
       ctx.lineWidth = 25;
       ctx.lineCap = 'round';
       ctx.lineTo(Canvas.width-20, 110);
       ctx.strokeStyle = '#2b1030'
       ctx.stroke();
       ctx.closePath()
       // barra de progresso do ship 
       ctx.beginPath()
       ctx.moveTo(20, 110);
       ctx.lineWidth = 25;
       ctx.lineCap = 'round';
       const progress = Canvas.width-20
       const calc = (numbersRandom*progress)/100
       ctx.lineTo(numbersRandom <= 3 ? 35 : calc, 110);
       ctx.strokeStyle = '#ba0bb4'
       ctx.stroke();
       ctx.closePath()
       // emojis ship
       ctx.beginPath()
       const emoji = await canvas.loadImage('./util/img/ship/love_'+type_emoji+'.png')
       ctx.drawImage(emoji,(Canvas.width/2) - (71/2),(Canvas.height - 64), 71,64 )
       ctx.closePath()
       const embed = new Discord.RichEmbed()
       embed.setColor('#f542ad')
       embed.setImage('attachment://'+'SHIP-'+memberShipOne.user.id+'-'+memberShipTwo.user.id+'.png')
       embed.attachFiles([{
        attachment: Canvas.toBuffer(),
        name: 'SHIP-'+memberShipOne.user.id+'-'+memberShipTwo.user.id+'.png'}])
       embed.setDescription(`
       :heart: :heart: **Vamos ver aqui...** :heart: :heart: 

\`${memberShipOne.user.username}+${memberShipTwo.user.username} = ${uniq}\`
__**${phrase_ship}**__
       `)
       message.channel.send(embed)  
        message.channel.stopTyping(true)
        
    }
}

module.exports = ship;