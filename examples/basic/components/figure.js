const React = require('react');
const ReactDOM = require('react-dom');

class Figure extends React.Component {
  getChildContext () {
    return {
      number: this.props.number,
      format: this.props.format
    }
  }
  render () {
    return <figure className="idyll-figure">
      {this.props.children}
    </figure>
  }
}

Figure.defaultProps = {
  format: "Figure %i."
}

Figure.childContextTypes = {
  number: React.PropTypes.number,
  format: React.PropTypes.string
}

module.exports = Figure;
