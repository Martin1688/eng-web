import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Vcblry } from '../classes/vcblry';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {


  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService:AuthenticationService) { }
  private handleError(error: any): Promise<any> {
    console.log(error.status);
    if (error.status == 401) {
      return Promise.reject('帳號不存在，請先註冊');
    } else if (error.status == 402) {
      return Promise.reject('密碼不正確');
    }
    //console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public sendwords(word:{wdId:string, eng:string, chi:string, grade:string, memo: string}):Promise<boolean>{
    const url: string = `${this.apiBaseUrl}/words`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http
      .post(url,word,httpOptions)
      .toPromise()
      .then(response => response as boolean)
      .catch(this.handleError);
  }

  public getWords(emailuser:string, count:number, repCount:number, myGrade: string){
    //console.log(emailuser);
    if(this.authService.removePrjItem('repCount')){
      setTimeout(() => {
        this.authService.setPrjItem('repCount', repCount.toString());        
      }, 100);
    }
    const url: string = `${this.apiBaseUrl}/words`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http
      .patch(url,{email:emailuser, wordCount:count, grade:myGrade},httpOptions)
      .toPromise()
      // .then(response => {
      //   console.log(response);
      // })
      .catch(this.handleError);
  }
  public getAutoComp(stChar:string){
    const url: string = `${this.apiBaseUrl}/complete`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http.post(url,{startChar:stChar},httpOptions);
  }
  public getAWord(key:string){
    const url: string = `${this.apiBaseUrl}/complete`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http.patch(url,{eng:key},httpOptions);
  }
  getSentence(wordId: string) {
    const url: string = `${this.apiBaseUrl}/dictionary`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http.post(url,{word:wordId},httpOptions).toPromise();
  }

  getASentence(eng: string) {
    const url: string = `${this.apiBaseUrl}/dictionary`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    //console.log(url);
    return this.http.patch(url,{word:eng},httpOptions).toPromise();
  }


  setWords(emailuser: string) {
    const url: string = `${this.apiBaseUrl}/words`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http
      .post(url,{email:emailuser},httpOptions)
      .toPromise()
      .then(response => response as boolean)
      .catch(this.handleError);
  }
  
  seizeChiStr(cnt: number) {
    const url: string = `${this.apiBaseUrl}/selectChinese`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
    return this.http
      .patch(url,{length:cnt},httpOptions)
      .toPromise();
  }

}
