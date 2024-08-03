import { Component, OnInit } from '@angular/core';
import { Video } from "../../models/video";
import {VideoService} from "../../services/video.service";
import {UserService} from "../../services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.css'],
  providers: [VideoService, UserService]
})
export class VideoEditComponent implements OnInit {

  public video: Video;
  public status: string;
  public identity;
  public token: string;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService,
    public _router: Router, 
    public _route: ActivatedRoute
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

  onSubmit(form){
    this._videoService.update(this.video, this.video.id, this.token).subscribe(
      response=>{
        if(response.status == "success"){
          this.status = "success";
          this.video = response.video;
        }else{
          this.status = "false";
        }
      },
      error=>{
        this.status = "false";
        console.log(error);
      }
    );
  }

}
