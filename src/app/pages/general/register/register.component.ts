import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { HistoryService } from '../../../services/history.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public formError: string = '';
  public credentials = {
    name: '',
    email: '',
    password: '',
    role: 'client',
    grade: '初級',
    memo: '',
    signdate: '',
    keep: true
  };
  passwordTextType = true;
  password2TextType = true;
  password2content='';
  hgt: string='62';
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService) { }

  ngOnInit(): void {
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
    this.passwordTextType = !this.passwordTextType;
  }
  setPassword2Text() {
    this.password2TextType = !this.password2TextType;
  }
  public onRegisterSubmit(): void {
     //console.log(this.credentials);
    const pws2 = this.password2content;
    //console.log(pws2);
    this.formError = '';
    if (
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError = '全部欄位都是必填，請再試一次';
    } else if (pws2 !== this.credentials.password) {
      this.formError = '密碼與確認密碼必須相同';
    }
    else {
      this.doRegister();
    }
  }
  private doRegister(): void {
    this.authenticationService.register(this.credentials)
      .then(() => this.router.navigateByUrl(this.historyService.getLastNonLoginUrl()))  //() => this.router.navigateByUrl(this.historyService.getLastNonLoginUrl())
      .catch((message) => this.formError = message);
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
