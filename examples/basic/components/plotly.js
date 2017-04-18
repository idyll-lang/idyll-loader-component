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
  }

  componentDidMount() {
    if (super.componentDidMount) super.componentDidMount();
    this.node = ReactDOM.findDOMNode(this);

    if (this.state.needsSrc) {
      this.fetchSrc()
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.initialPlot) return;

    if (nextState.scriptLoaded && (!nextState.needsSrc || nextState.dataSrcLoaded)) {
      this.plot(this.node, this.data);
      this.initialPlot = true;
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
    Plotly.plot(gd || this.node, data || this.data);
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
      src="data/plotly-basic.min.js"
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
  scrollrange: 0
};

module.exports = PlotlyComponent;
