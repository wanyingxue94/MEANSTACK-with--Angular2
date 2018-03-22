import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { SearchComponent } from "./components/search/search.component";
import { TagsComponent } from "./components/tags/tags.component";
import { ViewBlogComponent } from "./components/blog/view-blog/view-blog.component";
import {BlankComponent} from "./components/blank/blank.component";
import {EditProfileComponent} from "./components/profile/edit-profile/edit-profile.component";
import {EditAvatarComponent} from "./components/profile/edit-avatar/edit-avatar.component";
import {EditPasswordComponent} from "./components/profile/edit-password/edit-password.component";
import {RedirectComponent} from "./components/redirect/redirect.component";


// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent, // Dashboard Route
    canActivate: [AuthGuard] //if the user is logged in this auth service can be activated
  },
  {
    path: 'register',
    component: RegisterComponent, // Register Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent, // Login Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent, // Profile Route
    canActivate: [AuthGuard]
  },
  {
    path: 'blog',
    component: BlogComponent, //Blog Route
    canActivate: [AuthGuard]  //User must be logged in to view this route
  },
  {
    path: 'edit-blog/:id',
    component: EditBlogComponent, // Edit Blog ROute
    canActivate: [AuthGuard] // User must be logge din to view this route
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent, // Delete Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // Public Profile Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'search/text/:text',
    component: SearchComponent, // Edit Blog ROute
    canActivate: [AuthGuard] // User must be logge din to view this route
  },
  {
    path: 'search/tags/:tag',
    component: TagsComponent, // Edit Blog ROute
    canActivate: [AuthGuard] // User must be logge din to view this route
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent, // Profile Route
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-avatar',
    component: EditAvatarComponent, // Profile Route
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-password',
    component: EditPasswordComponent, // Profile Route
    canActivate: [AuthGuard]
  },
  {
    path: 'blank',
    component: BlankComponent // Blank Route
  },
  {
    path: 'view-blog/:id',
    component: ViewBlogComponent, // Delete Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'redirect',
    component: RedirectComponent, //Redirect Route
    canActivate: [AuthGuard]  //User must be logged in to view this route
  },
  { path: '**', component: HomeComponent } // "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
