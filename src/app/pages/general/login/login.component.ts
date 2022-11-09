import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  public credentials = {
    name: '',
    email: '',
    password: '',
    role:'client',
    grade:'初級',
    memo:'',
    signdate:'',
    keep: true
  };
  passwordTextType = true;
  hgt: string= "62";
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService) { }

  ngOnInit() {
    if(this.authenticationService.isLoggedIn()){
      if(this.authenticationService.isWordsSet()){
        this.router.navigateByUrl('/general/about');
      } else{
        this.router.navigateByUrl('/words');
      }
    }
    //console.log('login');
    const currentUser =this.authenticationService.getCurrentUser();
    //console.log(currentUser);
    this.credentials.email = this.authenticationService.getMail();
    this.credentials.name = this.authenticationService.getName();  

    this.adjustMemoHeight();
  }
  adjustMemoHeight() {
    if (this.credentials) {
      const elMemo = document.getElementById('password');
      const meDim = elMemo!.getBoundingClientRect();
      this.hgt = meDim.height.toString();
      //elMemo!.previousElementSibling!.setAttribute('height',  meHeight.toString()+'px');
      //console.log(this.hgt + 'px');
    }
  }

  setPasswordText() {
    //alert(this.passwordTextType);
    this.passwordTextType = !this.passwordTextType;
  }
    
  public onLoginSubmit(): void {
     //console.log(this.credentials);

    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = '全部欄位都必填';
    } else {
      this.doLogin();
    }
  }
  private doLogin(): void {
    this.credentials.name = this.credentials.name;
    this.authenticationService.login(this.credentials)
      .then((x) => { 
        //console.log(JSON.stringify(x));
        this.formError =`登入成功`;
        //document.location.reload();
        // this.authenticationService.getCurrentUser();
        setTimeout(() => {
          document.location.reload();
          //this.router.navigateByUrl('/general/about');
          //this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());          
        }, 1000);       
      })
      .catch((message) => {
        this.formError = message
      });
  }


  clearErr(): void {
    this.formError = '';
    this.credentials.name = '';
  }

  public captalCase(input: string): string {
    if (!input) {
      return '';
    } else {
      return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }
  }

}
