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


  constructor() { }

  ngOnInit() {

    this.N=10;
    this.M=30;
    this.Scale=40;
    this.fieldWidth=this.Scale*this.N;
    this.fieldHeight=this.Scale*this.M;

    //Once the component has initialized, we’ll have access to the Canvas DOM node, as well
    //as its drawing context:
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
    this.ctx.fillStyle = 'lightgrey';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);

    this.drawGameFieldLines();

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
