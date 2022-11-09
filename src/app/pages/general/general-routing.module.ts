import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SelfusersetComponent} from './selfuserset/selfuserset.component';
import { ChangepwsComponent } from './changepws/changepws.component';
import { AuthorComponent } from './author/author.component';
import { AboutComponent } from './about/about.component';
const routes: Routes = [
  {
    path:'',
    component:LoginComponent,
  },{
    path: 'register',
    component: RegisterComponent
  },{
    path: 'login',
    component: LoginComponent
  },{
    path: 'admin',
    component: AdminComponent
   },{
    path: 'resetpws',
    component: ResetpasswordComponent
    },{
    path: 'selfuserset',
    component: SelfusersetComponent
    },{
    path: 'changepws',
    component: ChangepwsComponent
    },{
    path: 'author',
    component: AuthorComponent
    },{
    path: 'about',
    component: AboutComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
