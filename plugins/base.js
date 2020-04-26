

class Comando{

    /**
     * @typedef {Object} ComandoInformacao
     * @property {string} nome_comando - nome do comando
     * @property {string} descricao_comando - descrição do comando
     * @property {boolean} [dm=false] - verificar se é permitido este comando para executar via Mensagem Direta.
     * @property {boolean} [isOwner=false] - verificar se é acesso exclusivo para desenvolvedores.
     * @property {string[]} [alternativas] - comandos alternativos para um determinado comando
     * @property {string[]} [label] - label do comando
     * @property {string} plugin_grupo - para qual plugin este comando pertence
     */

     /**
      * @param {FranklinClient} franklin
      * @param {ComandoInformacao} info
      */
    constructor(franklin, info)
    {
        
    this.constructor.validarInformacao(franklin, info);
    Object.defineProperty(this, 'franklin', {value: franklin})

        this.client = franklin;
        this.nome_comando = info.nome_comando;
        this.descricao_comando = info.descricao_comando;
        this.dm = Boolean(info.dm);
        this.isOwner = Boolean(info.isOwner);
        this.alternativas = info.alternativas || [];
        this.plugin_grupo = info.plugin_grupo;
        this.label = info.label || [];
        this.hasPermission = info.hasPermission || []
        this.mePermission = info.mePermission || []
        this.plugin = null;

    }

    async runComando(message, args)
    {
        throw new Error('[EROR] é preciso chamar o método runComando(message, args) para que possa executar o comando.');
    }
    static validarInformacao(client, info)
    {
     
        if(!client) throw new Error('[ERROR] Client não foi especificada.')
        if(typeof info !== 'object') throw new TypeError('[ERROR] È preciso ser um objeto literário para poder registrar os comandos.')
        if(typeof info.nome_comando !== 'string' || info.nome_comando == null) throw new TypeError('[ERROR] O objeto nome_comando não foi definido');
        if(typeof info.descricao_comando !== 'string' || info.descricao_comando == null) throw new TypeError('[ERROR] O objeto descricao_comando não está definido.');
    
    }
}

module.exports = Comando;