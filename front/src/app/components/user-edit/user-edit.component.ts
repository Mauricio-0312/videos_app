import { Component, OnInit } from '@angular/core';
import { User } from "../../models/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public user: User;
  public status: string;
  public identity;
  public token: string;

  constructor(
    private _userService: UserService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User(this.identity.sub, 
                          this.identity.name, 
                          this.identity.surname, 
                          this.identity.email, 
                          "", "ROLE_USER", "");
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.update(this.user, this.token).subscribe(
      response=>{
        if(response.status == "success"){
          this.status = "success";
          console.log(response);
          this.identity = response.user;
          this.user = response.user;
          localStorage.setItem("identity", JSON.stringify(response.user));
        }else{
          this.status = "error";
        }
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    )
  }

}
