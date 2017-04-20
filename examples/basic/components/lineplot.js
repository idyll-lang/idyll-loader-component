const PlotlyComponent = require('./plotly');

module.exports = class Lineplot extends PlotlyComponent {
  plot (gd) {
    Plotly.plot(gd, {
      data: [{
        y: [1, 2, 3]
      }],
      layout: {
        margin: {t: 40, r: 10, b: 30, l: 20}
      }
    });
  }
}
