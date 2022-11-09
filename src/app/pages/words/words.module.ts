import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordsRoutingModule } from './words-routing.module';
import { SettingpageComponent } from './settingpage/settingpage.component';
import {ReactiveFormsModule,FormsModule } from '@angular/forms';
import { WordspellComponent } from './wordspell/wordspell.component';
import { AutospellComponent } from './autospell/autospell.component';
import { SelfwordsComponent } from './selfwords/selfwords.component';
import { WordselectComponent } from './wordselect/wordselect.component';
import { TestspellComponent } from './testspell/testspell.component';
import { TestselectchiComponent } from './testselectchi/testselectchi.component';
import { TestfillComponent } from './testfill/testfill.component';

@NgModule({
  declarations: [SettingpageComponent, WordspellComponent, AutospellComponent, SelfwordsComponent, WordselectComponent, TestspellComponent, TestselectchiComponent, TestfillComponent],
  imports: [
    CommonModule,
    WordsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class WordsModule { }
