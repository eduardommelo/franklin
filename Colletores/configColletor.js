const discord = require('../discordAPI');
class configFranklin {
    constructor()
    {
        this.configs = new discord.Collection();

    }

   registrarConfig(id_guild, config)
   {
        const configs = this.configs;
        configs.set(id_guild, config);
   }

}

module.exports = configFranklin;