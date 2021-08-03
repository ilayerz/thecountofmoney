function getElem(obj ,path){
    if(obj != null && path != null){
        const pathPieces = path.split('/');
        let res = obj;
        pathPieces.forEach(piece => {
        res = res[piece];
        });   
        return res;     
    }else{
        return null;
    }
  }

module.exports = exports =

async function (link, feed){

    const parser = require('xml2js').parseString;

    var request = require('request');

    return new Promise(function(resolve, reject){

        request(link,function(err,res,body){
    
            parser(body,function(err, res){
                if(err){
                    console.log(err);
                    reject(null);
                }
                
            const fd = getElem(res, feed.data.path);

            const items = getElem(fd, feed.data.itemspath);

            const icon = feed.data.icon;
    
            const title = feed.data.title; //Maybe replace with feed title

            resolve({title: title, id: feed.id, icon: icon ,articles: items, itemtitlepath: feed.data.itemtitlepath, itemlinkpath: feed.data.itemlinkpath, itemcreatorpath: feed.data.itemcreatorpath, itemdatepath: feed.data.itemdatepath, itemdescriptionpath: feed.data.itemdescriptionpath, itemimagepath: feed.data.itemimagepath});
            });           
        });


    })


    }