const React = require('react');
const ReactDOM = require('react-dom');

class Caption extends React.Component {
  render () {
    var num;
    if (this.context.number !== undefined) {
      num = <em
        key="idyll-caption-prefix"
        className="idyll-caption-prefix"
      >
        {(this.context.format || '').replace(/%i/, this.context.number)}
      </em>
    }
    return <figcaption className="idyll-caption">
      {[num].concat(this.props.children)}
    </figcaption>
  }
}

Caption.defaultProps = {
  format: "Figure %i."
}

Caption.contextTypes = {
  number: React.PropTypes.number,
  format: React.PropTypes.string
}

module.exports = Caption;
