const dataset = [50,29,23,180,123];
const width = 200;
const height = 200;
const svg = d3.select("#svg").append("svg").attr("width",width).attr("height",height)
const padding = {top:20,right:20,bottom:20,left:20}
const rectStep = 35;
const rectWidth= 30;

svg.selectAll("rect").data(dataset).enter().append("rect").attr("fill","red")
    .attr("x",(d,i) => padding.left+i*rectStep)
    .attr("y",(d,i) =>height-padding.bottom-d)
    .attr("width",rectWidth)
    .attr("height",d => d)

const text = svg.selectAll("text").data(dataset).enter().append("text").attr("fill","#fff")
    .attr("font-size","14px").attr("text-anchor","middle")
    .attr("x",(d,i) => padding.left + i*rectStep)
    .attr("y",(d,i) => height -padding.bottom -d)
    .text(d => d)
    .attr("dx",(d,i)=> rectWidth/2)
    .attr("dy","1em")