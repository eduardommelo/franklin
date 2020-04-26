const auth = require('./auth.json');

let mongo = (franklin) =>{
    let mongoose = require('mongoose');
        mongoose.connect(auth.mongo, {useNewUrlParser: true,useUnifiedTopology:true });
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Erro de conexão:'));
        db.once('open', function() {
            franklin.connectedMongoDB = 1
            console.log('\033[34m[MongoDB] \033[mConectado com sucesso')
        });
}

module.exports = mongo;