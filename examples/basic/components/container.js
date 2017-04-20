const React = require('react');
const ReactDOM = require('react-dom');
const xtend = require('xtend');

class Container extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      expandLeft: 0,
      expandRight: 0
    };

    this.setPosition = this.setPosition.bind(this);

    window.addEventListener('resize', this.setPosition);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this)
    this.setPosition();
  }

  shouldComponentUpdate (nextProps, nextState) {
    return Math.round(nextState.expandLeft) !== Math.round(this.state.expandLeft) ||
           Math.round(nextState.expandRight) !== Math.round(this.state.expandRight);
  }

  setPosition () {
    var rect = this.node.getBoundingClientRect();
    var pageWidth = window.innerWidth;
    var expandLeft = this.props.expandLeft === undefined ? this.props.expand : this.props.expandLeft;
    var expandRight = this.props.expandRight === undefined ? this.props.expand : this.props.expandRight;
    var left = Math.max(rect.left - expandLeft, this.props.padding);
    var right = Math.min(rect.right + expandRight, pageWidth - this.props.padding);

    this.setState({
      expandLeft: left - rect.left,
      expandRight: rect.right - right
    });
  }

  render () {
    var expandStyle = xtend({
      marginLeft: this.state.expandLeft,
      marginRight: this.state.expandRight
    }, this.props.style || {});

    return <div>
      <div style={expandStyle}>
        {this.props.children}
      </div>
    </div>
  }
}

Container.defaultProps = {
  padding: 15,
  expand: 0
}

module.exports = Container;
