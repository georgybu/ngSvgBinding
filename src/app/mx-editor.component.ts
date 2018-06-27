import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const EditorUi;
declare const Editor;
declare const mxUtils;
declare const OPEN_URL;
declare const STYLE_PATH;
declare const RESOURCE_BASE;
declare const mxLanguage;
declare const mxResources;
declare const Graph;

@Component({
  selector: 'm-mx-editor',
  template: `
    <div class="geEditor" #geEditor></div>
  `,
  styles: []
})
export class MxEditorComponent implements OnInit {
  @ViewChild('geEditor', {read: ElementRef}) geEditor: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  // ngAfterViewInit(): void {
  //   const editorUiInit = EditorUi.prototype.init;
  //
  //   EditorUi.prototype.init = function () {
  //     editorUiInit.apply(this, arguments);
  //     this.actions.get('export').setEnabled(false);
  //
  //     // Updates action states which require a backend
  //     if (!Editor.useLocalStorage) {
  //       mxUtils.post(OPEN_URL, '', mxUtils.bind(this, function (req) {
  //         const enabled = req.getStatus() !== 404;
  //         this.actions.get('open').setEnabled(enabled || Graph.fileSupport);
  //         this.actions.get('import').setEnabled(enabled || Graph.fileSupport);
  //         this.actions.get('save').setEnabled(enabled);
  //         this.actions.get('saveAs').setEnabled(enabled);
  //         this.actions.get('export').setEnabled(enabled);
  //       }));
  //     }
  //   };
  //
  //   // Adds required resources (disables loading of fallback properties, this can only
  //   // be used if we know that all keys are defined in the language specific file)
  //   mxResources.loadDefaultBundle = false;
  //   const bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
  //     mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);
  //
  //   // Fixes possible asynchronous requests
  //   mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function (xhr) {
  //     // Adds bundle text to resources
  //     mxResources.parse(xhr[0].getText());
  //
  //     // Configures the default graph theme
  //     const themes = new Object();
  //     themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
  //
  //     // Main
  //     const chromeless = false;
  //     const e = new EditorUi(new Editor(chromeless, themes));
  //     console.log(e);
  //   }, function () {
  //     document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
  //   });
  // }
}
