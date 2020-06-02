import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoresListComponent } from './highscores-list.component';

describe('HighscoresListComponent', () => {
  let component: HighscoresListComponent;
  let fixture: ComponentFixture<HighscoresListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscoresListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscoresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
