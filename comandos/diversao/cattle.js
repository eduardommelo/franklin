const fk = require('../../plugins/index');
const mongoose = require('mongoose')
const canvas = require('canvas')
const Discord = require('../../discordAPI')
class testes extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'cattle',
            plugin_grupo: 'diversao',
            alternativas: ['gadometro', 'gadomedidor', 'gado'],
            label: ['[@member/ID]'],
            descricao_comando: 'Medi o tamanho do seu escravocetismo.'
        })
        this.client = franklin;
        this.db = mongoose.connection;
        this.cattle = new Discord.Collection()
    }

    async runComando(message, args)
    {   
       let argument = args.slice(0).join(' ')
       if(!argument){argument = message.author.id}
       let memberID = message.author.id
       if(memberID.length > 5){
        memberID = typeof argument.replace(/[^0-9]/g,'') === 'undefined'? false : argument.replace(/[^0-9]/g,'')
       }
       if(!memberID || memberID.length <= 4) {
        memberID = message.guild.members.find(m => m.user.username === argument || m.user.discriminator === argument ||  m.nickname === argument || m.user.tag === argument )
        if(memberID){
            memberID = memberID.user.id
        }
       }
       if(!memberID) return message.franklinUndefined('**Digite o argumento `membro` válido.**')
       const member = message.guild.members.find(memb => memb.user.id === memberID)
       if(!member) return message.franklinUndefined('**O membro não se encontra neste servidor.**')
       const Canvas = canvas.createCanvas(520, 520)
       const ctx = Canvas.getContext('2d')
       ctx.beginPath()
       const cattle = await  canvas.loadImage('./util/img/cattle/cattle.jpeg')
       ctx.drawImage(cattle,0,0, Canvas.width, Canvas.height)
       ctx.closePath()
       ctx.beginPath()
       let height = 0
       let type = ''
       let phrase = '**Esse aí é um guerreiro daqueles!**'
       let porcent = Math.floor(Math.random()*100)
       if(!this.cattle.get(member.user.id)){
           this.cattle.set(member.user.id, porcent)
           setTimeout(()=>{
               this.cattle.delete(member.user.id)
           }, 1000 * 120)
       }
       if(this.cattle.get(member.user.id)){
           porcent = this.cattle.get(member.user.id)
       }
       if(porcent >= 0 && porcent <= 15){
           height = 91 - 10
           phrase = '**Esse aí é um belo de um guerreiro.**'
           type = '0'
       }
       if(porcent >= 16 && porcent <= 49){
           height = (101/2)+20
           phrase = '**Esse ai, sei não viu, a gaia começou a crescer.**'
           type = '50'
       }
       if( porcent >=50 && porcent <= 100){
           height = 9;
           phrase = '**Esse ai já pode fazer muuu em.**'
           type = '100'
       }
       const horn = await canvas.loadImage('./util/img/cattle/cattle_'+type+'.png') 
       ctx.drawImage(horn, Canvas.width/2 - (horn.width/2), height, horn.width, horn.height)
       ctx.closePath()
       ctx.beginPath()
       ctx.save()
       const circleIMG = await canvas.loadImage(member.user.avatarURL === null? member.user.defaultAvatarURL : member.user.avatarURL)
       ctx.arc(Canvas.width/2, 500/2, 90, 0, 2*Math.PI)
       ctx.clip()
       ctx.drawImage(circleIMG, (Canvas.width/2) - (185/2),154, 185, 185)
       ctx.restore()
       ctx.closePath()
       const embed = new Discord.RichEmbed()
       let bar = '█'.repeat(parseInt(porcent/10)) + '.'.repeat(parseInt((100-porcent)/10))
bar = bar.length < 10 ? bar + '.'.repeat(10 - bar.length) : bar
       embed.setTitle('Gadometro de '+member.user.username)
       embed.setColor('#3d77d4')
       embed.setImage('attachment://Ala_O_Gado_KkkKKKKKKkkkkK.png')
       embed.attachFiles([
        {
            attachment: Canvas.toBuffer(),
            name: 'Ala_O_Gado_KkkKKKKKKkkkkK.png'

        }
       ])
       embed.setDescription(`
\`${bar}\` ${porcent}%
${phrase}
       `)
       message.channel.send(embed)


    }
}

module.exports = testes;
