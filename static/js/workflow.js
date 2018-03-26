var data = {
    nodes: [{
            'name': 'data',
            'pos_x': 150,
            'pos_y': 200,
            'type': 'dataSource',
            'input': 2,
            'output': 3,
            'dataId': 'node-1'
        },
        {
            'name': 'cal',
            'pos_x': 250,
            'pos_y': 300,
            'type': 'caculate',
            'input': 3,
            'output': 2,
            'dataId': 'node-2'
        }
    ],
    links: [{
        "source": "0",
        "target": "1",
        "data": {}
    }, ]
}
const Crp = function (wrap, data) {
    this.wrap = d3.select('.crp-container')
    this.nodes = data.nodes
    this.links = data.links

}
Crp.prototype = {
    init: function () {
        //初始化nodes
        this.drawConnector()
        this.dragAdd()
    },
    dragAdd: function () {

    },
    drawConnector: function () {
        let g = this.wrap.selectAll('.crp-node').data(this.nodes).enter().append("g")
            .attr("class", "crp-node")
            .attr("id", d => '#' + d.dataId)
            .attr("input", d => d.input)
            .attr("output", d => d.output)
            .attr("transform", d => `translate(${d.pos_x},${d.pos_y})`)
        let rect = g.append('rect').attr("rx", 5)
            .attr("class", "crp-node-wrap")
            .attr("ry", 5)
            .attr("stroke-width", 2)
            .attr("stroke", "#333")
            .attr("fill", "#fff");
        var bound = rect.node().getBoundingClientRect();
        var width = bound.width;
        var height = bound.height;
        // text
        g.append("text")
            .text(d => d.name)
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

        // left icon
        g.append('text')
            .attr("x", 18)
            .attr("y", height / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr('font-family', 'FontAwesome')
            .text('\uf1c0');

        // right icon
        g.append('text')
            .attr("x", width - 18)
            .attr("y", height / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr("font-family", 'FontAwesome')
            .text("\uf00c");

        //绘制端点
        console.log(document.getElementsByClassName('crp-node').length)
        let nodes = document.getElementsByClassName('crp-node')
        for (let j = 0; j < nodes.length; j++) {
            for (let i = 0; i < nodes[j].getAttribute('input'); i++) {
                var nodeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                nodeCircle.setAttribute('class', 'node-input')
                nodeCircle.setAttribute('input', (i + 1))
                nodeCircle.setAttribute('cx', 0)
                nodeCircle.setAttribute('cy', (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("input"))))
                nodeCircle.setAttribute('r', '6')
                nodes[j].appendChild(nodeCircle)
            }
            for (let i = 0; i < nodes[j].getAttribute('output'); i++) {
                var nodeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                nodeRect.setAttribute('class', 'node-output')
                nodeRect.setAttribute('output', (i + 1))
                nodeRect.setAttribute('width', 12)
                nodeRect.setAttribute('height', 12)
                nodeRect.setAttribute("y", (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("output"))) - 6)
                nodeRect.setAttribute('x', width-6)
                nodes[j].appendChild(nodeRect)
            }

        }
        // //draw input
        // for (var i = 0; i < g.attr('input'); i++) {

        //     g.append("circle")
        //         .attr("class", "node-input")
        //         .attr("input", (i + 1))
        //         .attr("cx",0)
        //         .attr("cy", (i + 1) * height / (1 + parseInt(g.attr("input"))))
        //         .attr("r",6)
        // }    
        // draw output 
        // for (var i = 0; i < g.attr('output'); i++) {
        //     console.log(g.attr("output"))
        //     g.append("rect")
        //         .attr("class", "node-output")
        //         .attr("output", (i + 1))
        //         .attr("width", 12)
        //         .attr("height", 12)
        //         .attr("x", width - 6)
        //         .attr("y", (i + 1) * height / (1 + parseInt(g.attr("output"))) - 6)
        // }
    },

}


var bew = new Crp('crp-container', data)
bew.init()