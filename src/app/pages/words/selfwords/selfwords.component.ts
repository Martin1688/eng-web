import { Component, OnInit, ɵfindLocaleData } from '@angular/core';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import { Vcblry } from 'src/app/classes/vcblry';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-selfwords',
  templateUrl: './selfwords.component.html',
  styleUrls: ['./selfwords.component.css']
})
export class SelfwordsComponent implements OnInit {
  message: string | undefined;
  wordData: any[] = [];
  retObj: { "ary": any; } | undefined;
  lastkeydown1: number = 0;
  subscription: any;
  wordList1: any[] | undefined;
  newWord: Vcblry = {
    wdId:'',
    eng:'',
    chi:'',
    grade:'',
    sentence:''
  };
  chiAry: string[] | undefined;
  wordAry: Vcblry[] = [];
  sentenceAry = [];
  isMobile=false;
  hgt: string = "62";
  //showBox=false;
  constructor(private authService: AuthenticationService,
    private wordService: VocabularyService) {
    //Get the user data from users.json

  }

  ngOnInit(): void {
    this.lastkeydown1 = new Date().getTime();
    //console.log(this.newWord);
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.isMobile=true;
      //this.formError="mobile device";
    }else{
      this.isMobile=false;
      //this.formError="not mobile device";
    }
    this.adjustMemoHeight();
  }
  adjustMemoHeight() {
    if (this.newWord) {
      const elMemo = document.getElementById('chi');
      const meDim = elMemo!.getBoundingClientRect();
      this.hgt = meDim.height.toString();
      //elMemo!.previousElementSibling!.setAttribute('height',  meHeight.toString()+'px');
      //console.log(this.hgt + 'px');
    }
  }



  getAutoWords(chr: string) {
    if(this.isMobile){
      return;
    }
    this.wordService.getAutoComp(chr).subscribe({
      next:(data:any)=>{
        //console.log(data);
        //this.retObj = data as { "ary": any };
        //Object.assign(this.wordData, this.retObj.ary);
        Object.assign(this.wordData, data);

      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, token: string };
        console.log("Something wrong here : ",errResult.message);
      }
  }

      
      // data => {
      //   this.retObj = data as { "ary": any };
      //   Object.assign(this.wordData, this.retObj.ary);
      //   // setTimeout(() => {
      //   //   console.log(this.wordData);
      //   // }, 10);
      // },
      // error => {
      //   console.log("Something wrong here", error);
      // }
      
      );

  }


  getWordIdsFirstWay($event: { key: string; timeStamp: number; }):any {
    if(this.isMobile){
      // if($event.key === 'Enter'){
      //   return this.onEnter();
      // } else {
      //   return;
      // }    
      return;  
    } else if($event.key ==='Enter'){
      return;
    }
    this.wordList1 = [];
//    let wordId = (<HTMLInputElement>document.getElementById('WordIdFirstWay')).value.trim();
    const wordId= this.newWord.eng;
    if (wordId.length == 0) {
      return false;
    }
    else if (wordId.length == 1) {
      this.getAutoWords(wordId);
    }
    //console.log(wordId);
    if (wordId.length > 1) {
      const decision = this.lastkeydown1 - $event.timeStamp;
      //console.log(decision);
      if (decision > 100) {
        this.wordList1 = this.searchFromArray(this.wordData, wordId);
        //this.showBox=true;
        //console.log(this.wordList1);
      }
    }
  }

  searchFromArray(arr: string | any[], regex: string) {
    let matches = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches;
  }
 
  onEnter() {
    //this.message='Enter detected';
    let wordId = (<HTMLInputElement>document.getElementById('WordIdFirstWay')).value.trim();
    // // this.wordService.getSentence(wordId).then(x => {
    // //   //console.log(x);
    // //   this.sentenceAry=x as [];
    // //   setTimeout(() => {
    // //     if(this.sentenceAry){
    // //       this.newWord.sentence=this.sentenceAry[0];
    // //     } 
    // //   }, 100);

    // // }).catch(err => {
    // //   this.message = err;
    // // });
     this.wordService.getAWord(wordId).subscribe(x => {
      //console.log(x);
      const { row } = x as { row: any };
      //console.log(row);
      if(row){
        //this.message += ' and API called'  
        this.newWord = row as Vcblry;
      } else {
        const {error}=x as {error:any};
        this.message = error;
      }
    });
    this.wordList1=[];
  }

  itemSelected(item: string){
    this.newWord.eng=item;
    this.wordList1=[];
    document.getElementById('WordIdFirstWay')!.focus();
    setTimeout(() => {
      this.onEnter();
    }, 100);
    
  }

  Add2List() {
    this.wordAry.push(this.newWord);
    this.newWord =  {
      wdId:'',
      eng:'',
      chi:'',
      grade:'',
      sentence:''
    };
    this.message='';
    this.sentenceAry=[];
    //(<HTMLInputElement>document.getElementById('WordIdFirstWay')).value='';
  }
  Save2Local() {
    //console.log('save');
    this.authService.setPrjItem("exWords", JSON.stringify(this.wordAry));
    this.wordAry=[];
    return false;
  }
}
