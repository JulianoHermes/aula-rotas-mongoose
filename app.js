var http = require('http');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pos-unoesc');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('Erro de conexao', err);
});
db.on('open',function(){
    console.log('conoexao aberta');
});
db.on('connected',function(err){
    console.log('Conectado');
});
db.on('disconnected',function(err){
    console.log('Desconectado');
});

var Schema = mongoose.Schema;

var json_schema={
    name: {type:String, default:''}
    ,description: {type:String, default:''}
    ,alcohol:  {type:Number, min:0}
    ,price:  {type:Number, min:0}
    ,category: {type:String, default:''}
    ,created_at: {type:Date, default:Date.now}
};

var BeerSchema = new Schema(json_schema);

var Beer = mongoose.model('Beer', BeerSchema);

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
        ,model = new Beer(dados)
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

        Beer.find(query, function(err, data){
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

        Beer.update(query, mod, optional, function(err, data){
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
        var query={name: /Skol/i}
        ,msg ='';

        Beer.remove(query, function(err,data){
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