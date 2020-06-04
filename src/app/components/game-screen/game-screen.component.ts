import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { DeviceDetectorService } from 'ngx-device-detector';

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

      initX:number=3
      initY:number=0

      isRunning=true;
      framesPerSecond = 4;
      direction=0;

      gameField: Cell[][]

      tetramino_type1:number[][]=[ [0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]] 
      tetramino_type2:number[][]=[ [0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]
      tetramino_type3:number[][]=[ [0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]]
      tetramino_type4:number[][]=[ [0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
      tetramino_type5:number[][]=[ [0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] 
      
      tetraminoTypes:number[][][]
      currentTetramino:number[][]



      tetramino_colors:string[]=["yellow","green","orange","brown","violet","lightblue"]
      currentTetraminoColor:string;

      removingOperationActive:boolean=false;

      


  constructor(private gameservice:GameService,private deviceService: DeviceDetectorService) { }

  ngOnInit() {

    if(this.deviceService.isDesktop()||this.deviceService.isTablet()) {

      this.N=10;
      this.M=20;
  
      this.Scale=40;
      this.fieldWidth=this.Scale*this.N;
      this.fieldHeight=this.Scale*this.M;

      this.framesPerSecond = 4;
    }
  
    else if(this.deviceService.isMobile())
    {
      this.N=10;
      this.M=18;
  
      this.Scale=40;
      this.fieldWidth=this.Scale*this.N;
      this.fieldHeight=this.Scale*this.M;

      this.framesPerSecond = 3;
    }
      
    
    this.tetraminoTypes=[this.tetramino_type1,this.tetramino_type2,this.tetramino_type3,this.tetramino_type4,this.tetramino_type5]

    //Once the component has initialized, we’ll have access to the Canvas DOM node, as well
    //as its drawing context:
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
    this.initializeBrickWall();
    
    var random1=Math.floor(Math.random() * this.tetraminoTypes.length);
    var random2=Math.floor(Math.random() * this.tetraminoTypes.length);

    this.gameservice.curr_TetraminoTypeIndex=random1
    this.gameservice.next_TetraminoTypeIndex=random2

    this.currentTetramino=this.tetraminoTypes[random1]

    

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight); 
    //this.drawGameFieldLines(); //for DEV Only
    this.drawBrickWall();
    this.currentTetraminoColor=this.tetramino_colors[this.randomTetraminoColor()]

    requestAnimationFrame(()=>this.animate(this.ctx));
    
  }
  
    //Listening to key events
    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
      console.log(event);
    
      var key = event.keyCode;
      console.log(key);
      
      switch(key)
       {
        case 32: if(this.direction!=3) {this.framesPerSecond=15; setTimeout(()=>this.framesPerSecond=4,400); break;} //Temporary Speed Up on Pressing 'Space' Key
        case 40: if(this.direction!=3) {this.framesPerSecond=15; setTimeout(()=>this.framesPerSecond=4,400); break;} //Temporary Speed Up on Pressing 'Down' Key
        case 83: if(this.direction!=3) {this.framesPerSecond=15; setTimeout(()=>this.framesPerSecond=4,400); break;} //Temporary Speed Up on Pressing 'S' Key
        case 39: if((this.direction!=1)&&(!this.checkRightColission())) this.direction=1; break; //Right on Pressing 'Right Arrow Key' Key
        case 37: if((this.direction!=2)&&(!this.checkLeftColission()))this.direction=2; break; //Left on Pressing 'Left Arrow Key' Key
        case 68: if((this.direction!=1)&&(!this.checkRightColission())) this.direction=1; break; //Right on Pressing 'D' Key
        case 65: if((this.direction!=2)&&(!this.checkLeftColission()))this.direction=2; break; //Left on Pressing 'A' Key
        case 38: if(this.allowRotation()&&(!this.checkColission()))this.rotateTetramino90Clockwise(); break; //Up  on Pressing 'Up Arrow Key' Key
        case 87: if(this.allowRotation()&&(!this.checkColission()))this.rotateTetramino90Clockwise(); break; //Up on Pressing 'W' Key
       }
    }

       //Listening to click events
       @HostListener('window:click', ['$event'])
       clickEvent(event: MouseEvent) {
         console.log(event);
       
         var positionX = event.clientX;
         var positionY = event.clientY;
         console.log("positionX:"+positionX+",HEAD-x:"+((this.initX*this.Scale)+40));
         console.log("positionY:"+positionY+",HEAD-y:"+this.initY*this.Scale);
         
         if((positionX>((this.initX*this.Scale)+this.Scale))&&(positionX<=((this.initX+3)*this.Scale)))
         {
          if(this.allowRotation()&&(!this.checkColission()))
          {
            this.rotateTetramino90Clockwise();
          }
           console.log("ROTATE");
         }


         if((positionX>(this.initX*this.Scale)+40))
           {
              this.direction=1;  //right
              console.log("GO RIGHT");
           }
          else if(positionX<=(this.initX*this.Scale)+40)
           {
             this.direction=2; //left
             console.log("GO LEFT");
           }

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
          this.gameField[n][m].color='black'
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
    if(!this.removingOperationActive)
    {
      for(var n=0;n<this.N;n++)
       {
         for(var m=0;m<this.M;m++)
          {
            if(this.gameField[n][m].value==1)
             {
               this.ctx.fillStyle = this.gameField[n][m].color;
               this.ctx.fillRect((n)*this.Scale, (m)*this.Scale, 40, 40);
               this.ctx.strokeStyle = 'black';
               this.ctx.strokeRect((n)*this.Scale, (m)*this.Scale, 40, 40);
             }
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

  randomTetraminoType()
  {
    var randomIndex=Math.floor(Math.random() * this.tetraminoTypes.length);
   //console.log("Type Index:"+randomIndex)
   this.gameservice.curr_TetraminoTypeIndex= this.gameservice.next_TetraminoTypeIndex
   this.gameservice.next_TetraminoTypeIndex=randomIndex;
    
  }

  randomTetraminoColor():number
  {
    var randomIndex=Math.floor(Math.random() * this.tetramino_colors.length);
    //console.log("Color Index:"+randomIndex)
    return  randomIndex
  }

  drawTetramino()
  {

    this.ctx.fillStyle = this.currentTetraminoColor;

    for(var i=0;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(this.currentTetramino[j][i]==1)
        {
          this.ctx.fillRect((this.initX+i)*this.Scale, (this.initY+j)*this.Scale, 40, 40);
          this.ctx.strokeStyle = 'black';
          this.ctx.strokeRect((this.initX+i)*this.Scale, (this.initY+j)*this.Scale, 40, 40);
          

        }

      }

    }

  }

  eraseTetramino()
  {

    this.ctx.fillStyle = 'black';

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

  makeTetraminoFall(gcntxt:CanvasRenderingContext2D)
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

  moveTetramino()
  {
    //moving Tetramino
    
    if(this.direction==1)
    {
      if(this.initX+this.findTetraminoRightEdge()<=8)
      {
      this.initX=this.initX + 1
      console.log("X:"+this.initX);
      this.direction=0;
      }
    }
    if(this.direction==2)
    {
       var leftEdge=this.findTetraminoLeftEdge();

      if((leftEdge>0)&&(this.initX-leftEdge>=-3))
      {
        console.log("X before is:"+this.initX);
        this.initX=this.initX - 1
        console.log("X is:"+this.initX);
        this.direction=0;

      }
      else if((leftEdge==0)&&(this.initX-leftEdge>0))
       {
        this.initX=this.initX - 1
        console.log("X:"+this.initX);
        this.direction=0;
       }
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
  return false;
}

checkRightColission():boolean
{
  for(var i=0;i<4;i++)
  {
    for(var j=0;j<4;j++)
    {
      if(this.currentTetramino[j][i]==1)
      {
         if(this.gameField[this.initX+i+1][this.initY+j+1].value==1)
         {
           return true
         }
      }

  }

}

return false;
}

checkLeftColission():boolean
{
  for(var i=0;i<4;i++)
  {
    for(var j=0;j<4;j++)
    {
      if(this.currentTetramino[j][i]==1)
      {
         if(this.gameField[this.initX+i-1][this.initY+j+1].value==1)
         {
           return true
         }
      }

  }

}

return false;
}

allowRotation():boolean
{
  if(this.direction==0)
  {
    return true
  }
  if(this.direction==1)
  {
    if(this.initX+this.findTetraminoRightEdge()<=8)
    {
        return true
    }
    else return false;
  }
  else if(this.direction==2)
  {
     var leftEdge=this.findTetraminoLeftEdge();

    if((leftEdge>0)&&(this.initX-leftEdge>=-1))
    {
      return true

    }
    else if((leftEdge==0)&&(this.initX-leftEdge>0))
     {
      return true
     }
     else return false;
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
         this.gameField[this.initX+i][this.initY+j].color=this.currentTetraminoColor
  
      }

  }
  this.drawBrickWall();

}
this.drawBrickWall()

//Initialize new Tetramino Piece
this.initX=3
this.initY=0
this.randomTetraminoType()
this.currentTetramino=this.tetraminoTypes[this.gameservice.curr_TetraminoTypeIndex]
this.currentTetraminoColor=this.tetramino_colors[this.randomTetraminoColor()]

}

findTetraminoLeftEdge():number
{
  var leftEdgeCoordinate=2
  for(var i=0;i<4;i++)
  {
    for(var j=0;j<4;j++)
    {
      if(this.currentTetramino[i][j]==1)
      {
         if (j==0)
          {
            //console.log("Left Position:"+0);
            return 0;
          }
         if(j<leftEdgeCoordinate)
          {
            //console.log("currentTetramino["+i+"]["+j+"]="+this.currentTetramino[i][j]+",j:"+j+"< leftEdgeCoordinate:"+leftEdgeCoordinate)
            leftEdgeCoordinate=j;
          } 
     }
    }  
}
//console.log("Left Pos:"+leftEdgeCoordinate);
return leftEdgeCoordinate;
}

findTetraminoRightEdge():number
{
  var rightEdgeCoordinate=0
  for(var i=0;i<4;i++)
  {
    for(var j=3;j>0;j--)
    {
      if((this.currentTetramino[i][j]==1)&&(j==3))
      {
        return 3;

      }
      else if((this.currentTetramino[i][j]==1)&&(j>rightEdgeCoordinate)) 
      {
        rightEdgeCoordinate=j;
      }
    }
}
console.log("Right:"+rightEdgeCoordinate);
return rightEdgeCoordinate;
}


// Function to Rotate the Tetramiino(Matrix 4x4) 90 Degrees Clockwise 
 rotateTetramino90Clockwise() 
{ 
    //Tetramino is 4x4 Matrix 
    var N=4;
    // Traverse each Cycle 
    //console.log("BEFORE");
   // this.printTetraminoMatrix();
    for (var i = 0; i < N / 2; i++) { 
        for (var j = i; j < N - i - 1; j++) { 
  
            // Swap elements of each Cycle 
            // in Clockwise Direction 
            var temp = this.currentTetramino[i][j]; 
            this.currentTetramino[i][j] = this.currentTetramino[N - 1 - j][i]; 
            this.currentTetramino[N - 1 - j][i] = this.currentTetramino[N - 1 - i][N - 1 - j]; 
            this.currentTetramino[N - 1 - i][N - 1 - j] = this.currentTetramino[j][N - 1 - i];
            this.currentTetramino[j][N - 1 - i] = temp;  
            this.eraseTetramino();        
        } 
        this.drawTetramino();
        this.eraseTetramino();
        
    } 
    //console.log("AFTER");
    //this.printTetraminoMatrix();
} 
// Function for Print Tetraminoe's Matrix 
 printTetraminoMatrix() 
{ 
    for (var i = 0; i < 4; i++) { 
        for (var j = 0; j < 4; j++) 
        {   
          console.log("Row:"+i);
            console.log(this.currentTetramino[i][j]+" "); 
           
        }
    } 
} 

ifGameOver():boolean
{
  for(var n=0;n<this.N;n++)
  {
    if(this.gameField[n][0].value==1)
    return true;
  }
}

checkForCompleteRows()
{
  var rowComplete=false;

  for(var m=0;m<this.M-1;m++)
  {
    if(rowComplete)
    break;

    for(var n=0;n<this.N;n++)
    {
      if(this.gameField[n][m].value==0)
      {
        break;
      }
      if(n==this.N-1)
      {
        console.log("The Row "+m+"is Complete!");
        rowComplete=true;
        this.gameservice.incrementScore();
        this.highLightRow(m);
        if(!this.removingOperationActive)
        {
          
          this.removeRow(m);
          
        }
        
        
      }
    }
  }

}

highLightRow(rowNum:number)
{

    for(var n=0;n<this.N;n++)
    {
      //this.ctx.fillStyle = 'lightgreen';
     // this.ctx.fillRect((n)*this.Scale, (rowNum)*this.Scale, 40, 40);
     // this.ctx.strokeStyle = 'black';
     // this.ctx.strokeRect((n)*this.Scale, (rowNum)*this.Scale, 40, 40);
      
      this.gameField[n][rowNum].color='lightgreen'

      
    }
    this.drawBrickWall();
    return true;
  }



removeRow(rowNum:number)
{
        //console.log("Remove ROW:"+rowNum)
        this.highLightRow(rowNum);//Highlight the Completed Row to be removed
      
        this.removingOperationActive=true;

          for(var m=rowNum;m>0;m--)
          {
            for(var n=0;n<this.N;n++)
            {
              //console.log("SWAP ROW:["+n+"]["+m+"]:"+this.gameField[n][m].value)
            this.gameField[n][m]=this.gameField[n][m-1]//swap rows to move them to position of the removed row

            }
        }
        this.removingOperationActive=false;
        
        //redraw modified Brick Wall,following removeRow() operation
        setTimeout(()=>{ this.ctx.fillStyle = 'black';
                          this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight); 
                          this.drawBrickWall()}, 300);   

}


  animate(graphicsContext:CanvasRenderingContext2D): void 
  {
    
     var timeout = setTimeout(()=>{

            this.checkForCompleteRows();
            //this.drawBrickWall();  
            this.drawTetramino();
            this.eraseTetramino()
            this.makeTetraminoFall(graphicsContext);
            this.moveTetramino();
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

