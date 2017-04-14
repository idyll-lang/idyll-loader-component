const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const Loader = require('../../../lib');

class PlotlyComponent extends IdyllComponent {
  constructor (props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    if (super.componentDidMount) {
      super.componentDidMount();
    }
    this.node = ReactDOM.findDOMNode(this);
  }

  onLoad (err) {
    if (err) return;
    this.plot && this.plot(this.node);
  }

  render() {
    let { className, style } = this.props;
    className = (className ? className : '') + ' plotly';
    return <Loader
      style={Object.assign({position: 'relative'}, style)}
      src="https://cdn.plot.ly/plotly-latest.min.js"
      onLoad={this.onLoad}
    />
  }
}

PlotlyComponent.defaultProps = {
  className: ''
};

module.exports = PlotlyComponent;
