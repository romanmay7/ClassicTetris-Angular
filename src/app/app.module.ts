import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameScreenComponent } from './components/game-screen/game-screen.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TitleScreenComponent } from './components/title-screen/title-screen.component';
import { HighscoresListComponent } from './components/highscores-list/highscores-list.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    GameScreenComponent,
    NavBarComponent,
    TitleScreenComponent,
    HighscoresListComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
