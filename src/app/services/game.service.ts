import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { GameRecord } from '../data_models/gamerecord.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { GlobalVariable } from '../../global';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { DatePipe } from '@angular/common';
import { GameRecord } from '../data_models/gamerecord.model.ts';
import { GlobalVariable } from 'src/global';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  gamescore:number=0;
  scoresOnRowComplete=15;
  
  curr_TetraminoTypeIndex:number
  next_TetraminoTypeIndex:number=0

  tetraminoType_images:string[]=["tetraminoType-01.png","tetraminoType-02.png","tetraminoType-03.png","tetraminoType-04.png","tetraminoType-05.png"]

  highscores:GameRecord[]
  playerName:string="Anonymous";

  constructor(private router: Router,private http: HttpClient,public datepipe: DatePipe) { }

  incrementScore()
  {
    this.gamescore+=this.scoresOnRowComplete;
  }

  resetScore()
  {
    this.gamescore=0;
  }
//--------------------------------------------------------------------------------------------------------------------------------
  async gameOver()
  {
    alert("Game Over,your Score is:"+this.gamescore)
    
    //If Player's  Score is greater than smallest 'score' in Top 10 Array
    //Send User's Game Record with Player's Score to 'HighScores API'

    if(this.gamescore>this.highscores[9].score)
    {
        this.playerName = prompt("Please enter your name", "Anonymous");
        let date=Date.now();
        let current_date =this.datepipe.transform(date, 'dd/MM/yyyy');
    
        let currentGameRecord=new GameRecord(this.gamescore,this.playerName,current_date.toString())
        await this.saveHighScore(currentGameRecord);
    }

    this.resetScore();
    this.router.navigate(["/"])
    setTimeout(function(){ window.location.reload(); }, 500);

  }
//---------------------------------------------------------------------------------------------------------------------------------
  async loadHighScores()
   {
    this.highscores = await this.http.get<GameRecord[]>(GlobalVariable.BASE_API_URL+"api/HighScores/GetHighScoresList3",).toPromise();
   }
//---------------------------------------------------------------------------------------------------------------------------------

  saveHighScore(score:GameRecord)
   {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    
    this.http.post<any>(GlobalVariable.BASE_API_URL+"api/HighScores/AddNewRecord3", JSON.stringify(score),{ 'headers': headers }).subscribe(data => {
    console.log("Your Score was saved on Server");


    })
   }
//-----------------------------------------------------------------------------------------------------------------------------------   
}
