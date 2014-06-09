var net = require('net');
var timeout = 20000;//��ʱ
var listenPort = 800;//�����˿�

var server = net.createServer(function(socket){
    // ���ǻ��һ������ - �������Զ�����һ��socket����
    console.log('connect: ' +
        socket.remoteAddress + ':' + socket.remotePort+", "+socket["host"]);
    for(var i in socket){
		if( typeof(socket[i])== "object"){
			 console.log(i+":"+socket[i]);
		}
	}

    socket.setEncoding('binary');

    //��ʱ�¼�
//    socket.setTimeout(timeout,function(){
//        console.log('���ӳ�ʱ');
//        socket.end();
//    });

    //���յ�����
    socket.on('data',function(data){

        console.log('recv:' + data);

    });

    //���ݴ����¼�
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //�ͻ��˹ر��¼�
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);

    });


    socket.write("fdsfdsfsd");
	socket.end();
}).listen(listenPort);

//�����������¼�
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//�����������¼�
server.on("error",function(exception){
    console.log("server error:" + exception);
}); 