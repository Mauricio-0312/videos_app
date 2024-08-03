import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {VideoService} from "../../services/video.service";
import {Video} from "../../models/Video";
import {Router, ActivatedRoute, Params} from "@angular/router";
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, VideoService]
})
export class HomeComponent implements OnInit {

  public identity;
  public token: string;
  public status: string;
  public videos: Array<Video>;
  public page;
  public pages;
  public current_page;
  public previous;
  public next;
  public array_pages: Array<any>;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    public _router: Router, 
    public _route: ActivatedRoute
  ) { 
    this.page = 1;
    this.array_pages = [];
  }

  ngOnInit(): void {
    this.loadUser();
    this.getVideos();
  }

  loadUser(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getVideos(){
    this._route.params.subscribe(
      params=>{
        if(params.page){
          this.page = params.page;
        }
          this._videoService.getVideos(this.token, this.page).subscribe(
            response=>{
                if(response.status == "success"){
                  this.videos = response.videos;

                  this.pages = response.total_pages;
                  this.current_page = +response.current_page;
                  console.log(response);
                  //Add pages to array to display the pagination on the frontend
                  for(let i = 0; i < this.pages; i++){
                    this.array_pages[i] = i + 1;
                  }

                  //Configure previous button
                  if(this.current_page == 1){
                    this.previous = 1;
                  }else{
                    this.previous = this.current_page - 1;
                  }

                  //Configure next button
                  if(this.current_page == this.pages){
                    this.next = this.pages;
                  }else{
                    this.next = this.current_page + 1;
                  }


                }
            },
            error=>{
              console.log(error);
            }
          )
      }
    );
  }

  getThumb(url, size = null) {
    var video, results, thumburl;
    
     if (url === null) {
         return '';
     }
     
     results = url.match('[\\?&]v=([^&#]*)');
     video   = (results === null) ? url : results[1];
    
     if(size != null) {
         thumburl = 'http://img.youtube.com/vi/' + video + '/'+ size +'.jpg';
     }else{
         thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
     }
    
      return thumburl;
        
  }
  
  deleteVideo(id){
    this._videoService.delete(id, this.token).subscribe(
      response=>{
        if(response.status == "success"){
          this.getVideos();
        }
      },
      error=>{
        console.log(error);
      }
    )
  }

}
