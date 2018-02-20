/**@module parseBody
 * 
 */

 const qs = require('querystring');

function parseBody(req,res,callback){
    var chunks = [];
    req.on('data', function(data){
        chunks.push(data);
    });
    req.on('error', function(err){
        console.log(err);
        res.statusCode = 500;
        res.end("ServerError");
    });
    req.on('end', function(){
        var buffer = Buffer.join(chunks);
        
        switch(req.headers['content-type'].split(';')) {
            case "multiplart/form-data":
                var match = /boundary=(.+);?/.exec(req.headers['content-type']);
                req.body = parseMultipartBody(buffer, match[1]);
                callback(req,res);
                // if(err){
                //     res.statusCode = 400;
                //     res.end("badRequest");

                // }
                return;
            case "application/x-www-form-urlencoded":
                req.body(qs.parse(buffer.toString()));
                callback(req,res);
                return;
            case "application/json":
                req.body = JSON.parse(buffer.toString());
                callback(req,res);
                return;
            case "text/plain":
                req.body = buffer.toString();
                callback(req,res);
                return;
            default:
                res.statusCode = 400;
                res.end("bad request");

        }
    })
}

function parseMultipartBody(buffer, boundary){
    
}