const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const loader = require('./script-loader')

class Loader extends IdyllComponent {
  constructor (props) {
    super(props);
    this.state = {
      loaded: props.skip,
      loading: !props.skip,
      error: null
    };
  }

  componentDidMount() {
    if (this.state.loading) {
      this.setState({loaded: false})
      loader.load(this.props.src, (err) => {
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

    const node = ReactDOM.findDOMNode(this);
  }

  renderLoader () {
    var loaderStyles = {
      textAlign: 'center',
      backgroundColor: '#EAE7D6',
      border: '1px solid #DAD7C6',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
    }

    return <div style={loaderStyles}>
      <span>Loading...</span>
    </div>
  }

  renderError (msg) {
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
    }
    return <div style={errorStyles}>
      <span>{msg}</span>
    </div>
  }

  render () {
    return <div
      style={this.props.style}
      className={(this.props.className ? this.props.className : '') + ' idyll-loader'}
    >
      {this.state.loaded ? (
        !this.state.error ? (
          this.props.children
        ) : (
          (this.props.renderError || this.renderError)(this.state.error)
        )
      ) : (
        (this.props.renderLoader || this.renderLoader)()
      )}
    </div>
  }
}

Loader.defaultProps = {
  className: '',
  verbose: false,
  skip: false
};

module.exports = Loader;
