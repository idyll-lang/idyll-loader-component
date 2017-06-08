const React = require('react');
const ReactDOM = require('react-dom');
const Link = require('idyll-default-components/link');

class Figref extends React.Component {
  render () {
    return <Link
      href={"#figure-" + this.props.number}
      text={this.props.format.replace('%i', this.props.number)}
    />
  }
}

Figref.defaultProps = {
  format: "Figure %i"
}

module.exports = Figref;
