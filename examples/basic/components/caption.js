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
    var containerStyles = {
      textAlign: {left: 'left', right: 'right', center: 'center'}[this.props.align] || 'center'
    }
    return <div className="idyll-caption-container" style={containerStyles}>
      <figcaption className="idyll-caption">
        <div className="idyll-caption-content">
          {[num].concat(this.props.children)}
        </div>
      </figcaption>
    </div>
  }
}

Caption.defaultProps = {
  format: "Figure %i.",
  align: 'center'
}

Caption.contextTypes = {
  number: React.PropTypes.number,
  format: React.PropTypes.string,
}

module.exports = Caption;
