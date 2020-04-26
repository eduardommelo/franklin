const discord = require('../discordAPI')

class pluginComando{

    constructor(franklin, nome, descricao, emoji, pluginID)
    {
        if(!franklin) throw new Error('[ERROR] a client da lib não foi definida');
		if(typeof nome !== 'string') throw new TypeError('[ERROR] È preciso ser uma string..');
        if(nome !== nome.toLowerCase()) throw new Error('[EROR] as palavras do nome do plugin precisam ser minusculas.');
        
        this.nome = nome;
        this.descricao = descricao;
        this.emoji = emoji;
        this.comandos = new discord.Collection();
        this.pluginID = pluginID;

    }


    recarregar()
    {
        for(const comando of this.comandos.values()) comando.recarregar();
    }
}

module.exports = pluginComando;