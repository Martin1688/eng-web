import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SelfusersetComponent } from './selfuserset/selfuserset.component';
import { ChangepwsComponent } from './changepws/changepws.component';
import { AuthorComponent } from './author/author.component';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [RegisterComponent, LoginComponent, AdminComponent, ResetpasswordComponent, SelfusersetComponent, ChangepwsComponent, AuthorComponent, AboutComponent],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GeneralModule { }
