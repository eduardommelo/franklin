const fk = require('../../plugins/index');

class lookup extends fk.Comando{

    constructor(franklin)
    {
        super(franklin, {
            nome_comando: 'lookup',
            alternativas: ['vconta', 'lkp', 'verconta'],
            plugin_grupo: 'moderacao',
            label: ['<@mention>', '[@mention]', '[@mention]', '[@mention]', '[até 25 ids...]'],
            descricao_comando: 'Verificar dados do cache do membro especificado.',
            hasPermission: ['VIEW_AUDIT_LOG'],
            mePermission: ['VIEW_AUDIT_LOG']
        })

        this.client = franklin;
    }

    async runComando(message, args)
    {

        const membro = args.slice(0).join(' ');
 

        if(!membro)
        {
            message.reply(`<:no:557599389292429315> **|** informe o argumento obrigatório \`@membto/id\`.`);
            message.channel.stopTyping(true);
            return;
        }
        const mb = membro.split(' ');
        let membros_array = [];
        if(mb.length >= 2)
        {
            const fetchLists = typeof mb[0].replace(/[^0-9]/g,'') == 'undefined' ? 0 : mb[0].replace(/[^0-9]/g,'');
            this.client.fetchUser(fetchLists, true).catch(err => {
    
                message.reply(`<:no:557599389292429315> **|** Este membro não se encontra no cache ou não é um **ID** válido.`);
                message.channel.stopTyping(true);
                return;
            });
            if(mb.length > 25){
                message.reply(`<:no:557599389292429315> **|** Poderá ser selecionado somente 25 ids/menções.`);
                message.channel.stopTyping(true);
                return;
            };
            for(let i=0;i<mb.length;i++)
            {

             
              let c =typeof mb[i].replace(/[^0-9]/g,'') == 'undefined' ? 0 : mb[i].replace(/[^0-9]/g,'');
              if(c == 0) {
                message.reply(`<:no:557599389292429315> **|** Um dos **IDS/menção** estão inválidos.`);
                message.channel.stopTyping(true);
                  return;
              };
             
               if(mb[i] == mb[i+1]){
                message.reply(`<:no:557599389292429315> **|** Você definiu um dos **IDS** iguais.`);
                message.channel.stopTyping(true);
                return;
               }
               this.client.fetchUser(c, true).then(usuarios =>{

                let data_contat = usuarios.createdAt.toString();
                let date_gett = data_contat.split(" ");;
                let horas_datat = date_gett[4].split(":");
                let mes_datat = date_gett[1];
                let mes_finalt = '';
                if (mes_datat == 'Jan') { mes_finalt = 'janeiro' }
                if (mes_datat == 'Feb') { mes_finalt = 'fevereiro' }
                if (mes_datat == 'Mar') { mes_finalt = 'março' }
                if (mes_datat == 'Apr') { mes_finalt = 'abril' }
                if (mes_datat == 'May') { mes_finalt = 'maio' }
                if (mes_datat == 'Jun') { mes_finalt = 'junho' }
                if (mes_datat == 'Jul') { mes_finalt = 'julho' }
                if (mes_datat == 'Aug') { mes_finalt = 'agosto' }
                if (mes_datat == 'Sep') { mes_finalt = 'setembro' }
                if (mes_datat == 'Oct') { mes_finalt = 'outubro' }
                if (mes_datat == 'Nov') { mes_finalt = 'novembro' }
                if (mes_datat == 'Dec') { mes_finalt = 'dezembro' }
        
                let data_conta_mmebrot = date_gett[2] + ' de ' + mes_finalt + ' de ' + date_gett[3] + ' ás ' + `${horas_datat[0]} horas e ${horas_datat[1]} minutos`;

                        const membro_data = usuarios.createdTimestamp;
                        const data_atual = (new Date()).getTime();
                        const dif = membro_data - data_atual;
                        const atual = dif/(24 * 60 * 60 * 1000)
                        const criada_conta = parseInt((atual*-1)+1);
                        membros_array.push({
                            id: usuarios.id,
                            data: data_conta_mmebrot,
                            image_url: usuarios.avatarURL == null ? usuarios.defaultAvatarURL : usuarios.avatarURL,
                            tag_user : usuarios.tag,
                            dias: criada_conta
                        });
                
                        if(mb.length != membros_array.length) return;
                                    
            let paginas = 0;
            message.reply({
                embed:{
                    author:{
                        icon_url: membros_array[paginas].image_url,
                        name: membros_array[paginas].tag_user,
                        url: membros_array[paginas].image_url
                    },
                    thumbnail:{
                        url: membros_array[paginas].image_url,
                        width: 2048
                    },
                    color: 0x2191ce,
                    fields:[
                        {
                            name: `<:id_conta:588507651973971968> ID Membro`,
                            value: `${membros_array[paginas].id}`
                        },
                        {
                            name: `<:created:588507704528601118> Conta criada`,
                            value: `${membros_array[paginas].data} (${membros_array[paginas].dias} dias).`
                        }
                    ],
                    footer:{
                        icon_url : message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                        text:`Requisitado por: ${message.author.tag} | Página: ${paginas}/${membros_array.length-1}`
                    },
                    timestamp: new Date()
                }
            }).then( r =>{
                r.react('◀').then(() =>{
                r.react('▶')
                })

                const r_frente = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
                const r_tras = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                const frente = r.createReactionCollector(r_frente, {time: 1000* 3600});
                const tras = r.createReactionCollector(r_tras,  {time: 1000* 3600});
    
                frente.on('collect', em =>{
                    paginas++;
                    em.remove(message.author.id).catch(O_o =>{})
                 
           
                   
                    if(paginas == membros_array.length)
                    {
                        paginas = membros_array.length-1;

                        return;
                    }
                    
                    r.edit({
                        embed:{
                            author:{
                                icon_url: membros_array[paginas].image_url,
                                name: membros_array[paginas].tag_user,
                                url: membros_array[paginas].image_url
                            },
                            thumbnail:{
                                url: membros_array[paginas].image_url,
                                width: 2048
                            },
                            color: 0x2191ce,
                            fields:[
                                {
                                    name: `<:id_conta:588507651973971968> ID Membro`,
                                    value: `${membros_array[paginas].id}`
                                },
                                {
                                    name: `<:created:588507704528601118> Conta criada`,
                                    value: `${membros_array[paginas].data} (${membros_array[paginas].dias < 0 ? '' : membros_array[paginas].dias+' dias'}).`
                                }
                            ],
                            footer:{
                                icon_url : message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                                text:`Requisitado por: ${message.author.tag} | Página: ${paginas}/${membros_array.length-1}`
                            },
                            timestamp: new Date()
                        }
                    })
                })
                tras.on('collect', em =>{
                    em.remove(message.author.id).catch(O_o =>{})
                    paginas--;
                    if(paginas < 0){
                        paginas = 0;
                        return;
                    }
                  
                    r.edit({
                        embed:{
                            author:{
                                icon_url: membros_array[paginas].image_url,
                                name: membros_array[paginas].tag_user,
                                url: membros_array[paginas].image_url
                            },
                            thumbnail:{
                                url: membros_array[paginas].image_url,
                                width: 2048
                            },
                            color: 0x2191ce,
                            fields:[
                                {
                                    name: `<:id_conta:588507651973971968> ID Membro`,
                                    value: `${membros_array[paginas].id}`
                                },
                                {
                                    name: `<:created:588507704528601118> Conta criada`,
                                    value: `${membros_array[paginas].data}  (${membros_array[paginas].dias < 0 ? '' : membros_array[paginas].dias+' dias'}).`
                                }
                            ],
                            footer:{
                                icon_url : message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                                text:`Requisitado por: ${message.author.tag} | Página: ${paginas}/${membros_array.length-1}`
                            },
                            timestamp: new Date()
                        }
                    })
                })
            });
            message.channel.stopTyping(true)
            
             
               }).catch( err =>{
                message.reply(`<:no:557599389292429315> **|** Um dos **IDS** não foi encontrado no cachê ou no banco de dados.`);
                message.channel.stopTyping(true);
                
             
               });
          
            }
            return;
        }

        const fetchMembro = typeof membro.replace(/[^0-9]/g,'') == 'undefined' ? 0 : membro.replace(/[^0-9]/g,'');
        this.client.fetchUser(fetchMembro, true).then( usuario =>{

            let data_conta = usuario.createdAt.toString();
            let date_get = data_conta.split(" ");;
            let horas_data = date_get[4].split(":");
            let mes_data = date_get[1];
            let mes_final = '';
            if (mes_data == 'Jan') { mes_final = 'janeiro' }
            if (mes_data == 'Feb') { mes_final = 'fevereiro' }
            if (mes_data == 'Mar') { mes_final = 'março' }
            if (mes_data == 'Apr') { mes_final = 'abril' }
            if (mes_data == 'May') { mes_final = 'maio' }
            if (mes_data == 'Jun') { mes_final = 'junho' }
            if (mes_data == 'Jul') { mes_final = 'julho' }
            if (mes_data == 'Aug') { mes_final = 'agosto' }
            if (mes_data == 'Sep') { mes_final = 'setembro' }
            if (mes_data == 'Oct') { mes_final = 'outubro' }
            if (mes_data == 'Nov') { mes_final = 'novembro' }
            if (mes_data == 'Dec') { mes_final = 'dezembro' }
    
            let data_conta_mmebro = date_get[2] + ' de ' + mes_final + ' de ' + date_get[3] + ' ás ' + `${horas_data[0]} horas e ${horas_data[1]} minutos`;

            const membro_data = usuario.createdTimestamp;
            const data_atual = (new Date()).getTime();
            const dif = membro_data - data_atual;
            const atual = dif/(24 * 60 * 60 * 1000)
            const criada_conta = parseInt((atual*-1)+1);
            message.reply({
                embed:{
                    author:{
                        icon_url: usuario.avatarURL == null ? usuario.defaultAvatarURL : usuario.avatarURL,
                        name: usuario.tag,
                        url: usuario.avatarURL == null ? usuario.defaultAvatarURL : usuario.avatarURL
                    },
                    thumbnail:{
                        url: usuario.avatarURL == null ? usuario.defaultAvatarURL : usuario.avatarURL,
                        width: 2048
                    },
                    color: 0x2191ce,
                    fields:[
                        {
                            name: `<:id_conta:588507651973971968> ID Membro`,
                            value: `${usuario.id}`
                        },
                        {
                            name: `<:created:588507704528601118> Conta criada`,
                            value: `${data_conta_mmebro} (${criada_conta} dias).`
                        }
                    ],
                    footer:{
                        icon_url : message.author.avatarURL == null ? message.author.defaultAvatarURL : message.author.avatarURL,
                        text:`Requisitado por: ${message.author.tag}`
                    },
                    timestamp: new Date()
                }
            });
            message.channel.stopTyping(true);


        }).catch( err =>{
            message.reply(`<:no:557599389292429315> **|** Este membro não se encontra no cache ou não é um **ID** válido.`);
            message.channel.stopTyping(true);
            return;
        })

    }
}

module.exports = lookup;