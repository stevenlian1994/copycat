import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { HashtagComponent} from './hashtag/hashtag.component';
import { NewsfeeduserComponent } from './newsfeeduser/newsfeeduser.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], children: [
        { path: 'newsfeed', component: NewsfeedComponent },
        // { path: 'profile/:id', component: ProfileComponent },
        // { path: 'profile', component: ProfileComponent },
        { path: 'user/:userName', component: NewsfeeduserComponent  },
        { path: 'hashtag/:title', component: HashtagComponent },
      ]
     },
    // {path: 'newsfeed', component: NewsfeedComponent, canActivate: [AuthGuardService]},
    // {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }




