# [wip] idyll-lodaer-component

> An [idyll](https://github.com/idyll-lang/idyll) component to manage asynchronous display and loading

## Introduction

This component helps manage asynchronous display so you don't have to block a whole page load for a complicated feature below the fold. It combines external script loading with visibility checking.

## Usage

To display content when it becomes visible:

```
[Loader range:100]
  This is just ordinary text that shows up
  when you scroll to within 100 pixels of it
[/Loader]
```

If you require a cdn script to display content, you can use the loader component to load it only when necessary:

```javascript
var Loader = require('idyll-loader-component')
var IdyllComponent = require('idyll-component')

class PlotlyComponent extends IdyllComponent {
  doSomethingComplex = () => {
    // this is executed only *after* the cdn script 
    // has been loaded *and* when you're within 100
    // pixels of viewing the element
  }

  render () {
    return <Loader
      scrollwatch={true}
      scrollrange={100}
      src="http://uri/of/my/cdn-script.js"
      loadScriptImmediately={true}
      onLoad={this.doSomethingComplex.bind(this)}
      renderLoader={() => {...}}
      renderError={msg => {...}}
    />
      Children here...
    </Loader>
  }
}
```

If you have more that one of these components, the cdn script will only be loaded once.

## API

Props:

- `scrollwatch?: boolean`: When true, checks components for visibility. Otherwise loads immediately. Default is true.
- `scrollrange?: number`: range outside of the view at which components are deemed visible
- `loadScriptImmediately?: boolean `: When true, loads the script immediately. Otherwise defers load until component is displayed
- `error?: string`: override the state of the component and force the display of an externally supplied error message
- `loaderStyles?: object`: When using default loader display, an object of overrides merge into the default styles
- `errorStyles?: object`: When using default error display, an object of overrides merge into the default styles
- `renderLoader?: function`: override the default loader with a custom element
- `renderError?: function(message: string)`: override the default error display with a custom element.
- `className?: string`: css class applied to element
- `style?: object`: object of styles


