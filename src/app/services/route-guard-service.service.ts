import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs';
import { SelfwordsComponent } from '../pages/words/selfwords/selfwords.component';
@Injectable({
  providedIn: 'root'
})
export class RouteGuardServiceService implements CanDeactivate<SelfwordsComponent> {

  constructor() { }
  canDeactivate(component: SelfwordsComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(component.wordAry.length > 0){
      if(confirm("即將離開網頁，字庫尚未儲存，要儲存再離開嗎?")){
       return component.Save2Local();
      }
    }
    return true;
  }
}
