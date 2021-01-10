import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appIframeTracker]'
})
export class IframeTrackerDirective implements OnInit {
  private iframeMouseOver = false;

  @Output() iframeClick = new EventEmitter<ElementRef>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.listen(window, 'blur', () => this.onWindowBlur());
  }

  @HostListener('mouseover')
  private onIframeMouseOver(): void {
    console.log('Iframe mouse over');
    this.iframeMouseOver = true;
    this.resetFocusOnWindow();
  }

  @HostListener('mouseout')
  private onIframeMouseOut(): void {
    console.log('Iframe mouse out');
    this.iframeMouseOver = false;
    this.resetFocusOnWindow();
  }

  @HostListener('window:afterprint')
  private onIframeAfterPrint(): void {
    console.log('Iframe window after print');
    this.iframeMouseOver = false;
    this.resetFocusOnWindow();
  }

  private onWindowBlur(): void {
    if (this.iframeMouseOver) {
      console.log('WOW! Iframe click!!!');
      this.resetFocusOnWindow();
      this.iframeClick.emit(this.el);
    }
  }

  private resetFocusOnWindow(): void {
    setTimeout(() => {
      console.log('reset focus to window');
      window.focus();
    }, 100);
  }
}
