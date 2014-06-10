var net = require('net');
var dns = require('dns');
var timeout = 20000;//超时
var listenPort = 80;//监听端口

var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('connect: ' +
        socket.remoteAddress + ':' + socket.remotePort+", "+socket["host"]);

    //socket.setEncoding('binary');

    //超时事件
//    socket.setTimeout(timeout,function(){
//        console.log('连接超时');
//        socket.end();
//    });

    //接收到数据
    socket.on('data',function(heads){

        console.log('recv:' + heads);
		var head=getHeads(heads.toString());

		var REMOTE_ADDR=head['Host'];
 console.log('REMOTE_ADDR:' + REMOTE_ADDR);
 //REMOTE_ADDR="www.baidu.com";

       var port=80;
		if(REMOTE_ADDR.charAt(0)=='1' ||REMOTE_ADDR.charAt(0)=='2'){
			var index=REMOTE_ADDR.indexOf(':');
			if(index>-1){
				port=parseInt(REMOTE_ADDR.substring(index+1,REMOTE_ADDR.length));
				REMOTE_ADDR=REMOTE_ADDR.substring(0,index);
			}
		}
        dns.lookup(REMOTE_ADDR,null,function(err,addr,family){
		 
			console.log('addr:' + addr);
			var serviceSocket = new net.Socket();
			// serviceSocket.setEncoding('binary');
			 console.log('port:' + port);	 console.log('addr:' + addr);
			serviceSocket.connect(port, addr, function () {
				console.log('>> From proxy to remote',heads);
				serviceSocket.write(heads);
			});
			serviceSocket.on("data", function (data) {
				console.log('<< From remote to proxy',data);
				socket.write(data);
				console.log('>> From proxy to client');
			});
		}
		);
		

    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);

    });
	//socket.end();
}).listen(listenPort);

//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
}); 

function getHeads(head){
	var result=new Object();
	var index=0;
	for (var line in head.split('\n') ){
		 index=line.indexof();
         result
	}
}

function getHeads(head){
	var h="Host:";
	var result=new Object();
	var index=0;
	index=head.indexOf(h,0);
    result["Host"]=head.substring(index+h.length,head.indexOf("\n",index)).replace(" ","");
	return result;
}