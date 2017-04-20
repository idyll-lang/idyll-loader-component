const React = require('react');
const ReactDOM = require('react-dom');

class Fig extends React.Component {
  constructor (props) {
    super(props);
    this.id = "figure-" + (props.number === undefined ? Math.floor(Math.random() * 1e6) : props.number)
  }

  getChildContext () {
    return {
      number: this.props.number,
      format: this.props.format
    }
  }

  render () {
    return <figure className="idyll-figure" id={this.id}>
      {this.props.children}
    </figure>
  }
}

Fig.defaultProps = {
  format: "Figure %i."
}

Fig.childContextTypes = {
  number: React.PropTypes.number,
  format: React.PropTypes.string
}

module.exports = Fig;
