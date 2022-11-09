import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingpageComponent } from './settingpage/settingpage.component';
import { WordspellComponent } from './wordspell/wordspell.component';
import { AutospellComponent } from './autospell/autospell.component';
import { SelfwordsComponent } from './selfwords/selfwords.component';
import { WordselectComponent } from './wordselect/wordselect.component';
import { RouteGuardServiceService } from '../../services/route-guard-service.service';
import { TestspellComponent } from './testspell/testspell.component';
import { TestselectchiComponent } from './testselectchi/testselectchi.component';
import { TestfillComponent } from './testfill/testfill.component';

const routes: Routes = [
  {
    path:'',
    component:SettingpageComponent,
  },{
    path:'spellex',
    component:WordspellComponent
  },{
    path:'autospell',
    component:AutospellComponent
  },{
    path:'selfwordset',
    component:SelfwordsComponent,
    canDeactivate:[RouteGuardServiceService]
  },{
    path:'engselectchiex',
    component:WordselectComponent
  },{
    path:'testspell',
    component:TestspellComponent
  },{
    path:'testselectchi',
    component:TestselectchiComponent
  },{
    path:'testfill',
    component:TestfillComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WordsRoutingModule { }
