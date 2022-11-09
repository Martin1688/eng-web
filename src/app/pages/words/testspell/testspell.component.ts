import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vcblry } from 'src/app/classes/vcblry';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-testspell',
  templateUrl: './testspell.component.html',
  styleUrls: ['./testspell.component.css']
})
export class TestspellComponent implements OnInit {
  currentWord:Vcblry | undefined;
  wordAry:Vcblry[];
  wIndex:number=1;
  total:number | undefined;
  exWord:string | undefined;
  errCount=0;
  message="";
  errCorrect='';
  redoFlag=false;
  utterThis :SpeechSynthesisUtterance | undefined; 
  constructor(private router: Router,private authService:AuthenticationService) {
    this.wordAry = JSON.parse(authService.getPrjItem('exWords'));

   }

   ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigateByUrl('/general/login');
    }    
    this.utterThis= new SpeechSynthesisUtterance();
    //this.utterThis.lang='zh-TW';
    //this.utterThis.lang = 'en-GB'
    this.utterThis.lang = 'en-US'
    //this.utterThis.text = engText;
    this.utterThis.rate = 0.9;  //0.1~10
    this.utterThis.pitch = 1; //0~2
    this.checkSuport();
    this.reset();
  }

  checkSuport(){
    if(speechSynthesis)
    {
      this.message="瀏覽器支援英文發音";
    } else{
      this.message="瀏覽器不支援英文發音，改用Chrome";
    }
  }

  speakEng(){
    if(this.currentWord){
      this.utterThis!.text=this.currentWord.eng;
      speechSynthesis.speak(this.utterThis!);  
    } else {
      this.message = this.wIndex.toString();
    }
  }

  reset(){
    this.wIndex=1;
    this.currentWord = this.wordAry[this.wIndex -1];
    this.total = this.wordAry.length;
    this.errCount=0;
    this.errCorrect='';
    this.redoFlag=false;
    this.speakEng();
  }

  onEnter(){
    if(this.exWord === this.currentWord!.eng)
    {
      this.message="正確";
      this.errCorrect='';
    } else {
      this.message="錯誤";
      this.errCount++;
      this.errCorrect = `${this.currentWord!.eng}(${this.currentWord!.chi})`;
    }

    if(this.wIndex === this.wordAry.length){
      const score= Math.floor(((this.wordAry.length - this.errCount)/this.wordAry.length)*100);
      this.message=`測驗結束，分數：${score}`;
      this.redoFlag=true;
      //this.reset();
    } else {
      this.wIndex++;
      this.currentWord = this.wordAry[this.wIndex -1];
      this.speakEng();
    }
    //console.log(this.exWord);
    this.exWord='';
  }

  repeat() {
    if (this.currentWord) {
      this.utterThis!.text = this.currentWord.eng;
      speechSynthesis.speak(this.utterThis!);
    }
  }

}
