/* 
    启动聊天的服务端程序
*/
var app=require('express')()
var server=require('http').Server(app)
var io=require('socket.io')(server)

//启动服务器
//192.168.1.110
server.listen(3000,'192.168.1.110',(err)=>{
    if(err){
        console.error(err);
    }else{
        console.info("服务器启动成功1");
    }
})

app.use(require('express').static('public'))


//express处理静态资源
//把public目录设置为静态资源目录
app.get('/',function(req,res){
    res.redirect('/index.html')
})


//五子棋相关程序
var Gobang=require('./gobang.js');

var gobang=new Gobang();
io.on('connection',socket=>{ 
    if(gobang.createPlayer(socket)){
        //玩家数大于2时，棋盘初始化
        gobang.init();
        socket.emit('conn',{
            color: socket.player.color,
            num: gobang.players.length  
        });
        broadcast();
    }else{
        //游客
        socket.emit('conn',{
            color: 'null',
            num: gobang.players.length,
        });
        broadcast();
    }

    //断开连接
    socket.on('disconnect',()=>{
        gobang.leftGame(socket);
    });

    socket.on('putchess',data=>{
        console.log(data)
        gobang.putChess(data.x,data.y);
        broadcast();
        
        if(gobang.gameover(data.x,data.y)){
            io.sockets.emit('gameover',gobang.turn=='black'?'white':'black');
            gobang.init();
        }
    });

    socket.on('restart',data=>{
        gobang.init();
        io.sockets.emit('rest',data);
    })
});

function broadcast(){
    io.sockets.emit('getCheckerBoard',{
        turn: gobang.turn,
        checkerboard: gobang.checkerBoard
    })
}