import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appHeightTransition]'
})
export class HeightDirective {
  private readonly originalHeight: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.originalHeight = this.elementRef.nativeElement.style.height;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'height 0.5s ease')
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', '90%');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.originalHeight);
  }

}
