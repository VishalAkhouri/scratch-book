import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scratch-book';
  printFrame: any;
  printFrameId = 'printIframe';

  public handleButtonClick(): void {
    console.log('handleButtonClick()');
    this.generateBlobUrl();
  }

  @HostListener('window:beforeprint')
  public onBeforePrint(): void{
    console.log('Before print');
  }

  @HostListener('window:afterprint')
  public onAfterPrint(): void{
    console.log('After print');
  }

  @HostListener('focus')
  public onPrintFoc(): void{
    console.log('print dialog focu action');
  }

  public generateBlobUrl(): void {
    const contentType = 'application/pdf';
    const b64Data = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'; // Replace this with your base64String
    const blob = this.b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    this.createIframeElement(blobUrl);
  }

  public createIframeElement(blobUrl: any): void {
    if (!this.printFrame) {
      this.printFrame = document.createElement('iframe');
    }
    this.printFrame.setAttribute('appIframeTracker', 'appIframeTracker');
    this.printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute; border: 0');
    this.printFrame.setAttribute('src', blobUrl);
    this.printFrame.setAttribute('id', this.printFrameId);
    document.body.appendChild(this.printFrame);
    this.printFrame.onload = () => {
      this.triggerIframePrint();
    };
  }

  public triggerIframePrint(): void {
    try {
      // this.printFrame.setAttribute('style', 'visibility: visible; height: 200px; width: 200px; position: absolute; border: 1');
      this.printFrame.contentWindow.focus();
      this.printFrame.contentWindow.print();
    } catch (error) {

    } finally {
      // Run onPrintDialogClose callback
      const event = 'focus';
      setInterval(() => {
        this.printFrame.focus();
      }, 1000);

      const handler = () => {

        // Make sure the event only happens once.
        window.removeEventListener(event, handler);

        // Remove iframe from the DOM
        const iframe = document.getElementById(this.printFrameId);

        if (iframe) {
          console.log('focus event triggered - removing iframe');
          // iframe.remove();
        }
      };

      window.addEventListener(event, handler);
    }
  }

  public b64toBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
