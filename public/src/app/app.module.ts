import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from "./guards/auth-guard.service";
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { ProfileComponent } from './profile/profile.component';
import { HashtagComponent } from './hashtag/hashtag.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NewsfeeduserComponent } from './newsfeeduser/newsfeeduser.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostsComponent,
    DashboardComponent,
    NewsfeedComponent,
    ProfileComponent,
    HashtagComponent,
    NewsfeeduserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [HttpService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
