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


  constructor() { }

  ngOnInit() {

    this.N=10;
    this.M=20;

    this.Scale=40;
    this.fieldWidth=this.Scale*this.N;
    this.fieldHeight=this.Scale*this.M;
    
    var tetramino_type1:number[][]=[ [0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]] 
    var tetramino_type2:number[][]=[ [0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]
    var tetramino_type3:number[][]=[ [0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]]
    var tetramino_type4:number[][]=[ [0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
    var tetramino_type5:number[][]=[ [0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]]  

    //Once the component has initialized, we’ll have access to the Canvas DOM node, as well
    //as its drawing context:
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
    this.ctx.fillStyle = 'lightgrey';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);

    this.drawGameFieldLines();
    
    this.ctx.fillStyle = 'yellow';

    for(var i=0;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(tetramino_type3[j][i]==1)
        {
          this.ctx.fillRect((this.initX+i)*this.Scale, (this.initY+j)*this.Scale, 40, 40);
          

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

}
