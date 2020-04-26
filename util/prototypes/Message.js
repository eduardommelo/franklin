const {Message} = require('../../discordAPI')

module.exports = class start{
    static messages(){
        Message.prototype.franklinError = function send(msg){
            this.channel.send(`<:permission:620710961749295118> **|** ${this.channel.type === 'dm'? '' : this.author+', '}${msg}`)
            this.channel.stopTyping(true)
        }
        Message.prototype.franklinUndefined = function send(msg){
            this.channel.send(`<:err:565568697536872509> **|** ${this.channel.type === 'dm'? '' : this.author+', '}${msg}`)
            this.channel.stopTyping(true) 
        }
        Message.prototype.franklinSuccess = function send(msg){
            this.channel.send(`<:yes:557599188419084289> ${this.channel.type === 'dm'? '' : this.author+', '}${msg}`)
        }
    }
}