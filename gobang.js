class Gobang {
    constructor() {
        this.players= [];          //玩家列表
        this.checkerBoard=[];     //棋盘
        this.colorList=['white','black'];   //棋子颜色
        this.gaming=false;        //标识游戏状态
        this.turn='black';        //标志当前落子颜色
    }
    /* 
        创建玩家
     */
    createPlayer(socket){
         let playersCount=this.players.length;
         if(playersCount >=2) return false;

         let player={
            socket,
            color: this.colorList.pop()
         }

         this.players.push(player);
         socket.player=player;

         return true;
    }

    /* 初始化棋盘 */
    init(){
        for(var i = 0; i < 15; i++){
            this.checkerBoard[i] = [];
            for(var j = 0; j < 15; j++){
                this.checkerBoard[i][j] = {
                    state:0,
                    type:true
                };
            }
        }

        this.gaming=true;
    }

    /* 玩家离开 */
    leftGame(socket) {
        if(!socket.player) return;

        this.players.forEach((item,index)=>{
            if(item.color==socket.player.color){
                this.colorList.push(item.color);
                this.players.splice(index, 1);
            }
        });
    }

    /* 放置棋子 
    */
    putChess(x,y) {
        this.checkerBoard[x][y].state=1;
        this.checkerBoard[x][y].type=this.turn;
        this.turn=(this.turn=='black'?'white':'black');
    }

    gameover(x, y){
        return this.checkAllDirect(x ,y);
    }
    
    /* 判断一个棋子所有方向上是否有满足五子棋胜利的情况 */
    checkAllDirect(x ,y) {
        let tpx=x, tpy=y;
        let type=this.checkerBoard[x][y].type;
        let count =0;
    
        //正斜线判断
        while(tpx>-1&&tpy>-1&&this.checkerBoard[tpx][tpy].type==type){
            tpx--;
            tpy--;
            count++;//累加左上
        }
        tpx=x+1, tpy=y+1;
        while(tpx<15&&tpy<15&&this.checkerBoard[tpx][tpy].type==type){
            tpx++;
            tpy++;
            count++;//累加右下
        }
        if(count>=5) return true; //获胜

        //反斜线判断
        tpx=x, tpy=y, count=0;
        while(tpx>-1&&tpy<15&&this.checkerBoard[tpx][tpy].type==type){
            tpx--;
            tpy++;
            count++;//累加左下
        }
        tpx=x+1, tpy=y-1;
        while(tpx<15&&tpy<15&&this.checkerBoard[tpx][tpy].type==type){
            tpx++;
            tpy--;
            count++;//累加右上
        }
        if(count>=5) return true; //获胜

        //横向判断
        tpx=x, tpy=y, count=0;
        while(tpx>-1&&this.checkerBoard[tpx][tpy].type==type){
            tpx--
            count++;//累加左侧
        }
        tpx=x+1;
        while(tpx<15&&this.checkerBoard[tpx][tpy].type==type){
            tpx++;
            count++;//累加右侧
        }
        if(count>=5) return true; //获胜

        //竖直方向
        tpx=x, tpy=y, count=0;
        while(tpy>-1&&this.checkerBoard[tpx][tpy].type==type){
            tpy--
            count++;//累加左侧
        }
        tpy=y+1;
        while(tpy<15&&this.checkerBoard[tpx][tpy].type==type){
            tpy++;
            count++;//累加右侧
        }
        if(count>=5) return true; //获胜

        return false;
    }

}

module.exports=Gobang;