var http = require('http');

var Model=require('./model');

var Controller = {
    create: function(req,res){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var dados = {
            name:'Skol',
            description: 'Mijo de Rato',
            alcohol: 4.5,
            price: 3.0,
            category: 'pilsen'
        }
        ,model = new Model(dados)
        ,msg ='';

        model.save(function(err,data){
            if(err){
                console.log('Erro: ', err);
                msg = 'Erro: '+ err;
            }else{
                console.log('Cerveja Inserida: ',data);
                msg = 'Cerveja Inserida: '+ data;
            }
            res.end(msg);
        });
    },
    retrieve: function(req,res){
        var query={}
        ,msg ='';

        Model.find(query, function(err, data){
            if(err){
                console.log('Erro: ', err);
                msg = 'Erro: '+ err;
            }else{
                console.log('Listagem: ', data);
                msg = 'Lista de Cervejas: '+ data;
            }
            res.end(msg);
        });
    },
    update: function(req,res){
        var query={name: /skol/i}
        ,mod = {
            name: 'Brahma',
            alcohol: 4,
            price: 6,
            category: 'Pilsen'
        }
        ,optional = {
            upsert:false,
            multi: false
        }
        ,msg ='';

        Model.update(query, mod, optional, function(err, data){
            if(err){
                console.log('Erro: ', err);
                msg = 'Erro: '+ err;
            }else{
                console.log('Cerveja Alterada: ', data);
                msg = 'Cerveja Alterada: '+ data.n;
            }
            res.end(msg);
        });
    },
    delete: function(req,res){
        var query={name: /Brahma/i}
        ,msg ='';

        Model.remove(query, function(err,data){
            if(err){
                console.log('Erro: ', err);
                msg = 'Erro: '+ err;
            }else{
                console.log('Cerveja Deletada, quantidade: ', data.result);
                msg = 'Cerveja Deletada, quantidade: '+ data.result.n;
            }
            res.end(msg);
        });
    }

}

http.createServer(function (req, res) {

    var url = req.url;
    
    switch(url){
        case '/api/beers/create':
            Controller.create(req, res);
        break;

        case '/api/beers/retrieve':
            Controller.retrieve(req, res);
                
        break;
        case '/api/beers/update':
            Controller.update(req, res);
            
        break;
        case '/api/beers/delete':
            Controller.delete(req, res);
            
        break;
        default:
            res.end('SORRY, 404');
        break;
    }

}).listen(3000);

console.log('Server running at http://localhost:>3000/');