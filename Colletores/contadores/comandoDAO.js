class comandosDAO {
    constructor()
    {

        /**
         * @private
         */
        this._comandos = require('../../config/colletor.json');
    }

    get comandoCount()
    {
        return this._comandos.comando_count;
    }
    set comandoCount(c)
    {
    let arquivo_require = require('../../config/colletor.json');
    arquivo_require.comando_count += c;

    }
}
module.exports = comandosDAO;