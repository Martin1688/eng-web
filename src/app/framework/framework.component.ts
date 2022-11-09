import { Component, OnInit,Input,Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css']
})
export class FrameworkComponent implements OnInit {
  user: User | undefined;
  constructor(private router: Router,private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    if(this.isLoggedIn()){
      this.user = this.authService.getCurrentUser();
      //alert('bbb');
    }
       //alert('aaa');
     //console.log(this.user);
  }
  isLoggedIn() {
    const isLog=this.authService.isLoggedIn();
    //console.log(isLog);
    return isLog;
  }
  userRole(){
    //return 'admin';
     let myRole = '';
     if(this.isLoggedIn()){
      if(this.user){
        myRole=this.user!.role;
      }
     } 
    return myRole;
  }
  getUsername() {
    let myName ='';
    if(this.user){
      //console.log(this.user);
      myName=this.user.name;
     }
    return myName;
  }
  doLogout() {
     this.authService.logout();
     setTimeout(() => {
      this.router.navigateByUrl('/general/login');  
     }, 100);
  }
}
