import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';


@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ 'How to Use the Application' | translate }}</h2>
          <button class="close-button" (click)="closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>{{ 'Draw Your Area' | translate }}</h3>
                <p>{{ 'Click the "Highlighter" button and draw a polygon on the map to select your sailing area.' | translate }}</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>{{ 'Set Your Filters' | translate }}</h3>
                <p>{{ 'Click "Filters" and set your preferences:' | translate }}</p>
                <ul>
                  <li>{{ 'Length of Trip' | translate }}</li>
                  <li>{{ 'Different Ports' | translate }}</li>
                  <li>{{ 'Rating' | translate }}</li>
                  <li>{{ 'Average Distance' | translate }}</li>
                </ul>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>{{ 'Generate Route' | translate }}</h3>
                <p>{{ 'Click "Generate Route" in the left sidebar to start creating your route.' | translate }}</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>{{ 'Select Ports' | translate }}</h3>
                <p>{{ 'Click ports on the map to create your route. The first port selected will be your starting point. Complete the route by returning to your starting port.' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.5rem;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 5px;
    }

    .close-button:hover {
      color: #1f2937;
    }

    .modal-body {
      padding: 20px;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .step {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .step-number {
      background-color: #10b981;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-content {
      flex-grow: 1;
    }

    .step-content h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-size: 1.1rem;
    }

    .step-content p {
      margin: 0;
      color: #4b5563;
    }

    .step-content ul {
      margin: 8px 0;
      padding-left: 20px;
      color: #4b5563;
    }

    .step-content li {
      margin-bottom: 4px;
    }
  `]
})
export class InfoModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}