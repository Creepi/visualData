var data = {
    nodes: [{
            'name': 'data',
            'pos_x': 150,
            'pos_y': 200,
            'type': 'dataSource',
            'input': 2,
            'output': 1,
            'dataId': 'node-1',
            'theme':'#415e93'
        },
        {
            'name': 'cal',
            'pos_x': 250,
            'pos_y': 300,
            'type': 'caculate',
            'input': 3,
            'output': 1,
            'dataId': 'node-2',
            'theme':'#6a926d'
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
    this.headerHeight = 30
    this.pointDistanceX = 0,
        this.pointDistanceY = 0

}
Crp.prototype = {
    init: function () {
        //初始化nodes
        this.drawConnector()
        this.dragAdd()
    },
    drawConnector: function () {
        let g = this.wrap.selectAll('.crp-node').data(this.nodes).enter().append("g")
            .attr("class", "crp-node")
            .attr("id", d => '#' + d.dataId)
            .attr("input", d => d.input)
            .attr("output", d => d.output)
            .attr("theme",d => d.theme)
            .attr("transform", d => `translate(${d.pos_x},${d.pos_y})`)
        let rectH = g.append('rect')
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("class", "crp-node-header")
            .attr("stroke-width", 2)
            .attr("stroke", "#e5e3e6")
            .attr("fill", d => d.theme)
        let rect = g.append('rect')
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("class", "crp-node-wrap")
            .attr("stroke-width", 2)
            .attr("stroke", "#e5e3e6")
            .attr("fill", "#fff")
            .attr("x", 0)
            .attr('y', this.headerHeight)

        var bound = rect.node().getBoundingClientRect();
        var width = bound.width;
        var height = bound.height;
        g.append("text")
            .text(d => d.name)
            .attr("x", width / 2)
            .attr("y", this.headerHeight / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr("fill", "#fff");

        // text
        g.append("text")
            .text(d => d.name)
            .attr("x", width / 2)
            .attr("y", this.headerHeight + height / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle");

        // left icon
        g.append('text')
            .attr("x", 18)
            .attr("y", this.headerHeight + height / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr('font-family', 'FontAwesome')
            .text('\uf1c0');

        // right icon
        g.append('text')
            .attr("x", width - 18)
            .attr("y", this.headerHeight + height / 2)
            .attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .attr("font-family", 'FontAwesome')
            .text("\uf00c");

        //绘制端点
        console.log(document.getElementsByClassName('crp-node').length)
        let nodes = document.getElementsByClassName('crp-node')
        for (let j = 0; j < nodes.length; j++) {
            //draw inputs
            for (let i = 0; i < nodes[j].getAttribute('input'); i++) {
                var nodeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                nodeCircle.setAttribute('class', 'node-input')
                nodeCircle.setAttribute('input', (i + 1))
                nodeCircle.setAttribute('cx', 0)
                nodeCircle.setAttribute('cy', (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("input"))) + this.headerHeight)
                nodeCircle.setAttribute('r', '6')
                nodeCircle.setAttribute('stroke', nodes[j].getAttribute("theme"));
                nodes[j].appendChild(nodeCircle)
            }
            //draw outputs
            for (let i = 0; i < nodes[j].getAttribute('output'); i++) {
                var nodeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                nodeRect.setAttribute('class', 'node-output')
                nodeRect.setAttribute('output', (i + 1))
                nodeRect.setAttribute('width', 12)
                nodeRect.setAttribute('height', 12)
                nodeRect.setAttribute("y", (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("output"))) + this.headerHeight - 6)
                nodeRect.setAttribute('x', width - 6)
                nodeRect.setAttribute('stroke', nodes[j].getAttribute("theme"));
                nodes[j].appendChild(nodeRect)
            }

        }
    },
    dragAdd: function () {
        const that = this
        d3.selectAll('.crp-node').call(d3.drag()
            .on("start", this.started)
            .on("drag", this.dragged)
            .on("end", this.ended))
    },
    started: function (d) {
        this.pointDistanceX = d3.event.x - d.pos_x
        this.pointDistanceY = d3.event.y - d.pos_y
    },
    dragged: function (d) {
        let transform = d3.select(this).attr('transform')
        getTranslate = function (transform) {
            var arr = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",");
            return [+arr[0], +arr[1]];
        }
        console.log(this.pointDistance)
        d3.select(this).attr('transform', `translate(${d3.event.x - this.pointDistanceX},${d3.event.y - this.pointDistanceY})`)
    },
    ended: function (d) {
        d.pos_x = d3.event.x - this.pointDistanceX
        d.pos_y = d3.event.y - this.pointDistanceY
    },

}


var bew = new Crp('crp-container', data)
bew.init()