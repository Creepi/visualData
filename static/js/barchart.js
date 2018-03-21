const dataset = [50, 29, 23, 180, 123];
const width = 500;
const height = 400;
const svg = d3.select("#svg").append("svg").attr("width", width).attr("height", height)
const padding = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
}
const rectStep = 35;
const rectWidth = 30;

//定义坐标轴
const xAxisWidth = width - padding.left - padding.right
const yAxisWidth = height - padding.top - padding.bottom
const xScale = d3.scaleBand().domain(dataset.map((o, i) => i)).rangeRound([0,xAxisWidth]).padding(0.1)
const yScale = d3.scaleLinear().domain([0,d3.max(dataset)]).rangeRound([yAxisWidth,0])
const xAxis = d3.axisBottom(xScale)
const gX = svg.append("g").attr("transform",`translate(${padding.left},${height - padding.bottom})`)
gX.call(xAxis)
const yAxis = d3.axisLeft(yScale)
const gY = svg.append("g").attr("transform",`translate(${padding.left},${height - yAxisWidth - padding.bottom})`)
gY.call(yAxis)

const color = d3.scaleOrdinal(d3.schemeCategory10)
const genRect = obj => {
    obj.attr("fill", (d,i) => color(i))
        .attr("x", (d, i) => padding.left + xScale(i))
        .attr("y", (d, i) => height - padding.bottom - d)
        .attr("width", xScale.bandwidth)
        .attr("height", 0)
     obj.transition().duration(1000).attr("height", d => d) 
}
const genText = obj => {
    obj.attr("fill", "#fff")
        .attr("font-size", "14px").attr("text-anchor", "middle")
        .attr("x", (d, i) => padding.left + i * rectStep)
        .attr("y", (d, i) => height - padding.bottom - d)
        .text(d => d)
        .attr("dx", (d, i) => rectWidth / 2)
        .attr("dy", "1em")
}
const init = dataset => {
    genRect(svg.selectAll("rect").data(dataset).enter().append("rect"))
    genText(svg.selectAll("text").data(dataset).enter().append("text"))
}
const update = dataset => {
    genRect(svg.selectAll("rect").data(dataset))
    genText(svg.selectAll("text").data(dataset))
}

init(dataset)