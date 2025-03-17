import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Port } from '../services/port.service';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Share Your Route</h2>
          <button class="close-button" (click)="closeModal()">×</button>
        </div>

        <div class="modal-body">
          <div class="email-input-section">
            <label for="email">Send to Email:</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="emailAddress"
              (ngModelChange)="validateEmail()"
              placeholder="Enter recipient's email"
              class="email-input">
              
            <div *ngIf="emailError" class="error-message">
              Please enter a valid email address
            </div>
          </div>

          <div *ngIf="isValidEmail" class="preview-section">
            <h3>Preview</h3>
            <div class="preview-content">
              <div class="map-preview">
                <img [src]="mapImageUrl" alt="Route Map" class="map-image">
              </div>
              
              <div class="ports-list">
                <h4>Route Details:</h4>
                <p class="total-distance">Total Distance: {{totalDistance}} km</p>
                <ol>
                  <li *ngFor="let port of selectedPorts">
                    {{port.name}} (Rating: {{port.rating}})
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <button 
            class="send-button" 
            [disabled]="!isValidEmail"
            [class.active]="isValidEmail"
            (click)="sendEmail()">
            Send Route
          </button>
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
      max-width: 800px;
      max-height: 90vh;
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

    .email-input-section {
      margin-bottom: 20px;
    }

    .email-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 1rem;
      margin-top: 8px;
    }

    .email-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .preview-section {
      margin-top: 20px;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }

    .preview-content {
      display: flex;
      gap: 20px;
      margin-top: 15px;
    }

    .map-preview {
      flex: 2;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .map-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .ports-list {
      flex: 1;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 4px;
    }

    .send-button {
      width: 100%;
      padding: 12px;
      margin-top: 20px;
      border: none;
      border-radius: 4px;
      background-color: #d1d5db;
      color: white;
      font-size: 1rem;
      font-weight: 500;
      cursor: not-allowed;
      transition: all 0.3s ease;
    }

    .send-button.active {
      background-color: #10b981;
      cursor: pointer;
    }

    .send-button.active:hover {
      background-color: #059669;
    }
  `]
})
export class ShareModalComponent {
  @Input() selectedPorts: Port[] = [];
  @Input() totalDistance: number = 0;
  @Input() mapImageUrl: string = '';
  @Output() close = new EventEmitter<void>();

  emailAddress: string = '';
  isValidEmail: boolean = false;
  emailError: boolean = false;

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(this.emailAddress);
    this.emailError = !this.isValidEmail && this.emailAddress.length > 0;
  }

  closeModal() {
    this.close.emit();
  }

  async sendEmail() {
    if (!this.isValidEmail) return;

    try {
      // Here you would implement the email sending logic
      console.log('Sending email to:', this.emailAddress);
      alert('Route sent successfully!');
      this.closeModal();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  }
}