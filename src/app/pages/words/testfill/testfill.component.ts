import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vcblry } from 'src/app/classes/vcblry';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VocabularyService } from 'src/app/services/vocabulary.service';

@Component({
  selector: 'app-testfill',
  templateUrl: './testfill.component.html',
  styleUrls: ['./testfill.component.css']
})
export class TestfillComponent implements OnInit {
  currentWord: Vcblry | undefined;
  wordAry: Vcblry[];
  wIndex: number = 1;
  total: number | undefined;
  exWord: string | undefined;
  errCount = 0;
  message = "";
  errCorrect = '';
  redoFlag = false;
  hideWord='';
  chiHint= false;
  constructor(private router: Router,
    private wordService: VocabularyService,
    private authService: AuthenticationService) {
    this.wordAry = JSON.parse(authService.getPrjItem('exWords'));
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/general/login');
    }
    this.currentWord = this.wordAry[this.wIndex - 1];
    //console.log(this.currentWord.sentence);
    if (!this.currentWord.sentence) {
      this.getSentence();
    }
  }

  reset() {
    this.wIndex=1;
    this.errCount=0;
    this.redoFlag=false;
    this.errCorrect="";
    this.message='';
    this.currentWord = this.wordAry[this.wIndex - 1];
    if (!this.currentWord.sentence) {
      this.getSentence();
    }
    this.total = this.wordAry.length;
    //this.speakEng();
  }

  onEnter() {
    this.errCorrect='';
    this.chiHint=false;
    if (this.exWord === this.currentWord!.eng) {
      this.message = "正確";
      this.errCorrect = '';
    } else {
      this.message = "錯誤";
      this.errCount++;
      this.errCorrect = `${this.currentWord!.eng}(${this.currentWord!.chi})`;
    }

    if (this.wIndex === this.wordAry.length) {
      const score = Math.floor(((this.wordAry.length - this.errCount) / this.wordAry.length) * 100);
      this.message = `測驗結束，分數：${score}`;
      this.redoFlag = true;
      //this.reset();
    } else {
      this.wIndex++;
      this.currentWord = this.wordAry[this.wIndex - 1];
      if (!this.currentWord.sentence) {
        this.getSentence();
      }
    }
    //console.log(this.exWord);
    this.exWord = '';
  }

  getSentence() {
    //console.log('go fetch eng '+ this.currentWord.eng);
    const wd =this.currentWord!.eng;
    this.wordService.getASentence(wd).then(x => {
      //console.log(x);
      const y = x as {word:string};
      //console.log(this.hideWord+'martin');
      const kWord=y.word.indexOf(this.currentWord!.eng) > -1 ?  this.currentWord!.eng : this.currentWord!.eng.charAt(0).toUpperCase()+ this.currentWord!.eng.substr(1);
      this.currentWord!.eng=kWord;
      this.getHideWord(kWord,(hWord: string)=>{
        this.currentWord!.sentence =y.word.replace(kWord, hWord);
      });

    }).catch(err => {
      this.message = err;
      console.log(err);
    });
  }

  getHideWord(kWord:string, callback: { (hWord: string): void; (arg0: string): void; }){
    //console.log(kWord);
    //const endchar =;
    if(kWord.length > 5){
      this.hideWord=kWord.substr(0,1);
      for(let i =1; i<= kWord.length; i++){
        if(i === (kWord.length)){
          this.hideWord += kWord.substr(kWord.length-1);
          callback(this.hideWord);
        } else {
          this.hideWord += '_';
        }        
      }      
    } else {
      this.hideWord='_';
      for(let i =1; i<= kWord.length; i++){
        if(i === (kWord.length)){
          this.hideWord +='_';
          callback(this.hideWord);
        } else {
          this.hideWord += '_';
        }        
        }        
    }
  }

  hint(){
    this.chiHint=!this.chiHint;
  }
}
