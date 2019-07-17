import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeeduserComponent } from './newsfeeduser.component';

describe('NewsfeeduserComponent', () => {
  let component: NewsfeeduserComponent;
  let fixture: ComponentFixture<NewsfeeduserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsfeeduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeeduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
