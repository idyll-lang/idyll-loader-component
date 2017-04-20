const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const Loader = require('../../../lib');

class PlotlyComponent extends IdyllComponent {
  constructor (props) {
    super(props);

    this.state = {
      scriptLoaded: false,

      needsSrc: !!props.src,
      dataSrcLoading: false,
      dataSrcLoaded: false,
      dataSrcError: null,
    }

    // Putting this on state  adds a whole complex async batching
    // thing that we definitely don't want any part of.
    this.initialPlot = false;

    // TODO: class property transform ftw
    this.isLoading = this.isLoading.bind(this);
    this.fetchSrc = this.fetchSrc.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.plot = this.plot.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    if (super.componentDidMount) super.componentDidMount();
    this.node = ReactDOM.findDOMNode(this);

    if (this.state.needsSrc) {
      this.fetchSrc()
    }

    if (this.props.autoresize && window) {
      this.onResize = () => {
        this.resize(this.node, this.node.offsetWidth, this.node.offsetHeight);
      }

      window.addEventListener('resize', this.onResize);
    }
  }

  resize (gd, width, height) {
    if (!gd || !gd._fullLayout) return;
    Plotly.relayout(gd, {width: width, height: height});
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.initialPlot) return;

    if (nextState.scriptLoaded && (!nextState.needsSrc || nextState.dataSrcLoaded)) {
      this.plot(this.node, this.data);
      this.initialPlot = true;
    }
  }

  componentWillUnmount () {
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  fetchSrc () {
    this.setState({dataSrcLoading: true});

    fetch(this.props.src).then(resp => {
      return resp.json().then(json => {
        this.data = json;
        this.setState({
          dataSrcLoading: false,
          dataSrcLoaded: true,
          dataSrcError: null
        });
      });
    }).catch((err) => {
      this.setState({
        dataSrcLoading: false,
        dataSrcLoaded: false,
        dataSrcError: 'Failed to fetch "' + this.props.src + '"'
      });
    });
  }

  onLoad (err, data) {
    if (err) return;
    if (data) this.data = data;
    this.setState({scriptLoaded: true});
  }

  plot (gd, data) {
    Plotly.plot(gd, data || this.data);
  }

  isLoading (scriptLoading) {
    return scriptLoading || (
      this.state.needsSrc && this.state.dataSrcLoading && !this.state.dataSrcLoaded
    )
  }

  render() {
    let { className, style } = this.props;
    className = (className ? className : '') + ' plotly';
    return <Loader
      style={Object.assign({position: 'relative'}, style)}
      className={className}
      src="https://cdn.plot.ly/plotly-latest.js"
      scrollwatch={this.props.scrollwatch}
      scrollrange={this.props.scrollrange}
      loadScriptImmediately={false}
      onLoad={this.onLoad}
      isLoading={this.isLoading}
      error={this.state.dataSrcError}
    />
  }
}

PlotlyComponent.defaultProps = {
  className: '',
  scrollwatch: true,
  scrollrange: 200,
  autoresize: true
};

module.exports = PlotlyComponent;
