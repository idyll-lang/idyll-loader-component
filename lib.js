const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
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

class Loader extends IdyllComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: props.skip,
      loading: false,
      error: null
    };

    this.loadIssued = false;

    this.isLoading = this.isLoading.bind(this);
    this.onEnteredView = this.onEnteredView.bind(this);
    this.onExitView = this.onExitView.bind(this);
    this.load = this.load.bind(this);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);

    var sw = new ScrollWatch({
      watch: fullPath(this.node),
      onElementInView: this.onEnteredView,
      onElementOutOfView: this.onExitView,
      watchOnce: false
    });

    console.log('this.props.loadOnVisble:', this.props.loadOnVisible);
    if (!this.props.loadOnVisible) this.load();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.loadOnVisible && nextState.visible) {
      this.load();
    }
  }

  load() {
    // Prevent double-load:
    if (this.loadIssued) return;
    this.loadIssued = true;

    console.log('this.props.src:', this.props.src);
    loader.load(this.props.src, err => {
      console.log('loaded!', err);
      this.props.onLoad && this.props.onLoad(err);
      this.setState({
        loaded: true,
        loading: false,
        error: err
      });
    }, {
      verbose: this.props.verbose,
      scriptId: this.props.scriptId
    });
  }

  onEnteredView() {
    this.setState({
      hasBeenVisible: true,
      visible: true
    });
  }

  onExitView() {
    this.setState({ visible: false });
  }

  renderLoader() {
    var loaderStyles = {
      textAlign: 'center',
      backgroundColor: '#EAE7D6',
      border: '1px solid #DAD7C6',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px'
    };

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
    var errorStyles = {
      textAlign: 'left',
      backgroundColor: '#EAE7D6',
      border: '1px solid #DAD7C6',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      fontFamily: 'monospace',
      padding: '15px',
      color: '#f32'
    };
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
    return React.createElement(
      'div',
      {
        style: this.props.style,
        className: (this.props.className ? this.props.className : '') + ' idyll-loader'
      },
      (this.props.isLoading || this.isLoading)(this.state.loading) ? (this.props.renderLoader || this.renderLoader)() : this.props.error || this.state.error ? (this.props.renderError || this.renderError)(typeof this.props.error === 'string' ? this.props.error : this.state.error) : this.props.children
    );
  }
}

Loader.defaultProps = {
  className: '',
  loadOnVisible: false,
  verbose: false,
  skip: false
};

module.exports = Loader;
