import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlighterButtonComponent } from './highlighter-button.component';

describe('HighlighterButtonComponent', () => {
  let component: HighlighterButtonComponent;
  let fixture: ComponentFixture<HighlighterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlighterButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlighterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
