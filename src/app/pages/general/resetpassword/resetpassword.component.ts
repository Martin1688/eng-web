import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GeneralService } from 'src/app/services/general.service';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  public formError: string = '';
  userEmail='';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private generalService: GeneralService,
    private historyService: HistoryService) { }

  ngOnInit(): void {
  }

  onResetSubmit(){
    this.generalService.resetpws(this.userEmail)
      .then((x) => { 
        console.log(x);
        const {message} = x;
        this.formError=message;
        //document.location.reload();
        // this.authenticationService.getCurrentUser();
        // setTimeout(() => {
           this.router.navigateByUrl('/general/login');          
        // }, 200);       
      })
      .catch((message) => {
        this.formError = message
      });

  }
}
