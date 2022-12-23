# Who dis?

This file is to help track [potential] changes and differences between this tracker and Umami's.

<br>


## Changes

- Drop support for Microsoft's (Edge and IE) tracking protection. 
  - Why? They rely on `Window.external` which is deprecated and only available for backwards compat. [See MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/external). Modern DoNotTrack will still be respected though.
- CSS events dropped.
  - Sorry. But I dare to bet there would be some performance gained by getting rid of the DOM mutation observer.
- Auto-track ~~impossible~~ disabled.
  - The goal of this lib is to make things as explicit as possible. Besides, you probably should not put this script in your `<head>`.


## Possible Changes

- Anything else?
