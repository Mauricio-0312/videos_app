import { Component, OnInit } from '@angular/core';
import { Video } from "../../models/video";
import {VideoService} from "../../services/video.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-new-video',
  templateUrl: './new-video.component.html',
  styleUrls: ['./new-video.component.css'],
  providers: [VideoService, UserService]
})
export class NewVideoComponent implements OnInit {

  public video: Video;
  public status: string;
  public identity;
  public token: string;

  constructor(
    private _userService: UserService,
    private _videoService: VideoService

  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.video = new Video(1, this.identity.sub, "", "", "", "", "", "");
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._videoService.create(this.video, this.token).subscribe(
      response=>{
        if(response.status == "success"){
          this.status = "success";
          form.reset();
        }else{
          this.status = "error";
        }
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    );
  }

}
