import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BROWSER_STORAGE } from '../classes/storage';
import { User } from '../classes/user';
import { Authresponse } from '../classes/authresponse';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {
  }

  private handleError(error: any): Promise<any> {
    //console.log(error.status);
    if (error.status == 401) {
      const {message} = error.error;
      // console.log(message);
      // console.log(JSON.stringify(error));
      return Promise.reject(`密碼不正確(${message})`);
    } else if (error.status == 402) {
      return Promise.reject('密碼不正確');
    } else  {
      const {message} = error.error;
      // console.log(message);
      // console.log(JSON.stringify(error));
      return Promise.reject(`錯誤(${message})`);
    }
  }

  public login(user: User): Promise<Authresponse> {
    return this.makeAuthApiCall('login', user);
  }
  public register(user: User): Promise<Authresponse> {
    return this.makeAuthApiCall('register', user);
  }
  private makeAuthApiCall(urlPath: string, user: User): Promise<Authresponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as Authresponse)
      .catch(this.handleError);
  }


  resetpws(userEmail: string) {
    const url: string = `${this.apiBaseUrl}/usernewpsw`;

    return this.http
      .post(url, { email: userEmail })
      .toPromise()
      .catch(this.handleError);
  }

  changepws(credentials: User, oldPassword: string) {
    const url: string = `${this.apiBaseUrl}/changepws`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('token')}`
      })
    };
    return this.http
      .post(url, { "email": credentials.email, "oldPassword": oldPassword, "newPassword": credentials.password }, httpOptions)
      .toPromise()
      .then(response => response as boolean)
      .catch(this.handleError);
  }

  mailAutoComp() {
    const url: string = `${this.apiBaseUrl}/mailcpl`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('token')}`
      })
    };
    return this.http
      .post(url, {}, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }

  getAUser(temMail: string) {
    const url: string = `${this.apiBaseUrl}/user`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('token')}`
      })
    };
    return this.http
      .patch(url, { 'email': temMail }, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }

  updateUser(credentials: { 
    _id: string; name: string; email: string; password: string; role: string; grade: string; memo: string; signdate: string; keep: boolean;
  }) {
    const url: string = `${this.apiBaseUrl}/user/`;
    //const url: string = `${this.apiBaseUrl}/user/${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .put(url, credentials, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }

  deleteUser(userMail:string) {
    const uMail=userMail;
    //console.log(uMail);
  //const url: string = `${this.apiBaseUrl}/user/`;
  const url: string = `${this.apiBaseUrl}/user/${uMail}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.storage.getItem('token')}`,
      'Content-Type': 'application/json'
    })
  };
  return this.http
    .delete(url, httpOptions)
    .toPromise()
    .catch(this.handleError);
}

  // public checkAccount(uname: string): Promise<boolean> {
  //   const url: string = `${this.apiBaseUrl}/isuser`;
  //   return this.http
  //     .post(url, { name: uname })
  //     .toPromise()
  //     .then(response => response as boolean)
  //     .catch(this.handleError);
  // }



  // delItem(_id: string): Promise<any> {
  //   const url: string = `${this.apiBaseUrl}/fmaccount/${_id}`;
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.storage.getItem('token')}`
  //     })
  //   };

  //   return this.http
  //     .delete(url,httpOptions)
  //     .toPromise()
  //     .catch(this.handleError);
  // }
  // public getName(): string {
  //   return this.storage.getItem('faccount-name');
  // }

}
