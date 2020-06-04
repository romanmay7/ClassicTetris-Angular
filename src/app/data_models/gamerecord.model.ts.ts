

export class GameRecord {

    score: number;
    playerName: string ;
    date: string ;

    constructor (_score: number,_playerName:string,_date:string) {
      this.score = _score;
      this.playerName=_playerName;
      this.date=_date;
  }
  }