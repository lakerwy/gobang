var socket=io("http://192.168.1.110:3000");
var color='';

var chess=document.getElementById("chess");
var cxt=chess.getContext('2d');
var chressBord=[];
var turn='';
var restart=document.getElementById('restart');

socket.on('conn',data=>{
    console.log(data);
    color=data.color;

    let nowcolor=color;
    if(color=='white') nowcolor='白方';
    else if(color=='black') nowcolor='黑方';
    else nowcolor='观战者';
    document.getElementById('color').innerHTML=nowcolor;

    if(data.num==2) init();
});

socket.on('getCheckerBoard',data=>{
    console.log(data);
    chressBord=data.checkerboard;
    turn=data.turn;

    if(color==turn){
        chess.onclick=putChess;
    }else{
        chess.onclick=null;
    }
    
    for(var i=0; i<15; i++){
        for(var j=0; j<15; j++){
            if(chressBord[i][j].state==1){
                paintChress(i,j);
            }
        }
    }

    document.getElementById('tags1').innerHTML='现在轮到'+(turn=='black'?'黑棋':'白旗')+'落子';
});

socket.on('gameover',data=>{
    document.getElementById('tags1').style.color='red';
    document.getElementById('tags1').innerHTML=(data=='white'?'白旗':'黑棋')+'获胜';
    chess.onclick=null;
});

restart.onclick=function(){
    socket.emit('restart','start');
}
socket.on('rest',data=>{
    window.location.reload();
})

drawBord();

function init(){
    if (color==='null') return;
}

//画棋盘
function drawBord(){
    cxt.strokeStyle = "#aaa";
    for (var i = 0; i < 15; i++) {
        cxt.moveTo(25,25+i*50);
        cxt.lineTo(725,25+i*50);
        cxt.stroke();
        cxt.moveTo(25+i*50,25);
        cxt.lineTo(25+i*50,725);
        cxt.stroke();
    }
}

//点击棋盘生成棋子
function putChess(e){

    let x = Math.floor(e.offsetX / 50);
    let y = Math.floor(e.offsetY / 50);

    if(chressBord[x][y].state==0) {
        paintChress(x,y);

        socket.emit('putchess', {x,y})
    }
    
}
//画棋子
function paintChress(i,j){
    cxt.beginPath();
    //arc（圆心位置横坐标，圆心位置纵坐标，圆半径，起始角度，结束角度，是否逆时针）
    cxt.arc(25+i*50,25+j*50,20,0,2*Math.PI);
    // cxt.closePath();
    gradient =cxt.createRadialGradient(25+i*50+2,25+j*50-2,25,25+i*50,25+j*50,0);
    if (chressBord[i][j].type=='black') {
        gradient.addColorStop(0,"#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#D1D1D1");
        gradient.addColorStop(1,"#F9F9F9");
    }
    cxt.fillStyle = gradient;
    cxt.fill();
}






