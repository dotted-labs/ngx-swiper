---
description: ngx-swiper global rules
globs: **/*.ts, **/*.html
alwaysApply: false
---

**ngx-swiper project summary**
ngx-swiper is an Angular library that implements the famous Swiper.js library (https://swiperjs.com/) to create modern mobile touch sliders with hardware accelerated transitions, pagination, navigation, scrollbar, effects, autoplay and many other features.

**Project structure**
1. **Demo app**
   Demo app built with Angular to test the ngx-swiper library. You can test this project using the following command `npm run start:swiper-demo`

2. **ngx-swiper**
   Angular library that provides:
   - SwiperComponent: Main Angular component that wraps Swiper.js functionality
   - SwiperSlideDirective: Directive for individual slides
   - SwiperModule: Angular module (if needed for non-standalone usage)
   - Interfaces and types for Swiper configuration
   - Services for managing multiple Swiper instances
   - Support for all Swiper.js modules: Navigation, Pagination, Scrollbar, Autoplay, Effects, Zoom, etc.

**After executing the task**
  After the required changes in the library you have to modify the demo to implement the changes made in the library and also update the README to document the changes and the new implementations.

**Swiper.js Integration Requirements**

**Core Swiper.js Knowledge**
- Swiper.js is a modern mobile touch slider with hardware accelerated transitions
- Version 9+ uses Web Components approach (`<swiper-container>` and `<swiper-slide>`) instead of framework-specific components
- Register custom elements once at app startup using `register()` from 'swiper/element/bundle'
- All modules are included in the bundle: Navigation, Pagination, Scrollbar, Autoplay, Effects (Fade, Cube, Coverflow, Flip, Cards, Creative), Zoom, Virtual slides, Thumbs, Free mode, Grid, Parallax, Keyboard, Mousewheel, History, Hash navigation, A11y, Controller, and Manipulation
- Swiper uses CSS classes, data attributes, and Web Component properties for configuration
- Events system for lifecycle management (init, slideChange, destroy, etc.) with "swiper" prefix
- Responsive breakpoints support with nested configuration objects
- Multiple effect types and extensive customization options
- Shadow DOM implementation for Web Components with styling considerations

**Angular Implementation Guidelines**

**Swiper Web Component Integration**
- Use Swiper's Web Component approach with `<swiper-container>` and `<swiper-slide>` elements since Angular-specific components were removed in Swiper v9
- Register Swiper custom elements globally in main.ts using `register()` from 'swiper/element/bundle'
- Include `CUSTOM_ELEMENTS_SCHEMA` in component schemas to prevent Angular template parser errors
- Use `init="false"` attribute to delay auto-initialization for proper configuration

**Component Structure**
- Create a main `SwiperComponent` that wraps `<swiper-container>` Web Component
- Implement `SwiperSlideDirective` for individual slides using content projection
- Support both template-driven and reactive configuration through signals
- Use `viewChild()` signal or `viewChild.required()` for element access: `readonly swiperEl = viewChild.required<ElementRef<SwiperContainer>>('swiperEl')`
- Use `contentChildren()` for accessing projected slides if needed
- Implement proper lifecycle hooks (OnInit, AfterViewInit, OnDestroy)
- Use Object.assign() to pass configuration as properties to the swiper element before initialization

**Configuration Management**
- Create comprehensive TypeScript interfaces matching SwiperOptions from Swiper.js
- Support all Swiper parameters: slidesPerView, spaceBetween, direction, loop, autoplay, navigation, pagination, scrollbar, etc.
- Implement breakpoints configuration for responsive design using `{ [width: number]: SwiperOptions }`
- Support for effect configuration (slide, fade, cube, coverflow, flip, cards, creative)
- Enable module-specific options (zoom, virtual, thumbs, etc.)
- Use signals for reactive configuration: `readonly config = input<SwiperOptions>()`
- Support both boolean (default settings) and object configuration for modules
- Handle dynamic updates using `swiperEl().nativeElement.swiper.update()` after slide changes
- Use `effect()` from Angular signals to react to configuration changes

**Example Component Implementation:**
```typescript
@Component({
  selector: 'ngx-swiper',
  template: `
    <swiper-container #swiperEl init="false">
      @for (slide of slides(); track slide.id) {
        <swiper-slide>
          @if (slideTemplate()) {
            <ng-container [ngTemplateOutlet]="slideTemplate()" 
                          [ngTemplateOutletContext]="{ slide: slide, index: $index }">
            </ng-container>
          } @else {
            <ng-content></ng-content>
          }
        </swiper-slide>
      }
    </swiper-container>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
  // Modern Angular APIs
  readonly config = input<SwiperOptions>({});
  readonly slides = input<SlideData[]>([]);
  readonly activeIndex = model<number>(0);
  readonly slideTemplate = input<TemplateRef<any> | null>(null);
  
  // Output signals
  readonly slideChange = output<number>();
  readonly reachEnd = output<void>();
  readonly init = output<void>();
  
  // ViewChild signal
  readonly swiperEl = viewChild.required<ElementRef<SwiperContainer>>('swiperEl');
  
  // Services injection
  readonly #destroyRef = inject(DestroyRef);
  readonly #renderer = inject(Renderer2);
  
  constructor() {
    // Reactive effect for configuration
    effect(() => {
      const swiperElement = this.swiperEl()?.nativeElement;
      const options = this.config();
      const slideData = this.slides();
      
      if (swiperElement && slideData.length > 0) {
        Object.assign(swiperElement, options);
        swiperElement.initialize();
      }
    });
  }
}
```

**Event Handling**
- Swiper Web Component emits DOM events prefixed with "swiper" (e.g., "swiperslidechange", "swiperreachend")
- Event details contain Swiper instance and additional data in `event.detail` array
- Use modern Angular output() function: `readonly slideChange = output<number>()`, `readonly reachEnd = output<void>()`
- Map Swiper.js events to Angular events using addEventListener on the swiper element
- Provide access to Swiper instance through `swiperEl().nativeElement.swiper` (using viewChild signal)
- Support custom event handlers through configuration using `on: { [eventName]: handler }`
- Use `eventsPrefix` parameter to control event naming (default "swiper")
- Use effect() to set up event listeners reactively when swiper element is available

**Styling Integration**
- Import Swiper CSS styles: core CSS (`swiper/css`) and module-specific CSS (`swiper/css/navigation`, `swiper/css/pagination`, etc.)
- Use `swiper/css/bundle` for all styles or selective imports for tree-shaking
- Support for custom CSS classes through Swiper configuration
- Enable Tailwind/DaisyUI integration for styling with proper CSS variable support
- Handle Shadow DOM styling with `injectStyles` and `injectStylesUrls` parameters for deep customization
- Provide SCSS variables for theming using Swiper's CSS custom properties
- Support for effect-specific styles (fade, cube, coverflow, etc.)

**Module System**
- All Swiper modules are available when using `swiper/element/bundle` after calling `register()`
- No need for manual module imports or `Swiper.use()` calls with Web Component approach
- Create modular architecture supporting selective Swiper.js modules through configuration
- Enable tree-shaking for unused modules with selective CSS imports
- Support for module-specific methods and properties access through swiper instance
- Provide configuration interfaces for each module with proper TypeScript definitions

**Template Structure**
```typescript
// Basic usage example with Web Component approach and new Angular control flow:
<swiper-container #swiperEl init="false" [attr.slides-per-view]="config()?.slidesPerView">
  @for (slide of slides(); track slide.id) {
    <swiper-slide>
      <!-- Slide content projection -->
      <ng-content [ngTemplateOutlet]="slideTemplate" 
                  [ngTemplateOutletContext]="{ slide: slide, index: $index }">
      </ng-content>
    </swiper-slide>
  }
</swiper-container>

// Advanced usage with configuration and new control flow:
<ngx-swiper [config]="swiperConfig" [slides]="slideData" 
           (slideChange)="onSlideChange($event)"
           (reachEnd)="onReachEnd($event)">
  <ng-template #slideTemplate let-slide="slide" let-index="index">
    @if (slide.imageUrl) {
      <img [src]="slide.imageUrl" [alt]="slide.title" loading="lazy">
    }
    @if (slide.title) {
      <h3>{{ slide.title }}</h3>
    }
  </ng-template>
</ngx-swiper>

// Conditional rendering with new syntax:
@if (showSwiper()) {
  <ngx-swiper [config]="swiperConfig">
    @for (item of items(); track item.id) {
      <ng-container ngxSwiperSlide>
        @switch (item.type) {
          @case ('image') {
            <img [src]="item.url" [alt]="item.alt">
          }
          @case ('video') {
            <video [src]="item.url" controls></video>
          }
          @default {
            <p>{{ item.content }}</p>
          }
        }
      </ng-container>
    }
  </ngx-swiper>
}
```

**Component API Requirements**
- Use modern Angular input signals: `readonly config = input<SwiperOptions>()`
- Input signal for slide data: `readonly slides = input<ReadonlyArray<SlideData>>()`
- Use output() for events: `readonly slideChange = output<number>()`, `readonly reachEnd = output<void>()`
- Use viewChild() signal for element access: `readonly swiperEl = viewChild.required<ElementRef<SwiperContainer>>('swiperEl')`
- Methods to access and control Swiper instance: `nextSlide()`, `prevSlide()`, `slideTo(index)`, `update()`, `destroy()`
- Template reference support with proper viewChild integration using signals
- Support for dynamic slide addition/removal using Swiper manipulation methods
- Two-way binding support using model() signal: `readonly activeIndex = model<number>(0)`
- Cleanup handling in ngOnDestroy with `swiper.destroy()` call

**TypeScript Interfaces**
- Define comprehensive interfaces for Swiper configuration with complete module support
- Export types for Navigation, Pagination, Scrollbar, Autoplay, Effects options
- Create union types for effect names, directions, etc.
- Support for breakpoint configuration types with nested SwiperOptions
- Event payload interfaces for all Swiper events
- Complete SwiperOptions interface structure:

```typescript
interface SwiperOptions {
  // Core parameters
  direction?: 'horizontal' | 'vertical';
  initialSlide?: number;
  speed?: number;
  autoHeight?: boolean;
  loop?: boolean;
  loopFillGroupWithBlank?: boolean;
  slidesPerView?: number | 'auto';
  slidesPerGroup?: number;
  spaceBetween?: number;
  centeredSlides?: boolean;
  cssMode?: boolean;
  grabCursor?: boolean;
  
  // Responsive breakpoints
  breakpoints?: { [width: number]: Partial<SwiperOptions> };
  
  // Module parameters (boolean for defaults or object for configuration)
  navigation?: boolean | SwiperNavigationOptions;
  pagination?: boolean | SwiperPaginationOptions;
  scrollbar?: boolean | SwiperScrollbarOptions;
  autoplay?: boolean | SwiperAutoplayOptions;
  freeMode?: boolean | SwiperFreeModeOptions;
  grid?: SwiperGridOptions;
  keyboard?: boolean | SwiperKeyboardOptions;
  mousewheel?: boolean | SwiperMousewheelOptions;
  zoom?: boolean | SwiperZoomOptions;
  parallax?: boolean;
  virtual?: boolean | SwiperVirtualOptions;
  thumbs?: SwiperThumbsOptions;
  controller?: SwiperControllerOptions;
  a11y?: boolean | SwiperA11yOptions;
  history?: boolean | SwiperHistoryOptions;
  hashNavigation?: boolean | SwiperHashNavigationOptions;
  
  // Effects
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'creative' | 'cards';
  fadeEffect?: SwiperFadeEffectOptions;
  cubeEffect?: SwiperCubeEffectOptions;
  flipEffect?: SwiperFlipEffectOptions;
  coverflowEffect?: SwiperCoverflowEffectOptions;
  creativeEffect?: SwiperCreativeEffectOptions;
  cardsEffect?: SwiperCardsEffectOptions;
  
  // Event handlers
  on?: { [eventName: string]: (...args: any[]) => void };
  
  // Web Component specific
  eventsPrefix?: string;
  injectStyles?: string[];
  injectStylesUrls?: string[];
}
```

**Performance Considerations**
- Implement proper change detection strategy
- Use OnPush when possible
- Proper cleanup of event listeners
- Memory management for large slide sets
- Support for virtual slides functionality

**Accessibility**
- Implement A11y module integration
- Support for ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

**Testing Requirements**
- Unit tests for component logic
- Integration tests for Swiper.js integration
- E2E tests for slider functionality
- Performance testing for large datasets
- Accessibility testing

**Documentation Requirements**
- Comprehensive API documentation
- Usage examples for all major features
- Migration guides
- Performance best practices
- Accessibility guidelines

**Coding rules**

**You are an Angular, CSS, and TypeScript expert focused on creating scalable and high-performance web applications. Your role is to provide code examples and guidance that adhere to best practices in modularity, performance, and maintainability, following strict type safety, clear naming conventions, and Angular's official style guide.**

**Key Development Principles**
1. **Provide Concise Examples**  
   Share precise Angular and TypeScript examples with clear explanations.

2. **Immutability & Pure Functions**  
   Apply immutability principles and pure functions wherever possible, especially within services and state management, to ensure predictable outcomes and simplified debugging.

3. **Component Composition**  
   Favor component composition over inheritance to enhance modularity, enabling reusability and easy maintenance.

4. **Meaningful Naming**  
   Use descriptive variable names like `isSwiperInitialized`, `slideConfig`, and `initializeSwiper()` to communicate intent clearly.

5. **File Naming**  
   Enforce kebab-case naming for files (e.g., `swiper-slide.directive.ts`) and match Angular's conventions for file suffixes (e.g., `.component.ts`, `.service.ts`, etc.).

**Angular and TypeScript Best Practices**
- **Type Safety with Interfaces**  
  Define data models using interfaces for explicit types and maintain strict typing to avoid `any`.

- **Full Utilization of TypeScript**  
  Avoid using `any`; instead, use TypeScript's type system to define specific types and ensure code reliability and ease of refactoring.

- **Organized Code Structure**  
  Structure files with imports at the top, followed by class definition, properties, methods, and ending with exports.

- **Optional Chaining & Nullish Coalescing**  
  Leverage optional chaining (`?.`) and nullish coalescing (`??`) to prevent null/undefined errors elegantly.

- **Standalone Components**  
  Use standalone components as appropriate, promoting code reusability without relying on Angular modules. Components use the standalone property: true by default, you don't need to set it.

- **Control flow**
  Use built-in control flow instead of directive ngIf, ngFor...

- **Signals Two-way binding**
  Try using model() for the Two-way binding for ngModel of the template

- **Signals inputs and queries**
  Do not use @Input, @Output, @ViewChild..., you use their variants with signals like input(), input.required(), viewChild()...

- **Signals for Reactive State Management**  
  Utilize Angular's signals system for efficient and reactive programming, enhancing both state handling and rendering performance, Here is a cheatsheet on how to use signals properly https://www.codigotipado.com/p/angular-signals-cheatsheet

- **Signals Redux and Stores**  
  For store, use NgRx Signals (not the traditional NgRx), here you have the documentation of ngrx/signals https://ngrx.io/guide/store/walkthrough

- **Direct Service Injection with `inject`**  
  Use the `inject` function to inject services directly within component logic, directives, or services, reducing boilerplate code.

**Coding Standards**
- Use single quotes (`'`) for string literals.
- Use 2-space indentation.
- Avoid trailing whitespace and unused variables.
- Prefer `const` for constants and immutable variables.
- Utilize template literals for string interpolation and multi-line strings.
- whenever you are going to write an attribute or a public method of a class, put the tag public

**Angular-Specific Development Guidelines**
- Use `async` pipe for observables in templates to simplify subscription management.
- Enable lazy loading for feature modules, optimizing initial load times.
- Ensure accessibility by using semantic HTML and relevant ARIA attributes.
- Use Angular's signals system for efficient reactive state management.
- For images, use `NgOptimizedImage` to improve loading and prevent broken links in case of failures.
- Implement deferrable views to delay rendering of non-essential components until they're needed.
- do not use inline templates unless they are components of less than 4 lines of html.
- if the component is not going to have styles in its css or scss file, do not create it and do not put the styleurls.
- all attributes or variables on which an inject() is performed must be readonly
- all the variables or attributes of a class that are signals should be readonly
- by default the services injected into a component should be readonly and private
- whenever you inject a store created with ngrx/signals into a component, it must be readonly and public.

**HTML-Specific Development Guidelines**
- try to use elements like main, section etc to organize the content and not just divs
- use tailwind's @apply to apply styles and variables in css files
- always use css element nesting

**Tailwind-Specific and DaisyUI-Specific Development Guidelines**
- Tailwind classes are applied directly in HTML templates
- Prefer Tailwind utility classes instead of custom CSS
- For reusable components, use @apply in style files
- The `tailwind.config.js` file contains all customizations
- Use Tailwind CSS for styling components, following a utility-first approach.
- Leverage daisyUI's pre-built components for quick UI development.- Follow a consistent design language using Tailwind CSS classes and daisyUI themes.
- Implement responsive design and dark mode using Tailwind and daisyUI utilities.
- Optimize for accessibility (e.g., aria-attributes) when using components.
- When possible, use the predefined components before creating customizations.
- DaisyUI customizations are found in `tailwind.config.js` under the daisyui property.
- you have references to tailwind classes at https://nerdcave.com/tailwind-cheat-sheet
- daisyUI components are available at https://daisyui.com/components/.

**CSS-Specific Development Guidelines**
- If possible try using tailwind and DaisyUI classes instead of writing css  
- use tailwind's @apply to apply styles and variables in css files
- always use css element nesting

**Error Handling and Validation**
- Apply robust error handling in services and components, using custom error types or error factories as needed.
- Implement validation through Angular's form validation system or custom validators where applicable.

**Performance Optimization**
- Utilize trackBy functions with `ngFor` to optimize list rendering.
- Apply pure pipes for computationally heavy operations, ensuring that recalculations occur only when inputs change.
- Avoid direct DOM manipulation by relying on Angular's templating engine.
- Leverage Angular's signals system to reduce unnecessary re-renders and optimize state handling.
- Use `NgOptimizedImage` for faster, more efficient image loading.

**Security Best Practices**
- Prevent XSS by relying on Angular's built-in sanitization and avoiding `innerHTML`.
- Sanitize dynamic content using Angular's trusted sanitization methods to prevent vulnerabilities.

**Core Principles**
- Use Angular's dependency injection and `inject` function to streamline service injections.
- Focus on reusable, modular code that aligns with Angular's style guide and industry best practices.
- Continuously optimize for core Web Vitals, especially Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).

**Reference**  
Refer to Angular's official documentation for components, services, and modules to ensure best practices and maintain code quality and maintainability.