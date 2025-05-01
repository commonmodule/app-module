# @commonmodule/app

A TypeScript/ES module that builds on top of
[`@commonmodule/ts`](https://github.com/commonmodule/ts-module) to provide
utilities for:

- **DOM manipulation** (e.g. virtual element creation, node trees)
- **Window and DOM events** (e.g. scroll, resize, custom events)
- **View management** (e.g. base `View` class, `Router` for single-page apps)
- **Internationalization** (`I18nMessageManager`, `msg`)
- **Storage** and **Auth** (`Store`, `AuthTokenManager`)
- **Theming** (`ThemeManager`, `Theme` enum)
- **Browser environment** detection (`Browser` utility)
- **Utility helpers** for DOM, images, styles, and more

---

## Table of Contents

1. [Installation](#installation)
2. [API Reference](#api-reference)
   - [DOM](#dom)
     - [DomNode](#domnode)
     - [BodyNode](#bodynode)
     - [QueriedDomNode](#querieddomnode)
     - [el() & html.impl](#el--htmlimpl)
   - [WindowEventTreeNode](#windoweventtreenode)
   - [Internationalization](#internationalization)
     - [I18nMessageManager](#i18nmessagemanager)
     - [msg()](#msg)
   - [Resource Loading](#resource-loading)
     - [FontLoader](#fontloader)
   - [View](#view)
   - [Routing](#routing)
     - [Router](#router)
   - [Authentication](#authentication)
     - [AuthTokenManager](#authtokenmanager)
   - [Storage](#storage)
     - [Store](#store)
   - [Theme Management](#theme-management)
     - [ThemeManager](#thememanager)
     - [Theme](#theme-enum)
   - [Browser Info](#browser-info)
     - [Browser](#browser)
   - [DOM Utilities](#dom-utilities)
     - [DomUtils](#domutils)
   - [Image Optimization](#image-optimization)
     - [ImageOptimizer](#imageoptimizer)
   - [Style Utilities](#style-utilities)
     - [StyleUtils](#styleutils)
   - [WebSocketClient](#websocketclient)
   - [SPAInitializer](#spainitializer)
3. [Usage Examples](#usage-examples)
4. [Contributing](#contributing)
5. [License](#license)

---

## Installation

```bash
npm install @commonmodule/app
# or
yarn add @commonmodule/app
```

> **Note**: This library depends on
> [`@commonmodule/ts`](https://github.com/commonmodule/ts-module). Make sure it
> is also installed.

---

## API Reference

### DOM

---

#### DomNode

`DomNode` is a specialized node class for creating and managing DOM elements as
a tree structure. It extends `WindowEventTreeNode` from
`@commonmodule/ts`—therefore it can dispatch and listen to events, and is also
organized in a tree-like hierarchy.

```ts
export default class DomNode<
  H extends HTMLElement = HTMLElement,
  E extends EventRecord = {},
> extends WindowEventTreeNode<DomNode, E & { visible: () => void }> {
  public htmlElement: H;
  // ...
}
```

**Key Points**:

- Maintains an internal `htmlElement: H`.
- Can be appended to other `DomNode`s, forming a nested structure that mirrors
  the DOM tree.
- Extends the event system from `WindowEventTreeNode`, which provides:
  - `onWindow`, `offWindow` for window-level events.
  - Also inherits a normal `on`, `off` for custom or node-specific events.

**Constructor**:

```ts
constructor(elementOrSelector?: H | DomSelector, ...children: DomChild<H>[])
```

- `elementOrSelector` can be either a raw DOM element (`HTMLElement`) or a
  CSS-like selector in string form (e.g. `"div#my-id.my-class"`).
- `children` can be:
  - Another `DomNode`
  - An object describing element properties and styles
  - A string (appended as text)
  - `undefined` (skipped)

**Core Methods**:

| Method                                                                     | Description                                                                                                                                                                 |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `append(...children: DomChild<H>[])`                                       | Appends children to the current node.                                                                                                                                       |
| `prepend(...children: DomChild<H>[])`                                      | Prepends children to the current node.                                                                                                                                      |
| `appendTo(parent: DomNode, index?: number): this`                          | Attaches the current node to a parent `DomNode` at a specified index in the parent’s child list.                                                                            |
| `remove()`                                                                 | Removes the current node (and its subtree) from the DOM and from its parent.                                                                                                |
| `clear(...except: (DomNode \| undefined)[])`                               | Removes all child `DomNode`s except those specified.                                                                                                                        |
| `style<T extends Partial<CSSStyleDeclaration> \| string>(styles: T)`       | If `styles` is a string, returns the style value for that CSS property. If it’s an object, applies each key-value pair to the node’s `htmlElement.style`.                   |
| `addClass(...classNames: string[]): this`                                  | Adds one or more CSS classes.                                                                                                                                               |
| `removeClass(...classNames: string[]): this`                               | Removes one or more CSS classes.                                                                                                                                            |
| `hasClass(className: string): boolean`                                     | Checks if the node has the specified CSS class.                                                                                                                             |
| `onDom<K extends keyof HTMLElementEventMap>(type: K, listener, options?)`  | Adds a native DOM event listener for this node’s `htmlElement`.                                                                                                             |
| `offDom<K extends keyof HTMLElementEventMap>(type: K, listener, options?)` | Removes a native DOM event listener from this node’s `htmlElement`.                                                                                                         |
| `calculateRect(): DOMRect`                                                 | Returns the bounding client rect of `htmlElement`.                                                                                                                          |
| `clone(): DomNode<H, E>`                                                   | Creates a new `DomNode` by cloning `htmlElement`. (Note: The cloned node does not preserve event listeners or children from the original `DomNode` structure—just the DOM.) |
| `text: string` (getter and setter)                                         | Returns or sets the node’s text content. Setting `text` clears existing children first.                                                                                     |

---

#### BodyNode

A convenience subclass of `DomNode<HTMLBodyElement>` that automatically
references `document.body`.

```ts
class BodyNode extends DomNode<HTMLBodyElement> {
  constructor() {
    super(document.body as HTMLBodyElement);
  }
}
```

**Usage**:

```ts
import BodyNode from "@commonmodule/app/dom/BodyNode.js";

const body = new BodyNode();
body.append("Hello, world!");
```

---

#### QueriedDomNode

A `DomNode` subclass that creates itself from an existing element in the
document, selected by a CSS selector string.

```ts
export default class QueriedDomNode extends DomNode {
  constructor(selector: string) {
    super(document.querySelector(selector) as HTMLElement);
  }

  protected isVisible(): boolean {
    return true;
  }
}
```

**Usage**:

```ts
import QueriedDomNode from "@commonmodule/app/dom/QueriedDomNode.js";

const existingDom = new QueriedDomNode("#already-existing-element");
existingDom.append("This is appended to the existing DOM element.");
```

---

#### el() & html.impl

A helper function for concise DOM creation, similar to other “hyperscript”
helpers (`el()` is set as `UniversalEl.impl` in the code).

```ts
export default function el<EOS extends ElementOrSelector>(
  elementOrSelector: EOS,
  ...children: DomChild<EOS>[]
): DomNode<InferElementType<EOS>>;
```

- Takes a string selector or element type (e.g. `"div"`, `"section#header"`,
  `"button.my-button"`) and optional children to append.
- Returns a `DomNode`.

There’s also an `html` helper in
[`@commonmodule/universal-page`](https://github.com/commonmodule/universal-page-module), which gets its `impl`
set here. It can parse an HTML string, take the first node from it, and wrap it
in a `DomNode`.

**Example**:

```ts
import el from "@commonmodule/app/dom/el.js";
import { html } from "@commonmodule/universal-page";

// Using the "el" function:
const myDiv = el(
  "div.my-container",
  "Hello, ",
  el("span.highlighted", "World!"),
);
document.body.appendChild(myDiv.htmlElement);

// Using the "html" function:
const someHtml = html("<p>Parsed from raw HTML</p>");
document.body.appendChild(someHtml.htmlElement);
```

---

### WindowEventTreeNode

`WindowEventTreeNode` extends `EventTreeNode` (from `@commonmodule/ts`) to allow
easy subscription to global `window` events that automatically unsubscribe when
the node is removed.

```ts
export default class WindowEventTreeNode<
  T extends EventTreeNode<T, E>,
  E extends EventRecord,
> extends EventTreeNode<T, E> {
  // ...
}
```

**Key Methods**:

| Method                                                                   | Description                                                                                                               |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `onWindow<K extends keyof WindowEventMap>(type: K, listener, options?)`  | Binds a window-level event listener. Automatically removed when node’s `remove()` is called.                              |
| `offWindow<K extends keyof WindowEventMap>(type: K, listener, options?)` | Unbinds a previously attached window-level event listener.                                                                |
| `remove()`                                                               | Removes all window listeners (and calls `super.remove()`).                                                                |
| _Inherited from `EventTreeNode`_: `on`, `off`, `emit`, `appendTo`, etc.  | Because it extends `EventTreeNode`, you can also manage custom events and hierarchical structure as usual for tree nodes. |

---

### Internationalization

---

#### I18nMessageManager

Manages a collection of localized messages. Allows adding messages in bulk and
retrieving them by language key and message key.

```ts
class I18nMessageManager {
  public addMessage(language: string, key: string, message: string): void;
  public addMessages(
    language: string,
    messages: { [key: string]: string },
  ): void;
  public addMessagesBulk(
    messages: { [language: string]: { [key: string]: string } },
  ): void;
  public getMessage(language: string, key: string): string;
}
```

**Usage**:

- Typically used alongside the `msg()` helper for templating.
- Allows nested keys via `key.split(".")`, e.g. `"home.welcome"`.

---

#### msg()

A utility function that retrieves a message from `I18nMessageManager` in the
current browser language and performs parameter substitution with
`%{paramName}`.

```ts
export default function msg(
  key: string,
  params?: Record<string, string | number>,
): string;
```

**Example**:

```ts
import msg from "@commonmodule/app/i18n/msg.js";
import I18nMessageManager from "@commonmodule/app/i18n/I18nMessageManager.js";

// Add some messages
I18nMessageManager.addMessages("en", {
  greeting: "Hello, %{name}!",
});

I18nMessageManager.addMessages("ko", {
  greeting: "안녕하세요, %{name}!",
});

// Suppose the current Browser.languageCode = "en"
console.log(msg("greeting", { name: "Alice" }));
// => "Hello, Alice!"
```

---

### Resource Loading

---

#### FontLoader

`FontLoader` extends `ResourceLoader<boolean>` from `@commonmodule/ts`. It
manages loading and verifying that a specified font is available to the document
(either via `document.fonts` or fallback measurement technique).

```ts
export default class FontLoader extends ResourceLoader<boolean> {
  protected async loadResource(fontName: string): Promise<boolean | undefined>;
  // ...
}
```

**Key Features**:

1. **Reference-counted loading**: Once you `load(fontName)`, the loader ensures
   it’s fetched. Additional calls to `load()` for the same `fontName` will reuse
   the existing load or resource.
2. **Fallback**: If the browser does not support `document.fonts`, it uses a
   manual technique to detect font availability.

---

### View

An abstract class to represent a UI “view” or screen, with built-in event
management and cleanup.

```ts
export default abstract class View<DT = {}, CT extends DomNode = DomNode> {
  protected container!: CT;

  public changeData(data: DT): void {}
  public close(): void {}
}
```

**Key Points**:

- `View` has an internal `container` (a `DomNode` or subclass), typically the
  root node of the view’s DOM structure.
- `changeData(data: DT)` can be overridden to handle dynamic updates.
- `close()` should remove the `container` and clean up event listeners.

**addViewManagedEvent**:

This protected utility method helps you attach events to the container or other
`EventContainer`s, ensuring they’re all removed on `close()`.

```ts
protected addViewManagedEvent<T extends EventContainer<E>, E extends EventRecord, K extends keyof E>(
  target: T,
  eventName: K,
  listener: E[K],
): this
```

---

### Routing

---

#### Router

A minimal Single-Page Application (SPA) router that uses the History API. Routes
are tracked with
[`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
(or a polyfill if needed).

```ts
class Router extends EventContainer<{
  routeChanged: (pathname: `/${string}`, data: any) => void;
}> {
  public prefix = "";
  // ...
}
```

**Key Methods**:

| Method                                   | Description                                                                                                                                                                                                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add(pathname, View, exclude?)`          | Registers a route (or multiple pathnames) to render a certain `View` class. Optional `exclude` path(s) can be provided to skip this route if matched.                                                                                                          |
| `go(pathname, data?)`                    | Pushes a new history state and updates active views.                                                                                                                                                                                                           |
| `goWithoutHistory(pathname, data?)`      | Replaces the current history state (i.e. no “back” step) and updates active views.                                                                                                                                                                             |
| `updateActiveViews(data?)`               | Internal method that checks the current `location.pathname` against all routes to see which should be active or removed.                                                                                                                                       |
| _Events_: `routeChanged(pathname, data)` | Emitted after a new route is pushed/replaced.                                                                                                                                                                                                                  |
| **View Lifecycle**                       | When a route matches, Router instantiates that route’s `View` (if not already active). Once the route no longer matches, the `View` is closed. If a user revisits the route, a new instance is created (unless you store and re-use view instances somewhere). |
| **Matching**                             | Uses `URLPattern` to match `prefix + pathname`. For named segments in the pattern (e.g. `"/user/:id"`), the matched values are passed into `view.changeData(params)`. If an `excludePattern` is matched, the route is ignored.                                 |
| **Dynamic URL segments**                 | The example code uses `URLPattern({ pathname: "/some/:param" })`; matched segment groups are passed to the `View`.                                                                                                                                             |
| **Polyfill**                             | If `window.URLPattern` is not defined, [urlpattern-polyfill](https://github.com/GoogleChromeLabs/urlpattern-polyfill) is conditionally loaded.                                                                                                                 |

---

### Authentication

---

#### AuthTokenManager

`AuthTokenManager` extends `EventContainer` to manage an auth token in a
persistent `Store`. It emits a `tokenChanged` event whenever the token changes.

```ts
class AuthTokenManager<E extends EventRecord = {}> extends EventContainer<
  E & { tokenChanged: (token: string | undefined) => void }
> {
  public get token(): string | undefined;
  public set token(value: string | undefined);
}
```

- Internally uses [`Store`](#store) to store the token.
- On each assignment to `token`, fires a `tokenChanged` event.

**Usage**:

```ts
import AuthTokenManager from "@commonmodule/app/store/AuthTokenManager.js";

AuthTokenManager.on("tokenChanged", (newToken) => {
  console.log("Token updated:", newToken);
});

AuthTokenManager.token = "my-jwt-token";
// => "Token updated: my-jwt-token"
```

---

### Storage

---

#### Store

A thin wrapper around `localStorage` and `sessionStorage` with a consistent key
prefix and fallback clearing for quota errors.

```ts
export default class Store {
  constructor(name: string);
  public setTemporary<T>(key: string, value: T): void;
  public setPermanent<T>(key: string, value: T): void;
  public get<T>(key: string): T | undefined;
  public getAll<T>(): Record<string, T>;
  public remove(...keys: string[]): void;
  public clear(): void;
  public isPermanent(key: string): boolean;
}
```

**Key Details**:

- `name`: a prefix in **kebab-case** appended to all keys.
  - E.g., if `name = "my-app"`, a call to `setPermanent("theme", "light")`
    stores the key as `"my-app/theme"`.
- `setTemporary()` uses `sessionStorage`, `setPermanent()` uses `localStorage`.
- If a quota-exceeded error occurs, it clears the storage entirely and reloads
  the page.
- `isStorageAvailable()` is a static method to detect if storage is accessible.

---

### Theme Management

---

#### ThemeManager

Uses a `Store` to remember the current theme choice. Toggles and applies a
`data-theme` attribute to the `<html>` element.

```ts
class ThemeManager {
  public init(): void;
  public get theme(): Theme; // returns the user-preferred theme or Theme.Auto
  public set theme(theme: Theme); // sets and persists the theme
  public getShowingTheme(): Theme;
  public toggleTheme(): void;
}
```

**Key Points**:

- `Theme.Auto` uses the OS-level dark/light preference.
- The manager calls
  `document.documentElement.setAttribute("data-theme", "dark" | "light")`.
- You can style your app via CSS attribute selectors (e.g.
  `[data-theme="dark"] { ... }`).

---

#### Theme (enum)

Represents a tri-state theme mode:

```ts
enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}
```

---

### Browser Info

---

#### Browser

A collection of platform-related checks, full screen methods, sharing,
downloading, and language preference.

```ts
class Browser {
  public isAndroid(): boolean;
  public isIOS(): boolean;
  public isMobileDevice(): boolean;
  public isPageVisible(): boolean;
  public hasPageFocus(): boolean;
  public isDarkMode(): boolean;

  public get languageCode(): string;
  public set languageCode(lang: string);

  public async share(data: { title: string; url: string }): Promise<void>;
  public async download(url: string): Promise<void>;

  public enterFullscreen(domNode: DomNode): void;
  public exitFullscreen(): void;
  public isFullscreen(): boolean;
}
```

**Notes**:

- Stores language preference in a `Store` by default, falling back to
  `navigator.language`.
- On mobile, calls `navigator.share` if available; otherwise, copies the URL to
  clipboard.
- `enterFullscreen` and `exitFullscreen` rely on the modern fullscreen API.

---

### DOM Utilities

---

#### DomUtils

Provides helper methods for certain device quirks, such as simulating a
`contextmenu` event on iOS.

```ts
class DomUtils {
  public enhanceWithContextMenu(
    dom: DomNode,
    handler: (event: MouseEvent) => void,
  ): void;
}
```

- On iOS Safari, there's no native “long-press to show context menu.” This
  method replicates it by detecting a long press (`touchstart` + `setTimeout`)
  and firing the handler as if it were `contextmenu`.

---

### Image Optimization

---

#### ImageOptimizer

A utility for resizing and recompressing single-frame images client-side,
converting them to JPEG by default. It also checks whether a GIF is animated
and, if so, refuses to compress it.

```ts
class ImageOptimizer {
  public async optimizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
  ): Promise<File>;
}
```

**Features**:

- If the new (compressed) blob is bigger than original, it returns the original.
- Rejects animated GIFs with an error (`"Animated GIFs are not compressed."`).

---

### Style Utilities

---

#### StyleUtils

A small helper for advanced CSS styling:

```ts
class StyleUtils {
  public applyTextStroke(target: DomNode, width: number, color: string): void;
}
```

- `applyTextStroke` creates multiple `text-shadow` offsets for a “text stroke”
  effect, since actual `-webkit-text-stroke` is unsupported in some browsers.

---

### WebSocketClient

An example `WebSocketClient` that extends `EventContainer` (from
`@commonmodule/ts`) and implements the `RealtimeClient` interface. Reconnects
automatically on close.

```ts
export default class WebSocketClient
  extends EventContainer<{ connect: () => void; disconnect: () => void }>
  implements RealtimeClient {
  constructor(private url: string);
  public send(data: string): void;
  public onMessage(handler: (message: string) => void): void;
  public isConnected(): boolean;
}
```

**Usage**:

```ts
import WebSocketClient from "@commonmodule/app/network/WebSocketClient.js";

const client = new WebSocketClient("wss://example.com/socket");
client.on("connect", () => {
  console.log("Connected");
  client.send("Hello from client!");
});

client.onMessage((data) => {
  console.log("Received:", data);
});
```

---

### SPAInitializer

An optional helper that checks for an “initial path” in `sessionStorage` and
redirects the router to that path if it exists. Useful for certain post-redirect
flows.

```ts
class SPAInitializer {
  public init(): void;
}
```

- Looks for `sessionStorage["initialPath"]`, calls `Router.goWithoutHistory`,
  then clears it.

---

## Usage Examples

### 1. Simple App Setup

```ts
// main.ts
import el from "@commonmodule/app/dom/el.js";
import BodyNode from "@commonmodule/app/dom/BodyNode.js";
import Router from "@commonmodule/app/route/Router.js";
import SPAInitializer from "@commonmodule/app/SPAInitializer.js";
import View from "@commonmodule/app/view/View.js";

// 1) Initialize Body
const body = new BodyNode();

// 2) Create a simple View
class HomeView extends View {
  constructor() {
    super();
    this.container = el("div.home-view", "Hello, home view!");
    body.append(this.container);
  }
}

// 3) Set up Router
Router.add("/home", HomeView);

// 4) Initialize SPA (if you want to handle stored initial path)
SPAInitializer.init();

// 5) Start your app
Router.go("/home");
```

### 2. Using `DomNode` for Complex UI

```ts
import el from "@commonmodule/app/dom/el.js";

const card = el(
  "div.card",
  { style: { border: "1px solid #ccc", padding: "1em" } },
  el("h2", "Title"),
  el("p", "Some paragraph text..."),
  el("button", "Click me!"),
);

document.body.appendChild(card.htmlElement);
```

### 3. Storing and Retrieving Data

```ts
import Store from "@commonmodule/app/store/Store.js";

const store = new Store("my-app");
store.setTemporary("sessionKey", "temp-value");
store.setPermanent("accessToken", "xyz123");

console.log(store.get("sessionKey")); // "temp-value"
console.log(store.isPermanent("accessToken")); // true
```

### 4. Theming

```ts
import ThemeManager from "@commonmodule/app/theme/ThemeManager.js";
import Theme from "@commonmodule/app/theme/Theme.js";

// Ensure the manager syncs with DOM
ThemeManager.init();

// Toggle
ThemeManager.toggleTheme();

// Or set a specific theme
ThemeManager.theme = Theme.Dark;
```

### 5. Internationalization

```ts
import I18nMessageManager from "@commonmodule/app/i18n/I18nMessageManager.js";
import msg from "@commonmodule/app/i18n/msg.js";
import Browser from "@commonmodule/app/utils/Browser.js";

// Add some sample translations
I18nMessageManager.addMessages("en", {
  welcome: "Welcome, %{name}!",
});
I18nMessageManager.addMessages("ko", {
  welcome: "환영합니다, %{name}!",
});

// Switch language
Browser.languageCode = "ko";

console.log(msg("welcome", { name: "Alice" }));
// => "환영합니다, Alice!"
```

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Make your changes and commit: `git commit -m 'Add my feature'`.
4. Push the changes: `git push origin feature/my-feature`.
5. Create a pull request.

---

## License

This module is provided under the **MIT License**. See the [LICENSE](./LICENSE)
file for details.

---

**Author**: [yj.gaia](https://github.com/yjgaia)\
**Based on**: [@commonmodule/ts](https://github.com/commonmodule/ts-module)
