import { Component, OnInit } from '@angular/core';
import { HighlighterService } from '../services/highlighter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highlighter-button',
  template: `
    <div class="right-button-container">
      <button 
        class="filter-button"
        [class.active]="isDrawingModeActive$ | async"
        (click)="toggleHighlighter()">
        <i class="fas fa-draw-polygon"></i>
        {{ (isDrawingModeActive$ | async) ? 'Drawing Active' : 'Highlighter' }}
      </button>
    </div>
  `,
  styleUrls: ['./highlighter-button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HighlighterButtonComponent implements OnInit {
  isDrawingModeActive$ = this.highlighterService.isDrawingModeActive$;

  constructor(private highlighterService: HighlighterService) {}

  ngOnInit() {
    console.log('Highlighter button component initialized');
  }

  toggleHighlighter() {
    console.log('Toggle highlighter clicked');
    this.highlighterService.activateDrawingMode();
  }
}