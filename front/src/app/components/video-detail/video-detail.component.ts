import { Component, OnInit } from '@angular/core';
import { Video } from "../../models/video";
import {VideoService} from "../../services/video.service";
import {UserService} from "../../services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css'],
  providers: [VideoService, UserService]
})
export class VideoDetailComponent implements OnInit {

  public video: Video;
  public status: string;
  public identity;
  public token: string;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    public _router: Router, 
    public _route: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getVideo();
  }

  getVideo(){
    this._route.params.subscribe(
      params=>{
        if(params.id){
          this._videoService.detail(params.id, this.token).subscribe(
            response=>{
              this.video = response.video;
            },
            error=>{
              console.log(error);
            }
          );
        }
      }
    )
  }

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
}

}
