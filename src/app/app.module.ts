import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MxgComponent } from './mxg.component';
import { MxEditorComponent } from './mx-editor.component';
import { SvgViewerComponent } from './svg-viewer.component';
import { SvgLoaderComponent } from './svg-loader.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MxgComponent,
    MxEditorComponent,
    SvgViewerComponent,
    SvgLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
