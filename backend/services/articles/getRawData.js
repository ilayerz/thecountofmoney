function getElem(obj ,path){
    const pathPieces = path.split('/');
    let res = obj;
    pathPieces.forEach(piece => {
      res = res[piece];
    });
    return res;
  }

module.exports = exports =

async function (link){

    const parser = require('xml2js').parseString;

    var request = require('request');

    return new Promise(function(resolve, reject){

        request(link,function(err,res,body){
            if(err){
                reject(err);
            }
    
            parser(body,function(err, res){
                if(err){
                    reject(err);
                }
    
            resolve(res);
            });           
        });


    })


    }