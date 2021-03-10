const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const w = 920, h = 630, padding = 40;

document.addEventListener('DOMContentLoaded', () => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log('min: ' + d3.min(data, d => new Date(0, 0, 0, 0, d['Time'].match(/\d+/g)[0], d['Time'].match(/\d+/g)[1]))
            //     + 'max:' + d3.max(data, d => new Date(0, 0, 0, 0, d['Time'].match(/\d+/g)[0], d['Time'].match(/\d+/g)[1])));
            //Scales
            const xScale = d3.scaleTime()
                .domain([new Date(d3.min(data, d => new Date(d['Year'], 0))), new Date(d3.max(data, d => new Date(d['Year'], 0)))])
                .range([padding, w - padding]).nice();
            const yScale = d3.scaleTime()
                .domain([d3.min(data, d => new Date(0, 0, 0, 0, d['Time'].match(/\d+/g)[0], d['Time'].match(/\d+/g)[1], 0)), d3.max(data, d => new Date(0, 0, 0, 0, d['Time'].match(/\d+/g)[0], d['Time'].match(/\d+/g)[1], 0))])
                .range([padding, h - padding]).nice();

            // appending the svg
            const svg = d3.select("#container")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            // X and Y axis:
            const xAxis = d3.axisBottom(xScale);
            svg.append("g")
                .attr("id", 'x-axis')
                .attr("transform", "translate(0, " + (h - padding) + ")")
                .call(xAxis);

            const yAxis = d3.axisLeft(yScale);
            svg.append("g")
                .attr("id", 'y-axis')
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis.tickFormat(d3.timeFormat("%M:%S")));
            // console.log(data[0]['Year']);
            // console.log(data[0]['Time']);
            // tooltip
            const legend = svg.append("g").attr("id", 'legend');
            legend.append("circle").attr("cx", w - 30 - 100).attr("cy", h / 2).attr("fill", 'orange').attr("r", '5')
            legend.append("circle").attr("cx", w - 30 - 100).attr("cy", (h / 2 + 30)).attr("fill", 'blue').attr("r", '5');
            legend.append("text").attr("x", w - 30 - 100 + 10).attr("y", h / 2 + 3).text(': non doping');
            legend.append("text").attr("x", w - 30 - 100 + 10).attr("y", h / 2 + 30 + 3).text(': doping');
            // .append("text")
            // .attr("x", (d, i) => i * 30)
            // .attr("y", (d, i) => h - 3 * d - 3)
            // .text(d => d
            const tooltip = d3.select("#container")
                .append("div")
                .attr("id", "tooltip")
                .attr('class', "tooltip")
                .style("opacity", 100);

            //setting the data for the svg
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", 'bar')
                .attr("data-xvalue", (d) => new Date(d['Year'], 0))
                .attr("data-yvalue", d => new Date(0, 0, 0, 0, d['Time'].match(/\d+/g)[0], d['Time'].match(/\d+/g)[1], 0))
                .attr("cx", d => xScale(new Date(d['Year'], 0)))
                .attr("cy", d => yScale(new Date(0, 0, 0, 0, d['Time'].match(/\d+/g)[0], d['Time'].match(/\d+/g)[1], 0)))
                .attr("r", 5)
                // .attr("height", (d) => h - padding - yScale(d[1]))
                .attr("fill", (d) => d['Doping'].length === 0 ? 'orange' : 'blue') // orange not dopping : blue dopping
                .attr("class", 'dot')
                .on("mouseover", (e, d) => {
                    console.log(e.target.getAttribute("data-xvalue"));
                    tooltip.transition().duration(50).style("opacity", 0.9);
                    tooltip.html(d.Name + ': ' + d.Nationality + '<br>' + d.Year + ': ' + d.Time)
                        .style("left", (e.clientX) + "px")
                        .style("top", (e.clientY) + "px");
                    tooltip.attr("data-year", e.target.getAttribute("data-xvalue")).style("background", 'lightsteelblue');
                }).on("mouseout", (d) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                });
        });
});