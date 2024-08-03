import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { NewVideoComponent } from './components/new-video/new-video.component';
import { VideoEditComponent } from './components/video-edit/video-edit.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';

import {UserGuardService} from "./services/user-guard.service";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "home/:page", component: HomeComponent},
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "user/update", component: UserEditComponent, canActivate: [UserGuardService]},
  {path: "logout/:sure", component: LoginComponent , canActivate: [UserGuardService]},
  {path: "video/save", component: NewVideoComponent , canActivate: [UserGuardService]},
  {path: "video/edit/:id", component: VideoEditComponent , canActivate: [UserGuardService]},
  {path: "video/detail/:id", component: VideoDetailComponent , canActivate: [UserGuardService]},
  {path: "error", component: ErrorComponent},
  {path: "**", component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
