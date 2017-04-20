const React = require('react');
const ReactDOM = require('react-dom');

class Quote extends React.Component {
  render () {
    return <blockquote className="idyll-blockquote">
      {this.props.children}
    </blockquote>
  }
}

module.exports = Quote;
