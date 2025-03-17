import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from './right-sidebar.service';
import { Observable } from 'rxjs';

interface FilterValues {
  lengthOfTrip: number;
  differentPorts: number;
  islands: boolean;
  rating: number;
  averageDistance: number;
}

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RightSidebarComponent {
  readonly isOpen$: Observable<boolean>;
  
  filterValues: FilterValues = {
    lengthOfTrip: 0,
    differentPorts: 0,
    islands: true,
    rating: 1,
    averageDistance: 0
  };

  constructor(private readonly sidebarService: SidebarService) {
    this.isOpen$ = this.sidebarService.isSidebarOpen$;
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }

  onStoreChanges(): void {
    if (this.filterValues.lengthOfTrip < this.filterValues.differentPorts) {
      alert('Too many different ports requested');
      return;
    }

    if (this.filterValues.rating < 1 || this.filterValues.rating > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }

    if (this.filterValues.averageDistance < 0) {
      alert('Average distance cannot be negative');
      return;
    }

    this.sidebarService.applyFilters(this.filterValues);
    this.sidebarService.closeSidebar();
  }

  validateRating(): void {
    if (this.filterValues.rating < 1) this.filterValues.rating = 1;
    if (this.filterValues.rating > 5) this.filterValues.rating = 5;
  }
}