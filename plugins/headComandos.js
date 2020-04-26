const discord = require('../discordAPI');
const pluginComando = require('./pluginComando');
const Command = require('./base');

class headComando {

    constructor(franklin)
    {
        this.client = franklin;
        this.plugins = new discord.Collection();
        this.comandos = new discord.Collection();
        this.comandoPath = null;
    }

    registrarPlugin(nome_plugin, descricao, emoji, pluginID)
    {
        if(typeof nome_plugin == 'string' ) return this.registrarPlugins([[nome_plugin, descricao, emoji, pluginID]])
        
    }


    registrarPlugins(plugins)
    {
        if(!Array.isArray(plugins)) throw new Error('[ERROR] é preciso ser um array  para recuperar o objeto para a collection.');
        for(let plg of plugins)
        {   if(typeof plg === 'function')
            {
                plg = new plg(this.client);
            }else if(Array.isArray(plg))
            {
                plg = new pluginComando(this.client, ...plg);   
            }else if(!(plg instanceof pluginComando))
            {
                plg = new pluginComando
            }
           let verifica_grupo = this.plugins.get(plg.nome);
            if(verifica_grupo) return console.log(`[ERROR] O plugin já foi registrado`)
            this.plugins.set(plg.nome, plg);
        }

        return this;
    }
    registrarComando(comando)
    {
        return this.registrarComandos([comando])
    }
    registrarComandos(comandos)
    {   
    
        if(!Array.isArray(comandos)) throw new TypeError('[ERROR] O comando precisa ser um array.');
        for(let cmd of comandos)
        {
      
            if(typeof cmd === 'function') cmd = new cmd(this.client);
          
            if(!(cmd instanceof Command)) {
                this.client.emit('warn', `Tentando registrar um objeto de comando inválido: ${cmd}; foi pulado.`);
                continue;
            }
            for(const alt of cmd.alternativas)
            {
                if(this.comandos.some(cmds => cmds.nome_comando === alt || cmds.alternativas.includes(alt)))
                {
                    throw new Error('[ERROR] comando alternativo já registrado: '+ comandos.nome_comando)
                }
            }
            const plugin = this.plugins.find(plg => plg.nome === cmd.plugin_grupo);

            if(!plugin) throw new Error(`[ERROR] Plugin ${cmd.plugin_grupo} não foi registrado.`);
            cmd.plugin = plugin;
            plugin.comandos.set(cmd.nome_comando, cmd);
            this.comandos.set(cmd.nome_comando, cmd);
           
        }   
        return this;
    }
    registrarComandosUnico(opcoes)
    {
      
        const objeto = require('require-all')(opcoes);
        const comandos = [];
        for(const plugin of Object.values(objeto))
        {
            for(let comando of Object.values(plugin))
            {
                if(typeof comando.default === 'function') comando = comando.default;
                comandos.push(comando);
            }
        }
        if(typeof opcoes === 'string' && !this.comandoPath) this.comandoPath = opcoes;
        return this.registrarComandos(comandos);
    }
}

module.exports = headComando;