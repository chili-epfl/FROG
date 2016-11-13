import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import { Highcharts } from 'react-highcharts/Highcharts'

/*
export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
    }
  }

  graphHandler(event) {
    event.preventDefault();
    this.setState({
      isClicked: !this.state.isClicked,
    });
  }

  loadActivities(renderer, colors) {
    var x = 100;
    this.props.nodes.forEach((node) => {
      renderer.label(node, x, 82)
              .attr({
                  fill: colors[0],
                  stroke: 'white',
                  'stroke-width': 2,
                  padding: 5,
                  r: 5
              })
              .css({
                  color: 'white'
              })
              .add()
              .shadow(true);
      x += 200;
    });
    return renderer;

  }



  chartConfig() {
    var context = this;
    return {
      chart: {
        inverted: false,
        showAxes: true,
        events: {
          load: function () {

            // Draw the flow chart
            var ren = this.renderer,
                colors = ReactHighcharts.Highcharts.getOptions().colors,
                rightArrow = ['M', 0, 0, 'L', 100, 0, 'L', 95, 5, 'M', 100, 0, 'L', 95, -5],
                leftArrow = ['M', 100, 0, 'L', 0, 0, 'L', 5, 5, 'M', 0, 0, 'L', 5, -5];


            
            // Separator, client from service
            ren.path(['M', 120, 40, 'L', 120, 330])
                .attr({
                    'stroke-width': 2,
                    stroke: 'silver',
                    dashstyle: 'dash'
                })
                .add();


            {context.loadActivities(ren, colors)}
          },
        },


      },
      title: {
        text: this.props.name,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      yAxis: {
        categories: ['Plane 1', 'Plane 2', 'Plane 3'],
        min: 0,
        max: 2,
      },
      series: [{
        data: []
      }],
    }


      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
      }],



  }

  render() {
    return (
      <div className="graph-summary">
        <li onClick={this.graphHandler.bind(this)}>
        {this.props.name}
        </li>

      {
        //If the user has clicked on the graph, put prevous properties in addition
        //to hidden properties (returned by the renderObjectProperties)
        this.state.isClicked ? <ReactHighcharts config={this.chartConfig()} context={this} ref="chart" /> : ""
      }

      </div>
      );
  }
}
*/
