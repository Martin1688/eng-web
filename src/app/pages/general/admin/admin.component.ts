import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GeneralService } from 'src/app/services/general.service';
import { VocabularyService } from 'src/app/services/vocabulary.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: User;
  setUser: User | undefined;
  uploadFileName = '';
  mailData: any[] = [];
  public formError: string = '';
  public credentials = {
    _id: '',
    name: '',
    email: '',
    password: '',
    role: 'client',
    grade: '初級',
    memo: '',
    signdate: '',
    keep: true
  };
  fileContent: any;
  mailList1: string[] | undefined;
  lastkeydown1: number = 0;
  retObj: { "ary": any; } | undefined;
  roleops = ['client', 'user', 'admin'];
  gradeops = ['初級', '中級', '中高級'];
  isMobile=false;
  constructor(private router: Router,
    private authService: AuthenticationService,
    private generalService: GeneralService,
    private wordsService: VocabularyService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/general/login');
    }
    this.lastkeydown1 = new Date().getTime();
    this.getAutoMails();
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.isMobile=true;
      //this.formError="mobile device";
    }else{
      this.isMobile=false;
      //this.formError="not mobile device";
    }

  }

  onSubmit() {
    //check parameters
    this.generalService.updateUser(this.credentials).subscribe({
      next:(data:any)=>{
        const { message } = data;
        this.formError = message;
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, data: string };
        this.formError = errResult.message;
      }
    })
    
    
  //   .then(
  //     data => {
  //       const { message } = data;
  //       this.formError = message;
  //     },
  //     error => {
  //       console.log("Something wrong here", error);
  //     });
  }

  onDelete(){
    this.generalService.deleteUser(this.credentials.email).subscribe({
      next:(data:any)=>{
        const { message } = data;
        this.formError = message;
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, data: string };
        this.formError = errResult.message;
      }
    });
    // .then(
    //   data => {
    //     const { message } = data;
    //     this.formError = message;
    //   },
    //   error => {
    //     console.log("Something wrong here", error);
    //   });

  }

  onEnter() {
    const temMail = this.credentials.email;
    if(!temMail){
      return;
    }
    this.generalService.getAUser(temMail).subscribe({
      next:(x:any)=>{
        const { grade, role, name, _id } = x;
      //this.credentials.email=email;
      this.credentials.grade = grade;
      this.credentials.name = name;
      this.credentials.role = role;
      this.credentials._id = _id;
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, data: string };
        console.log(errResult);
        //return false;
        this.formError = errResult.message;
      }
    })
    
    // .then(x => {
    //   const { grade, role, name, _id } = x;
    //   //this.credentials.email=email;
    //   this.credentials.grade = grade;
    //   this.credentials.name = name;
    //   this.credentials.role = role;
    //   this.credentials._id = _id;
    //   console.log(x);
    //   //console.log(this.credentials);
    //   //this.credentials = row ;
    // });
  }
  getAutoMails() {
    if(this.isMobile){
      return;
    }
    this.generalService.mailAutoComp().subscribe({
      next:(data)=>{
        this.retObj = data as { "ary": any };
        Object.assign(this.mailData, this.retObj.ary);

      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, data: string };
        this.formError = errResult.message;
      }
    })
    
    // then(
    //   data => {
    //     this.retObj = data as { "ary": any };
    //     Object.assign(this.mailData, this.retObj.ary);
    //     // setTimeout(() => {
    //     //   console.log(this.mailData);
    //     // }, 100);
    //   },
    //   error => {
    //     console.log("Something wrong here", error);
    //   });

  }

  getMailsFirstWay($event: { key: string; timeStamp: number; }) {
    if(this.isMobile){
      return;
    }    
    if($event.key ==='Enter'){
      return;
    }

    this.mailList1 = [];
    //    let wordId = (<HTMLInputElement>document.getElementById('WordIdFirstWay')).value.trim();
    const temMail = this.credentials.email;
    if (temMail.length == 0) {
      return ;
    }

    //console.log(temMail);
    if (temMail.length > 1) {
      const decision = this.lastkeydown1 - $event.timeStamp;
      //console.log(decision);
      if (decision > 100) {
        this.mailList1 = this.searchFromArray(this.mailData, temMail);
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

  itemSelected(item: string){
    this.credentials.email=item;
    this.mailList1=[];
    document.getElementById('email')!.focus();
    //this.onEnter();
  }

}
