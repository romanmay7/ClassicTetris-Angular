import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-highscores-list',
  templateUrl: './highscores-list.component.html',
  styleUrls: ['./highscores-list.component.css']
})


export class HighscoresListComponent implements OnInit {

  headers=new Array("Rank","Name","Score","Date")
  highscores_list;

  constructor(private gameService:GameService) { }

 async ngOnInit() {
    await this.gameService.loadHighScores();
    this.highscores_list=this.gameService.highscores;
  }

}
