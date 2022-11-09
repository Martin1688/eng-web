import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../classes/user';
import { AuthenticationService } from '../../../services/authentication.service';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-changepws',
  templateUrl: './changepws.component.html',
  styleUrls: ['./changepws.component.css']
})
export class ChangepwsComponent implements OnInit {
  oldPassword='';
  newPassword='';
  public credentials:User = {
    name: '',
    email: '',
    password: '',
    role: 'client',
    grade: '初級',
    memo: '',
    signdate: '',
    keep: true
  };
  public formError: string = '';
  oldPasswordTextType=true;
  passwordTextType=true;
  newPasswordTextType=true;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.credentials = this.authService.getCurrentUser();
  }
  onChangePassword(){
    if(!this.credentials.password || !this.oldPassword || !this.newPassword){
      this.formError="所有欄位都必填";
    } else if(this.credentials.password !== this.newPassword){
      this.formError="新密碼與再確認密碼必須相同";
    } else{
      this.generalService.changepws(this.credentials, this.oldPassword)
      .then((x) => { 
        const {message} = x;
        this.formError=message;
        //document.location.reload();
        // this.authenticationService.getCurrentUser();
        setTimeout(() => {
           this.router.navigateByUrl('/general/selfuserset');          
        }, 200);       
      })
      .catch((message) => {
        this.formError = message
      });

    }
  }

  setNewPasswordText(){
    this.newPasswordTextType=!this.newPasswordTextType;
  }

  setPasswordText(){
    this.passwordTextType=!this.passwordTextType;
  }

  setOldPasswordText(){
    this.oldPasswordTextType=!this.oldPasswordTextType;
  }

}
