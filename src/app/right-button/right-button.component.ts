import { Component } from '@angular/core';
import { SidebarService } from '../right-sidebar/right-sidebar.service';

@Component({
  selector: 'app-right-button',
  templateUrl: './right-button.component.html',
  styleUrls: ['./right-button.component.css'],
  standalone: true,
})
export class RightButtonComponent {
  constructor(private sidebarService: SidebarService) {}

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}