const discord = require('../discordAPI');
const readyFranklin = require('./ready');
const plugins = require('../plugins/comandoInicia');
const headComando = require('../plugins/headComandos');
const consign = require('consign');
const mongoose = require('mongoose')
const configFranklin = require('../Colletores/configColletor');
const process = require('process');
const muteColletor = require('../Colletores/muteColletor');
const fs = require('fs');
const cacheMute = require('../Structure/rolesStructure')
const util = require('../util/prototypes/Message.js')
util.messages()
/**
 * @extends Client
 */
class FranklinClient extends discord.Client{

        /**
         * Opções de configurar a client do bot
         * @typedef OpcoesFranklin
         * @param {string} [prefixo=f!]
         * @param {string} [invite=não definido] 
         * @param {string|string[]|Set<string>} [owner]
         * @param {string} [token]
         */

         /**
          * @param {OpcoesFranklin} [opcoes]
          */




    constructor(opcoes = []){

        if(typeof opcoes.prefixo === 'undefined'|| opcoes.prefixo === null) return opcoes.prefixo = 'f!';
        if(typeof opcoes.invite === 'undefined' || opcoes.invite === null) return opcoes.invite = 'Convite não definido'
        if(typeof opcoes.owner === 'undefined'  || opcoes.owner === null) return opcoes.owner = null;
        if(typeof opcoes.token === 'undefined'  || opcoes.token === null) return console.log('[ERRO] defina um token valido')
        super(opcoes)
        const token = require('./auth.json')
        this.fs = fs;
        this.opc = opcoes;
        this.connectedMongoDB = 0
        this.db = mongoose.connection;
        this.cacheMute = new cacheMute(this);
        this.muteColletor = new muteColletor();
        this.headComando = new headComando(this);
        this.configuracao_guild = new configFranklin();
        this.franklin = new plugins(this, this.headComando, this.configuracao_guild)
        this.process = process;
        // setar os comandos editaveis e mensagem
        if(opcoes.token) {this.login(opcoes.token)} else return console.log('[ERRO] defina um token valido');
        this.on('message', message =>{this.franklin.comandoMessage([message]) })
        consign({verbose: false}).include('./eventos').into(this);
        this.on('messageUpdate', (oldMessage, newMessage) =>{this.franklin.comandoMessage([oldMessage, newMessage])})
        let singout = (db) =>{
            console.log('\n[CARREGANDO] Deletando as collection');
            let comandos_ct = require('./colletor.json');
            console.log('[COMANDOS] Os comandos foram executados '+comandos_ct.comando_count+' vezes.')
            this.configuracao_guild.configs.deleteAll();
            console.log('[SUCESSO] Deletado toda as collections');
        }
        this.on('ready', () =>{
            let arquivo_require = require('./colletor.json');
            arquivo_require.comando_count = 0;
            /**
             *  Plugins do bot
             * ===========================================================================
             */
                this.headComando.registrarPlugin('global', 'Comando global que não precisa configurar para utilizar eles', '<:global_plugin:565767846907609088>', 'Global')
                this.headComando.registrarPlugin('moderacao', 'função para gestão do servidor.', '<:gest:566716751212183571>', 'Gestão')
                this.headComando.registrarPlugin('diversao', 'função para comandos de interação no servidor', '<:diversao:566844312265031680>', 'Diversão')
                this.headComando.registrarComandosUnico(__dirname+'/../comandos');
            //=============================================================================
            readyFranklin(this)

            this.guilds.map( g =>{
                this.db.collection('guilds').findOne({
                    id_guild: g.id
                }, (err, res)=>{
                    if(err) throw new console.log(err);
                    if(res){
                   
                        if(res.mute)
                        {
                            const muteCollect = res.mute.roles;               
                                muteCollect.map( mt =>{
                                    this.muteColletor.registrarRole(g.id, mt)
                                })
                        }

                        const configurar = res.config;
                        this.configuracao_guild.registrarConfig(res.id_guild, configurar);
                        this.cacheMute.roleLock(g);
                        this.cacheMute.roleMutado(g)
                        this.cacheMute.roleSlow(g);
                        this.cacheMute.roleBan(g);
                    }
                    
                    if(res == null)
                    {
                        this.db.collection('guilds').insertOne({
                            id_guild : g.id,
                            p_mod : false,
                            p_diversao : false,
                            p_musica : false,
                            p_developer: false,
                            p_automatico: false,
                            p_logs: false,
                            p_util: false,
                            starboard:{
                                enabled: false,
                                count: 0,
                                messages: [],
                                channel: '',
                                channelsIgnore : []
                            },
                            config:{
                                message_everyone: false,
                                message_delete: false,
                                message_mention: false
                            }
                        }, (err, respo)=>{
                            if(respo)
                            {
                         
                            this.db.collection('guilds').findOne({
                                id_guild: g.id
                            },(err, resp) =>{
                                if(resp){
                                    const configurares = resp.config;
                                    this.configuracao_guild.registrarConfig(g.id, configurares);  
                                }
                            })
                              
                           
                                console.log('[Servidor] : '+g.name+' ID : '+g.id +' registrado no banco de dados com sucesso!')
                            }
                        })
                    }
                })
            })
        })
        //========================================
        
        /**
         * @type {?string}
         * @private
         */
  
        this._prefix = opcoes.prefixo;

        /**
         * @type {?string}
         * @private
         */

        this._donos = opcoes.owner




        if(opcoes.owner)
        {
            this.once('ready', ()=>{
                if(opcoes.owner instanceof Array || opcoes.owner instanceof Set)
                {
                    for(const own of opcoes.owner)
                    {
                        this.fetchUser(own).then(usuario => console.log('[SUCESSO] Membro '+usuario.username+' setado com sucesso'))
                        .catch(() => console.log('[ERRO] não foi possível encontrar o ID do membro'))
                    }
                }else{
                    this.fetchUser(opcoes.owner).then(usuario => console.log('[SUCESSO] Membro '+usuario.username+' setado com sucesso'))
                    .catch(() => console.log('[ERRO] não foi possível encontrar o ID do membro'))
                }
            })
        }
    }

    /**
     *{@link FranklinClient#donos}
     * @type {?Array<User}
     * @readonly
     */

    get donos()
    {
        if(!this._donos) return null;
        return this._donos;
    }

    get prefixo()
    {
        if(typeof this._prefix === 'undefined' || this._prefix === null) return this._prefix;
        return this._prefix;
    }
    
    set prefixo(prefix)
    {
        this._prefix = prefix;
        this.emit('commandPrefixChange', null, this._prefix)
    }

 

    owner(user)
    {
        if(!this._donos) return false;
        user = this.resolver.resolveUser(user);
        if(!user) throw new RangeError('Invalido parametro usuario');
        if(this._donos instanceof Set) return this._donos.includes(user.id);
    }


 
}

module.exports = FranklinClient;