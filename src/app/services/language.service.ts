import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'ru';

interface Translations {
  [key: string]: {
    en: string;
    ru: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: { en: string; ru: string } } = {
    // Navbar
    "Language": {
      en: "Language",
      ru: "Язык"
    },
    "Share Route": {
      en: "Share Route",
      ru: "Поделиться маршрутом"
    },
    "Info": {
      en: "Info",
      ru: "Информация"
    },
  
    // Highlighter Tool
    "Highlighter": {
      en: "Highlighter",
      ru: "Выделение"
    },
    "Drawing Active": {
      en: "Drawing Active",
      ru: "Режим рисования активен"
    },
    "Click on the map to start drawing. Click points to create a polygon. Double-click to finish.": {
      en: "Click on the map to start drawing. Click points to create a polygon. Double-click to finish.",
      ru: "Кликните на карте, чтобы начать рисование. Кликайте, чтобы создать многоугольник. Двойной клик — завершить."
    },
    "Polygon drawn successfully! Searching for ports...": {
      en: "Polygon drawn successfully! Searching for ports...",
      ru: "Многоугольник успешно нарисован! Идет поиск портов..."
    },
    "Error fetching ports. Please try again.": {
      en: "Error fetching ports. Please try again.",
      ru: "Ошибка при получении портов. Пожалуйста, попробуйте снова."
    },
    "Found {0} ports in the selected area": {
      en: "Found {0} ports in the selected area",
      ru: "Найдено {0} портов в выбранной области"
    },
  
    // Left Sidebar
    "Generate Route": {
      en: "Generate Route",
      ru: "Создать маршрут"
    },
    "Total Distance": {
      en: "Total Distance",
      ru: "Общее расстояние"
    },
    "km": {
      en: "km",
      ru: "км"
    },
  
    // Right Sidebar (Filters)
    "Filters": {
      en: "Filters",
      ru: "Фильтры"
    },
    "Length of Trip": {
      en: "Length of Trip",
      ru: "Длительность путешествия"
    },
    "Different Ports": {
      en: "Different Ports",
      ru: "Разные порты"
    },
    "Include Islands": {
      en: "Include Islands",
      ru: "Включить острова"
    },
    "Minimum Rating": {
      en: "Minimum Rating",
      ru: "Минимальный рейтинг"
    },
    "Average Distance": {
      en: "Average Distance",
      ru: "Среднее расстояние"
    },
    "Enter trip length": {
      en: "Enter trip length",
      ru: "Введите длительность путешествия"
    },
    "Enter number of ports": {
      en: "Enter number of ports",
      ru: "Введите количество портов"
    },
    "Enter minimum rating (1-5)": {
      en: "Enter minimum rating (1-5)",
      ru: "Введите минимальный рейтинг (1-5)"
    },
    "Enter distance": {
      en: "Enter distance",
      ru: "Введите расстояние"
    },
    "Store Changes": {
      en: "Store Changes",
      ru: "Сохранить изменения"
    },
  
    // Map Component
    "Starting Port": {
      en: "Starting Port",
      ru: "Начальный порт"
    },
    "{0} ports remaining to select": {
      en: "{0} ports remaining to select",
      ru: "Осталось выбрать {0} портов"
    },
  
    // Share Modal
    "Share Your Route": {
      en: "Share Your Route",
      ru: "Поделиться маршрутом"
    },
    "Send to Email:": {
      en: "Send to Email:",
      ru: "Отправить на email:"
    },
    "Enter recipient's email": {
      en: "Enter recipient's email",
      ru: "Введите email получателя"
    },
    "Please enter a valid email address": {
      en: "Please enter a valid email address",
      ru: "Пожалуйста, введите корректный email"
    },
    "Preview": {
      en: "Preview",
      ru: "Предпросмотр"
    },
    "Route Details:": {
      en: "Route Details:",
      ru: "Детали маршрута:"
    },
    "Send Route": {
      en: "Send Route",
      ru: "Отправить маршрут"
    },
  
    // Info Modal (Instructions)
    "How to Use the Application": {
      en: "How to Use the Application",
      ru: "Как использовать приложение"
    },
    "Draw Your Area": {
      en: "Draw Your Area",
      ru: "Нарисуйте область"
    },
    "Click the 'Highlighter' button and draw a polygon on the map to select your sailing area.": {
      en: "Click the 'Highlighter' button and draw a polygon on the map to select your sailing area.",
      ru: "Нажмите кнопку 'Выделение' и нарисуйте многоугольник, чтобы выбрать область плавания."
    },
    "Set Your Filters": {
      en: "Set Your Filters",
      ru: "Настройте фильтры"
    },
    "Click 'Filters' and set your preferences:": {
      en: "Click 'Filters' and set your preferences:",
      ru: "Нажмите 'Фильтры' и настройте параметры:"
    },
    "Select Ports": {
      en: "Select Ports",
      ru: "Выберите порты"
    },
    "Click ports on the map to create your route. The first port selected will be your starting point. Complete the route by returning to your starting port.": {
      en: "Click ports on the map to create your route. The first port selected will be your starting point. Complete the route by returning to your starting port.",
      ru: "Нажмите на порты на карте, чтобы создать маршрут. Первый выбранный порт будет начальной точкой. Завершите маршрут, вернувшись в начальный порт."
    },
  
    // Notifications & Errors
    "Route completed successfully!": {
      en: "Route completed successfully!",
      ru: "Маршрут успешно создан!"
    },
    "Route sent successfully!": {
      en: "Route sent successfully!",
      ru: "Маршрут успешно отправлен!"
    },
    "Failed to send email. Please try again.": {
      en: "Failed to send email. Please try again.",
      ru: "Не удалось отправить email. Пожалуйста, попробуйте снова."
    },
    "Too many different ports requested": {
      en: "Too many different ports requested",
      ru: "Запрошено слишком много разных портов"
    },
  
    // General UI Elements
    "Close": {
      en: "Close",
      ru: "Закрыть"
    },
    "Loading...": {
      en: "Loading...",
      ru: "Загрузка..."
    },
    "Back": {
      en: "Back",
      ru: "Назад"
    },
    "Next": {
      en: "Next",
      ru: "Далее"
    }
  };  // ^^^^ ALL OF THE TRANSLATION MAPPINGS ^^^^

  setLanguage(lang: Language) {
    this.currentLanguageSubject.next(lang);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguageSubject.value];
  }
}