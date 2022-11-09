import { Component, IterableDiffers, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import { User } from 'src/app/classes/user';
import { WordsRoutingModule } from '../words-routing.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settingpage',
  templateUrl: './settingpage.component.html',
  styleUrls: ['./settingpage.component.css']
})
export class SettingpageComponent implements OnInit {
  user: User | undefined;
  constructor(private router: Router,
    private authService: AuthenticationService,
    private wordService: VocabularyService) { }
  viewModel = {
    "exCount": [10, 20, 30, 40, 50],
    'rptCount': [1, 2, 3, 4]
  };
  model = {
    'exCount': 10,
    'rptCount': 3
  };
  formError = '';
  ngOnInit(): void {
    const logined =this.authService.isLoggedIn();
    //console.log(logined);
    if(!logined){
      this.router.navigateByUrl('/general/login');
    }
    this.user = this.authService.getCurrentUser();
    // const nm =user.name;
    //console.log(this.user);
  }
  SetExCount() { }

  SetRptCount() { }

  onSubmit() {
    //console.log(this.model);
    //this.user =this.authService.getCurrentUser();
    this.wordService.getWords(this.user!.email, this.model.exCount, this.model.rptCount, this.user!.grade)
      .then(words => {
        const exWords = words.map((x: { wdId: any; eng: any; chi: any; grade: any; }) => {
          return { wdId: x.wdId, eng: x.eng, chi: x.chi, grade: x.grade }
        });
        if (this.authService.removePrjItem("exWords")) {
          setTimeout(() => {
            this.authService.setPrjItem("exWords", JSON.stringify(exWords));
            //const reWords = JSON.parse(this.authService.getPrjItem("exWords"));
            this.formError = "設定完成";
          }, 100);
        }
        //console.log(words);
        //console.log(reWords);
      })
      .catch(err => {
        this.formError = err;
      });
  }

  jobDone() {
    this.wordService.setWords(this.user!.email).then(ok => {
      //console.log(ok.ok);
      if (ok.ok) {
        this.formError = "完成，繼續下批練習";
      }
    })
  }
}
