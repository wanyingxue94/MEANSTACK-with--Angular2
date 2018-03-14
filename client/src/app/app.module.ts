import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import {HomeService} from "./services/home.service";
import { SearchComponent } from './components/search/search.component';
import {SearchService} from "./services/search.service";
import { ViewBlogComponent } from './components/blog/view-blog/view-blog.component';
import { TagsComponent } from './components/tags/tags.component';
import {DashboardService} from "./services/dashboard.service";
import { BlankComponent } from './components/blank/blank.component';
import { EditAvatarComponent } from './components/profile/edit-avatar/edit-avatar.component';
import { EditPasswordComponent } from './components/profile/edit-password/edit-password.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import {UsersService} from "./services/users.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    SearchComponent,
    ViewBlogComponent,
    TagsComponent,
    BlankComponent,
    EditAvatarComponent,
    EditPasswordComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlashMessagesModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, BlogService,HomeService,SearchService,DashboardService,UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
