import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MxgComponent } from './mxg.component';
import { MxEditorComponent } from './mx-editor.component';
import { SvgViewerComponent } from './svg-viewer.component';
import { SvgLoaderComponent } from './svg-loader.component';

const routes: Routes = [
  {path: '', component: SvgLoaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
