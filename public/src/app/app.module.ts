import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from "./guards/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [HttpService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
