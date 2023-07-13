import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Model1Component } from './sandbox/model1/model1.component';
import { Model2Component } from './sandbox/model2/model2.component';
import { Model3Component } from './sandbox/model3/model3.component';

@NgModule({
  declarations: [
    AppComponent,
    Model1Component,
    Model2Component,
    Model3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
