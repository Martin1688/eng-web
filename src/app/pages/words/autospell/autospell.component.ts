import { Component, OnInit } from '@angular/core';
import { Vcblry } from 'src/app/classes/vcblry';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subject, interval } from 'rxjs';

@Component({
  selector: 'app-autospell',
  templateUrl: './autospell.component.html',
  styleUrls: ['./autospell.component.css']
})
export class AutospellComponent implements OnInit {
  currentWord: Vcblry;
  wordAry: Vcblry[];
  wIndex: number = 1;
  total: number | undefined;
  exWord: string | undefined;
  totalRpt: string = "3";
  rptCount = 1;
  message = "";
  utterTW: SpeechSynthesisUtterance | undefined;
  utterboy: SpeechSynthesisUtterance | undefined;
  uttergirl: SpeechSynthesisUtterance | undefined;
  playSubject: Subject<Vcblry> | undefined;
  charDelayTime = 1100;
  iswork4Show = false;
  iswork4ShowText= "播放";
  iswork = false;
  btnSuspenseText = "播放";
  constructor(private authService: AuthenticationService) {
    this.wordAry = JSON.parse(authService.getPrjItem('exWords'));
    this.totalRpt = this.authService.getPrjItem('repCount');
    this.currentWord = this.wordAry[this.wIndex - 1];
    //this.playSubject = new Subject<Vcblry>();
  }

  ngOnInit(): void {
    this.initBoy();
    this.initGirl();
    this.initTW();
  }
  initTW() {
    this.utterTW = new SpeechSynthesisUtterance();
    this.utterTW.lang = 'zh-TW';
    this.utterTW.rate = 0.9;
    this.utterTW.pitch = 1;
  }

  initBoy() {
    this.utterboy = new SpeechSynthesisUtterance();
    this.utterboy.lang = 'en-US';
    //this.utterboy.lang = 'en-GB';
    this.utterboy.rate = 1;
    this.utterboy.pitch = 1;
  }

  initGirl() {
    this.uttergirl = new SpeechSynthesisUtterance();
    //this.uttergirl.lang = 'en-GB';
    this.uttergirl.lang = 'en-US';
    this.uttergirl.rate = 1;
    this.uttergirl.pitch = 1;
  }

  playWord() {
    if (!this.iswork4Show) return;
    if (!this.iswork) return;
    if (this.currentWord) {
      setTimeout(() => {
        this.spellEng();
      });
    }
  }
  spellEng() {
    this.utterboy!.text = this.currentWord.eng;
    speechSynthesis.speak(this.utterboy!);
    let sEng = '';
    const oEng = this.currentWord.eng;
    for (let i = 0; i < oEng.length; i++) {
      sEng += oEng.charAt(i) + ',';
    }
    if (this.rptCount % 2 === 0) {
      this.uttergirl!.text = sEng;
      speechSynthesis.speak(this.uttergirl!);
    } else {
      this.utterboy!.text = sEng;
      speechSynthesis.speak(this.utterboy!);
    }
    this.utterTW!.text = this.currentWord.chi;
    speechSynthesis.speak(this.utterTW!);
    this.utterTW!.onend = () => {
      this.endFun();
    }


  }

  endFun() {

    if (this.rptCount < parseInt(this.totalRpt)) {
      this.rptCount = this.rptCount + 1;
      document.getElementById('suspenseBtn')!.click();
      setTimeout(() => {
        document.getElementById('suspenseBtn')!.click();
      }, 1000);
  } else {
      if (this.wIndex < this.wordAry.length) {
        this.wIndex = this.wIndex + 1;
        this.rptCount = 1;
        this.currentWord = this.wordAry[this.wIndex - 1];
        document.getElementById('suspenseBtn')!.click();
        setTimeout(() => {
          document.getElementById('suspenseBtn')!.click();
        }, 1000);
        //this.playWord();
      } else {
        this.wIndex = this.wIndex + 1;
        this.rptCount = 1;
        this.currentWord = this.wordAry[this.wIndex - 1];
      }
    }

  }



  suspense() {
    //console.log(this.dateStr());
    this.iswork4Show = !this.iswork4Show;
    //this.currentWord = this.wordAry[this.wIndex - 1];
    if (this.iswork4Show) {
      this.iswork4ShowText = "暫停";
      this.playWord();
    } else {
      this.iswork4ShowText = "撥放";
    }
  }

  suspenseShow(){
    //console.log(this.dateStr());
    this.iswork = !this.iswork;
    //this.currentWord = this.wordAry[this.wIndex - 1];
    if (this.iswork) {
      this.iswork4Show= this.iswork;
      this.btnSuspenseText = "暫停";
      this.playWord();
    } else {
      this.btnSuspenseText = "撥放";
    }

  }


  dateStr(): string {
    const date = new Date();
    const str = ("00" + (date.getMonth() + 1).toString()).slice(-2) + "/" +
      ("00" + date.getDate().toString()).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("00" + date.getHours().toString()).slice(-2) + ":" +
      ("00" + date.getMinutes().toString()).slice(-2) + ":" +
      ("00" + date.getSeconds().toString()).slice(-2);
    return str;
  }
}
