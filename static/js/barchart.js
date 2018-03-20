const dataset = [50, 29, 23, 180, 123];
const width = 400;
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
const genRect = obj => {
    obj.attr("fill", "red")
        .attr("x", (d, i) => padding.left + i * rectStep)
        .attr("y", (d, i) => height - padding.bottom - d)
        .attr("width", rectWidth)
        .attr("height", d => d)
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

init([50, 29, 23, 180, 200])
update([50, 29, 23, 180, 100])