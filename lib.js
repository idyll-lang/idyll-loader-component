const React = require('react');
const ReactDOM = require('react-dom');
const loader = require('./script-loader');
const ScrollWatch = require('scrollwatch');

//http://stackoverflow.com/questions/4588119/get-elements-css-selector-when-it-doesnt-have-an-id
function fullPath(el) {
  var names = [];
  while (el.parentNode) {
    if (el.id) {
      names.unshift('#' + el.id);
      break;
    } else {
      if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);else {
        for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
        names.unshift(el.tagName + ":nth-child(" + c + ")");
      }
      el = el.parentNode;
    }
  }
  return names.join(" > ");
}

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      loaded: props.skip,
      loading: true, // So that it's loading in the static version
      error: null
    };

    this.loadIssued = false;

    this.isLoading = this.isLoading.bind(this);
    this.onEnteredView = this.onEnteredView.bind(this);
    this.onExitView = this.onExitView.bind(this);
    this.loadScript = this.loadScript.bind(this);
    this.renderLoader = this.renderLoader.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);

    if (this.props.scrollwatch) {
      var sw = new ScrollWatch({
        watch: fullPath(this.node),
        onElementInView: this.onEnteredView,
        onElementOutOfView: this.onExitView,
        watchOnce: false,
        watchOffset: this.props.scrollrange
      });
    }

    if (!this.props.scrollwatch || this.props.loadScriptImmediately) this.loadScript();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.display) return false;

    if ((this.props.readyForScriptLoad || this.readyForScriptLoad)(nextProps.scrollwatch, nextState.hasBeenVisible)) {
      this.loadScript();
    }

    if ((this.props.readyForDisplay || this.readyForDisplay)(nextState.loaded, nextProps.scrollwatch, nextState.hasBeenVisible)) {
      this.setState({ display: true });
    }

    if (nextState.display) {
      this.onLoad();
    }
  }

  readyForScriptLoad(hasScrollwatch, hasBeenVisible) {
    return !hasScrollwatch || hasScrollwatch && hasBeenVisible;
  }

  readyForDisplay(scriptLoaded, hasScrollwatch, hasBeenVisible) {
    return scriptLoaded && (hasScrollwatch && hasBeenVisible || !hasScrollwatch);
  }

  loadScript() {
    // Prevent double-load:
    if (this.loadIssued) return;
    this.loadIssued = true;

    if (this.props.src) {
      loader.load(this.props.src, err => {
        this.setState({
          loaded: !err,
          loading: false,
          error: err
        });
      }, {
        verbose: this.props.debug,
        scriptId: this.props.scriptId
      });
    } else {
      this.setState({
        loaded: true,
        loading: false,
        error: null
      });
    }
  }

  onLoad() {
    if (this.calledOnLoad) return;
    this.calledOnLoad = true;
    this.props.onLoad && this.props.onLoad(this.state.error);
  }

  onEnteredView() {
    this.setState({
      hasBeenVisible: true,
      visible: true
    });
  }

  onExitView() {
    this.setState({
      visible: false
    });
  }

  renderLoader() {
    var loaderStyles = Object.assign({
      textAlign: 'center',
      backgroundColor: '#F2F3F2',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px'
    }, this.props.loaderStyles || {});

    return React.createElement(
      'div',
      { style: loaderStyles },
      React.createElement(
        'span',
        null,
        'Loading...'
      )
    );
  }

  renderError(msg) {
    var errorStyles = Object.assign({
      textAlign: 'left',
      backgroundColor: '#F2F3F2',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      fontFamily: 'monospace',
      padding: '15px',
      color: '#d32'
    }, this.props.errorStyles || {});

    return React.createElement(
      'div',
      { style: errorStyles },
      React.createElement(
        'span',
        null,
        msg
      )
    );
  }

  isLoading() {
    return this.state.loading;
  }

  render() {
    var hasError = this.props.error || this.state.error;

    // This is the negation of the above condition. The logic is a bit ugly...
    var isLoading = !this.state.loaded || (!this.props.scrollwatch || !this.state.hasBeenVisible) && this.props.scrollwatch;

    return React.createElement(
      'div',
      {
        style: this.props.style,
        className: (this.props.className ? this.props.className : '') + ' idyll-loader'
      },
      isLoading ? (this.props.renderLoader || this.renderLoader)() : hasError ? (this.props.renderError || this.renderError)(typeof this.props.error === 'string' ? this.props.error : this.state.error) : this.props.children
    );
  }
}

Loader.defaultProps = {
  className: '',
  loadScriptImmediately: false,
  scrollwatch: true,
  scrollrange: 200,
  debug: false,
  skip: false
};

module.exports = Loader;
