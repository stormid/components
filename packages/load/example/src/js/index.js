import Load from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {    
    Load('//d3js.org/d3.v3.min.js')
        .then(() => {
            let data = [4, 8, 15, 16, 23, 42];

            let x = d3.scale.linear()
                .domain([0, d3.max(data)])
                .range([0, 420]);

            d3.select(".chart")
            .selectAll("div")
                .data(data)
            .enter().append("div")
                .style("width", function(d) { return x(d) + "px"; })
                .text(function(d) { return d; });
        })
        .catch(e => {
            console.log(e);
        });

        Load(['//d3js.org/d3.v3.min.js', '//cdnjs.cloudflare.com/ajax/libs/d3.chart/0.2.0/d3.chart.js'], false)
            .then(() =>{
                // define a new chart type: a circle chart
                d3.chart("CircleChart", {

                initialize: function() {
                    // create a layer of circles that will go into
                    // a new group element on the base of the chart
                    this.layer("circles", this.base.append("g"), {

                    // select the elements we wish to bind to and
                    // bind the data to them.
                    dataBind: function(data) {
                        return this.selectAll("circle")
                        .data(data);
                    },

                    // insert actual circles
                    insert: function() {
                        return this.append("circle");
                    },

                    // define lifecycle events
                    events: {

                        // paint new elements, but set their radius to 0
                        // and make them red
                        "enter": function() {
                        this.attr("cx", function(d) {
                            return d * 10;
                        })
                        .attr("cy", 10)
                        .attr("r", 0)
                        .style("fill", "red");
                        },
                        // then transition them to a radius of 5 and change
                        // their fill to blue
                        "enter:transition": function() {
                        var chart = this.chart();
                        this.delay(500)
                            .attr("r", 5)
                            .style("fill", chart.color());
                        }
                    }
                    });
                },

                // set/get the color to use for the circles as they are
                // rendered.
                color: function(newColor) {
                    if (arguments.length === 0) {
                    return this._color;
                    }
                    this._color = newColor;
                    return this;
                }
                });

                // create an instance of the chart on a d3 selection
                var chart = d3.select('.chart-2')
                .append("svg")
                .attr("height", 30)
                .attr("width", 400)
                .chart("CircleChart")
                .color("orange");

                // render it with some data
                chart.draw([1,4,6,9,12,13,30]);
            })
            .catch(e => {
                console.log(e);
            });
});