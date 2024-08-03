import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {global} from "../global";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  public url: string;

  constructor(
    public _http: HttpClient
  ) { 
    this.url = global.url;
  }

  create(video, token): Observable<any>{
    let json = JSON.stringify(video);
    let params = "json="+encodeURIComponent(json);
    
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
    return this._http.post(this.url+"video/create", params, {headers: headers});
  }

  detail(id, token): Observable<any>{

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
    
    return this._http.get(this.url+"video/detail/"+id, {headers: headers});
  }

  getVideos(token, page = 1): Observable<any>{
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
    
    return this._http.get(this.url+"videos?page="+page, {headers: headers});
  }

  delete(id, token): Observable<any>{
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);

    return this._http.delete(this.url+"video/remove/"+id, {headers: headers});
  }

  update(video, id, token): Observable<any>{

    let json = JSON.stringify(video);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
    return this._http.put(this.url+"video/update/"+id, params, {headers: headers});
  }}
