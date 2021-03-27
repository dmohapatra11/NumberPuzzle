import { Component, Input, OnInit } from "@angular/core";
import { timer } from "rxjs";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  @Input() boardSize;
  @Input() numShufflesStart;

  public board: any = {};
  audio: HTMLAudioElement;
  clickData: any = [];
  source: any;
  historyIndex: number;
  constructor() { }

  ngOnInit() {
    this.initialiseBoard(this.boardSize);
    this.randomShuffle(2000);
  }



  public initialiseBoard(boardSize) {
    this.board = [];
    for (let i = 0; i < boardSize; i++) {
      if (!this.board[i]) {
        this.board[i] = {};
      }
      for (let j = 0; j < boardSize; j++) {
        this.board[i][j] = {
          val: (boardSize * i) + j + 1,
          class: ''
        }
      }
    }
  }

  public randomShuffle(count) {
    for (let i = 0; i < count; i++) {
      let row = Math.ceil(this.boardSize * Math.random()) - 1;
      let column = Math.ceil(this.boardSize * Math.random()) - 1;
      this.startShuffle(row, column);
    }
  }

  public startShuffle(row, col, audio?) {
    if (this.checkRotationFlex(this.board, +row, +col)) {
      if (audio) {
        this.playAudioForSuccess();
      }
      row = +row;
      col = +col;
      let a = this.board[row][col];
      this.board[row][col].class = 'rotate-start';
      let b = this.board[row + 1][col];
      this.board[row + 1][col].class = "rotate-start";
      let c = this.board[row][col + 1];
      this.board[row][col + 1].class = "rotate-start";
      let d = this.board[row + 1][col + 1];
      this.board[row + 1][col + 1].class = "rotate-start";
      this.board[row][col] = b;
      this.board[row][col + 1] = a;
      this.board[row + 1][col + 1] = c;
      this.board[row + 1][col] = d;
      this.clickData.push([row, col]);
    } else {
      if (audio) {
        this.playAudioForFailure();
      }
      this.board[row][col].class = 'rotate-invalid';
      setTimeout(() => {
        this.resetColor();
      }, 200);
    }
    setTimeout(() => {
      this.resetColor();
    }, 200);
  }

  public solve() {
    while (this.clickData && this.clickData.length > 0) {
      this.clickData.reverse();
      this.acRotateSingle(this.clickData[0]);
      this.clickData.shift();
      this.clickData.reverse();
    }
  }



  public acRotateSingle(pointData) {
    let row = pointData[0];
    let col = pointData[1];
    // setTimeout(() => {
    let a = this.board[row][col];
    this.board[row][col].class = 'rotate-reverse';
    let b = this.board[row + 1][col];
    this.board[row + 1][col].class = "rotate-reverse";
    let c = this.board[row][col + 1];
    this.board[row][col + 1].class = "rotate-reverse";
    let d = this.board[row + 1][col + 1];
    this.board[row + 1][col + 1].class = "rotate-reverse";
      this.board[row][col] = c;
      this.board[row + 1][col] = a;
      this.board[row][col + 1] = d;
      this.board[row + 1][col + 1] = b;
      this.resetColor();

    // }, 2000);
  }

  public resetColor() {
    for (let i = 0; i < Object.keys(this.board).length; i++) {
      for (let j = 0; j < Object.keys(this.board[i]).length; j++) {
        this.board[i][j].class = '';
      }
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  private checkRotationFlex(board, row, col) {
    return (
      board[row][col + 1] &&
      board[row + 1] &&
      board[row + 1][col] &&
      board[row + 1][col + 1]
    );
  }


  private playAudioForSuccess() {
    this.audio = new Audio();
    this.audio.src = "../../../assets/audio/beep.wav";
    this.audio.load();
    this.audio.play();
  }

  private playAudioForFailure() {
    this.audio = new Audio();
    this.audio.src = "../../../assets/audio/fail.wav";
    this.audio.load();
    this.audio.play();
  }

  public backInHistory() {
    if (!this.historyIndex) {
      this.acRotateSingle(this.clickData[this.clickData.length - 1]);
      this.historyIndex = this.clickData.length - 1;
    } else if (this.historyIndex - 1 >= 0) {
      this.acRotateSingle(this.clickData[this.historyIndex - 1]);
      this.historyIndex = this.historyIndex - 1;
    }
  }
  
  public forwardInHistory() {
    if (this.historyIndex) {
      this.startShuffle(this.clickData[this.historyIndex + 1][0], this.clickData[this.historyIndex + 1][1]);
      this.historyIndex = this.historyIndex + 1;
    }
  }

  setBoardSize(item) {
    this.clickData = [];
    this.historyIndex = null;
    this.initialiseBoard(item);
    this.randomShuffle(2000); 
  }
}
