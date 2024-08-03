import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from "../../models/User";
import {UserService} from "../../services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  
  public user: User;
  public status: string;
  public identity;
  public token;
  
  constructor(
    private _userService: UserService,
    private _router: Router,
    public _route: ActivatedRoute
  ) { 
    this.user = new User(1, "", "", "", "", "ROLE_USER", "");
    this.status = null;
  }
  
  ngOnInit(): void {
    this.logout();
  }

  onSubmit(form){
    //Get identity
    this._userService.login(this.user).subscribe(
      response=>{
        if(response.status != "error"){
          this.identity = response

          //Get token
          this._userService.login(this.user, true).subscribe(
            response=>{
              if(response.status != "error"){
                this.status = "success";
                this.token = response;

                console.log(this.identity);
                console.log(this.token);
                //Save on localStorage
                localStorage.setItem("identity", JSON.stringify(this.identity));
                localStorage.setItem("token", this.token);

                //Reset form
                form.reset();
                this._router.navigate(["/home"]);
              }else{
                this.status = "error"
              }
            },
            error=>{
              this.status = "error";
              console.log(error);
            }
          )
        }else{
          this.status = "error"
        }
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    );

  }

  logout(){
    this._route.params.subscribe(
      params=>{
        if(+params.sure == 1){
          localStorage.removeItem("token");
          localStorage.removeItem("identity");

          this.identity = null;
          this.token = null;
        }
      }
    )
  }

}
