import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {global} from "../global";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;

  constructor(
    public _http: HttpClient
  ) { 
    this.url = global.url;
  }

  register(user): Observable<any>{
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this._http.post(this.url+"create/user", params, {headers: headers});
  }

  login(user, getToken = null): Observable<any>{
    if(getToken != null){
      user.getToken = true;
    }
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this._http.post(this.url+"login", params, {headers: headers});
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem("identity"));

    if(!identity){
      identity = null;
    }

    return identity;
  }

  getToken(){
    let token = localStorage.getItem("token");

    if(!token){
      token = null;
    }

    return token;
  }

  update(user, token): Observable<any>{

    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
    return this._http.put(this.url+"update", params, {headers: headers});
  }
}
