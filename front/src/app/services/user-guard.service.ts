import { Injectable } from '@angular/core';
import {Router, CanActivate} from "@angular/router";

import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserGuardService implements CanActivate {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  canActivate(){
    let identity = this._userService.getIdentity();

    if(identity && identity.name){
      return true;
    }else{
      this._router.navigate(["/home"]);
      return false;
    }
  }
}
