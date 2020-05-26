import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {

    //In the component class, we can use the @ViewChild() decorator to inject a reference to the canvas.
    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;
  
    title = 'ClassicTetris-Angular';

      //Game Screen Dimensions

      N:number;  //number of Cells in the Row
      M:number;  //number of Rows

      Scale:number;
      fieldWidth:number;
      fieldHeight:number;

      initX=3
      initY=0

      isRunning=true;
      framesPerSecond = 2;

      gameField: Cell[][]

      tetramino_type1:number[][]=[ [0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]] 
      tetramino_type2:number[][]=[ [0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]
      tetramino_type3:number[][]=[ [0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]]
      tetramino_type4:number[][]=[ [0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
      tetramino_type5:number[][]=[ [0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] 
      
      tetraminoTypes:number[][][]

      currentTetramino:number[][]

      


  constructor() { }

  ngOnInit() {

    this.N=10;
    this.M=20;

    this.Scale=40;
    this.fieldWidth=this.Scale*this.N;
    this.fieldHeight=this.Scale*this.M;
    
    this.tetraminoTypes=[this.tetramino_type1,this.tetramino_type2,this.tetramino_type3,this.tetramino_type4,this.tetramino_type5]

    //Once the component has initialized, we’ll have access to the Canvas DOM node, as well
    //as its drawing context:
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
    this.initializeBrickWall();

    this.currentTetramino=this.tetraminoTypes[this.randomTetraminoType()]

    this.ctx.fillStyle = 'lightgrey';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight); 
    this.drawGameFieldLines();
    this.drawBrickWall();

    requestAnimationFrame(()=>this.animate(this.ctx));
    
  }

  initializeBrickWall()
  {
    this.gameField=new Array<Array<Cell>>();
    for(var n=0;n<this.N;n++)
    {
      let row:Cell[]  = new Array<Cell>(); 
      this.gameField.push(row)

      for(var m=0;m<this.M;m++)
      {
        this.gameField[n][m]=new Cell();
        if(m!=this.M-1)
        {
          this.gameField[n][m].value=0
          this.gameField[n][m].color='lightgrey'
        }
        else
        {
          this.gameField[n][m].value=1
          this.gameField[n][m].color='blue'
        }

        
      }

    }    

  }

  drawBrickWall()
  {
    for(var n=0;n<this.N;n++)
    {
      for(var m=0;m<this.M;m++)
      {
        if(this.gameField[n][m].value==1)
        {
          this.ctx.fillStyle = this.gameField[n][m].color;
          this.ctx.fillRect((n)*this.Scale, (m)*this.Scale, 40, 40);
        }
      }
    }

  }

  drawLine(x1: number,y1: number,x2: number,y2: number)
  {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }

  drawGameFieldLines()
  {
    for( var i=0;i<this.fieldWidth;i+=this.Scale)
    {
      
       this.drawLine(i,0,i,this.fieldHeight);
    }

    for( var j=0;j<this.fieldHeight;j+=this.Scale)
    {
      
       this.drawLine(0,j,this.fieldWidth,j);
    }

  }

  randomTetraminoType():number
  {
    var randomIndex=Math.floor(Math.random() * this.tetraminoTypes.length);
    console.log("Index:"+randomIndex)
    return  randomIndex
  }

  drawTetramino()
  {

    this.ctx.fillStyle = 'yellow';

    for(var i=0;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(this.currentTetramino[j][i]==1)
        {
          this.ctx.fillRect((this.initX+i)*this.Scale, (this.initY+j)*this.Scale, 40, 40);
          

        }

      }

    }

  }

  eraseTetramino()
  {

    this.ctx.fillStyle = 'lightgrey';

    for(var i=0;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(this.currentTetramino[j][i]==1)
        {
          this.ctx.fillRect((this.initX+i)*this.Scale, (this.initY+j)*this.Scale, 40, 40);
          

        }

      }

    }

  }

  moveTetramino(gcntxt:CanvasRenderingContext2D)
  {
    //moving Tetramino's initY Coordinate down,maiking it to fall down
    if(!this.checkColission())
    {
      this.initY=this.initY + 1
    }
    else
    {
      this.buildWallPiece()
   
    }

    
  }

  checkColission():boolean
  {
    for(var i=0;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(this.currentTetramino[j][i]==1)
        {
           if(this.gameField[this.initX+i][this.initY+j+1].value==1)
           {
             return true
           }
        }

    }

  }
}

buildWallPiece()
{

  for(var i=0;i<4;i++)
  {
    for(var j=0;j<4;j++)
    {
      if(this.currentTetramino[j][i]==1)
      {
         this.gameField[this.initX+i][this.initY+j].value=1
         this.gameField[this.initX+i][this.initY+j].color='blue'
  
      }

  }

}
this.drawBrickWall()  
this.initX=3
this.initY=0
this.currentTetramino=this.tetraminoTypes[this.randomTetraminoType()]

}

ifGameOver():boolean
{
  for(var n=0;n<this.N;n++)
  {
    if(this.gameField[n][0].value==1)
    return true;
  }
}


  animate(graphicsContext:CanvasRenderingContext2D): void 
  {
    
    

     var timeout = setTimeout(()=>{
       
            this.drawBrickWall()  
            this.drawTetramino();
            this.eraseTetramino()
            this.moveTetramino(graphicsContext);
            this.drawTetramino();

            if(this.ifGameOver()){
              clearInterval(timeout);
              alert("GameOver!");
            }
            else{requestAnimationFrame(()=>(this.animate(graphicsContext)));}
                    
    
        }, 1000 / this.framesPerSecond);

        
  }

}

export class Cell 
{
  value:number;
  color:string;
}

