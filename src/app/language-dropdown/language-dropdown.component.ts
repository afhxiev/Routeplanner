import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../services/language.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="language-dropdown" [class.open]="isOpen">
      <div class="language-display" (click)="toggleDropdown($event)">
        <span>{{ 'Language' | translate }}</span>
        <span class="arrow">▼</span>
      </div>
      
      <div class="dropdown-content" *ngIf="isOpen">
        <div class="language-option" (click)="selectLanguage('en')">
          <span>English</span>
        </div>
        <div class="language-option" (click)="selectLanguage('ru')">
          <span>Русский</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .language-dropdown {
      position: relative;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .language-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      height: 100%;
      padding: 0 15px;
    }

    .arrow {
      font-size: 0.8em;
      transition: transform 0.3s ease;
    }

    .open .arrow {
      transform: rotate(180deg);
    }

    .dropdown-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: white;
      border: 1px solid #ccc;
      border-top: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .language-option {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 15px;
      transition: background-color 0.3s ease;
    }

    .language-option:hover {
      background-color: #f3f4f6;
    }
  `]
})
export class LanguageDropdownComponent {
  isOpen = false;
  currentLanguage: Language = 'en';

  constructor(private languageService: LanguageService) {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.language-dropdown');
    if (!dropdown) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
    this.isOpen = false;
  }
}