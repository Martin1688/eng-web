import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vcblry } from 'src/app/classes/vcblry';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VocabularyService } from 'src/app/services/vocabulary.service';

class ChiAns {
  chiary:string[] = [];
  ans: number | undefined;
  chilist = (str: string, chi: string) => {
    this.chiary = str.split(',');
    this.ans = parseInt(this.chiary[3]);
    this.chiary[3] = this.chiary[this.ans];
    this.chiary[this.ans] = chi;
  };
  selectChi: number | undefined;
  ok = (ans: number | undefined, selectChi: number | undefined) => {
    return ans === selectChi;
  };
}
@Component({
  selector: 'app-testselectchi',
  templateUrl: './testselectchi.component.html',
  styleUrls: ['./testselectchi.component.css']
})
export class TestselectchiComponent implements OnInit {
  message = '';
  //selectAns='';
  currentWord: Vcblry | undefined;
  wordAry: Vcblry[] = [];
  wIndex: number = 1;
  currentChiAns: ChiAns | undefined;
  ChiAnsList: ChiAns[] = [];
  errCount = 0;
  errCorrect = '';
  redoFlag=false;
  utterThis :SpeechSynthesisUtterance | undefined;   
  constructor(private router: Router,
    private authService: AuthenticationService,
    private wordService: VocabularyService) {
    this.wordAry = JSON.parse(authService.getPrjItem('exWords'));
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/general/login');
    }    this.currentWord = this.wordAry[this.wIndex-1];
    this.seizeChiStr();
    this.utterThis= new SpeechSynthesisUtterance();
    this.utterThis.lang = 'en-US'
    this.utterThis.rate = 0.9;  //0.1~10
    this.utterThis.pitch = 1; //0~2
    this.speakEng();
  }

  speakEng(){
    if(this.currentWord){
      this.utterThis!.text=this.currentWord.eng;
      speechSynthesis.speak(this.utterThis!);  
    } else {
      this.message = this.wIndex.toString();
    }
  }

  seizeChiStr() {
    //console.log()
    const tIndex = this.wIndex - 1;
    if (this.ChiAnsList.length < this.wIndex) {
      this.wordService.seizeChiStr(1).then(x => {
        const ary = x as [1];
        //console.log(ary[0]);
        this.ChiAnsList.push(new ChiAns());
        this.ChiAnsList[tIndex].chilist(ary[0].toString(), this.currentWord!.chi);
        this.currentChiAns = this.ChiAnsList[tIndex];
        //console.log(this.currentChiAns.chiary);
      });
    } else {
      this.currentChiAns = this.ChiAnsList[tIndex];
      //console.log(this.currentChiAns.chiary);
    }

  }

  onSelected(i: number | undefined) {
    this.currentChiAns!.selectChi = i;

    if (this.currentChiAns!.ok(this.currentChiAns!.ans, this.currentChiAns!.selectChi)) {
      this.message = "正確";
      this.errCorrect = '';
    } else {
      this.errCount++;
      this.message = "錯誤";
      this.errCorrect = `${this.currentWord!.eng}(${this.currentWord!.chi})`;
    }
    if (this.wIndex === this.wordAry.length) {
      const score= Math.floor(((this.wordAry.length - this.errCount)/this.wordAry.length)*100);
      this.message = `測驗結束，分數：${score}`;
      this.redoFlag=true;
    } else {
      //this.wIndex++;
      this.currentWord = this.wordAry[this.wIndex++];
      this.seizeChiStr();
      this.speakEng();
    }
  }
  reset(){
    this.wIndex=1;
    this.currentWord=this.wordAry[0];
    this.errCount=0;
    this.redoFlag=false;
    this.seizeChiStr();
    this.errCorrect="";
    this.message='';
  }

}
