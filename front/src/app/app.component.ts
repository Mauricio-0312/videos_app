import { Component, DoCheck } from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements DoCheck{
  public status: string;
  public identity;
  public token;
  
  constructor(
    private _userService: UserService,
    private _router: Router
  ) { 
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }




}
