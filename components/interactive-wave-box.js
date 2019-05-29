const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class InteractiveWaveBox extends D3Component {
  constructor(props) {
    super(props)
    this.state = {
      vx: 0.1,
      vy: 0
    }
  }

  initialize(node, props) {
    let component = this
    const svg = this.svg = d3.select(node).append('svg');
    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('background-color', '#333333')

    let waves = svg.append('g').attr('id', 'waves')
    let particles = svg.append('g').attr('id', 'waves')

    svg.append('circle')
      .attr('r', 20)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .style('fill', '#5577ff')

    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("refX", 5)
      .attr("refY", 2)
      .attr("markerWidth", 6)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z")
      .style("fill", "white")


    let line = svg.append('line')
      .attr('x1', size * 0.5)
      .attr('y1', size * 0.5)
      .attr('x2', size * (0.5 + this.state.vx))
      .attr('y2', size * (0.5 + this.state.vy))
      .attr('stroke-width', 2)
      .attr('stroke', 'white')
      .attr("marker-end", "url(#arrowhead)")

    svg.on('click', function () {
      let coords = d3.mouse(this)
      let vx = coords[0] / size - 0.5
      let vy = coords[1] / size - 0.5
      component.setState({ vx: vx, vy: vy })

      line.attr('x2', coords[0])
        .attr('y2', coords[1])

      waves.selectAll('circle').transition()
        .style('stroke-opacity', 0)
        .remove()

      particles.selectAll('circle').transition()
        .style('opacity', 0)
        .remove()
    })

    setTimeout(() => this.spawnWave(waves), 400)
    setTimeout(() => this.particleTrail(particles), 100)
  }

  spawnWave(svg) {
    let circle = svg.append('circle')
      .attr('r', 20)
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .style('stroke', 'gray')
      .style('fill', 'transparent')

    circle.transition('circle')
      .duration(10000)
      .attr('r', size * 2)
      .attr('cx', size * (0.5 - this.state.vx * 2))
      .attr('cy', size * (0.5 - this.state.vy * 2))
      .ease(d3.easeLinear)
      .remove()

    setTimeout(() => this.spawnWave(svg), 400)
  }

  particleTrail(svg) {
    let circle = svg.append('circle')
      .attr('r', 5)
      .style('fill', '#5577ff')
      .attr('cx', size * 0.5)
      .attr('cy', size * 0.5)
      .attr('opacity', 1)

    circle.transition('circle')
      .duration(2000)
      .attr('cx', size * (0.5 - this.state.vx * 0.5 + (Math.random() - 0.5) * 0.1))
      .attr('cy', size * (0.5 - this.state.vy * 0.5 + (Math.random() - 0.5) * 0.1))
      .attr('opacity', 0)
      .ease(d3.easeLinear)
      .remove()

    setTimeout(() => this.particleTrail(svg), 100)
  }
}

module.exports = InteractiveWaveBox;
