import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RightButtonComponent } from './right-button/right-button.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { MapComponent } from './map/map.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HighlighterButtonComponent } from "./highlighter-button/highlighter-button.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HighlighterButtonComponent, RightButtonComponent, RightSidebarComponent, MapComponent, LeftSidebarComponent, NavbarComponent, HighlighterButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'routeplanner-frontend';
}
