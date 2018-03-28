const data = {
    nodes: [{
            'name': 'data',
            'pos_x': 150,
            'pos_y': 200,
            'type': 'dataSource',
            'input': 2,
            'output': 1,
            'dataId': 'node-1',
            'theme': '#3e72b3'
        },
        {
            'name': 'cal',
            'pos_x': 250,
            'pos_y': 300,
            'type': 'caculate',
            'input': 1,
            'output': 1,
            'dataId': 'node-2',
            'theme': '#67b17a'
        }
    ],
    links: [{
        "source": "0",
        "target": "1",
        "data": {}
    }, ]
}
const Crp = function (wrap, data) {

    this.nodeW = 180 //node宽度
    this.nodeH = 90 //node高度
    this.linkSize = 15 //连接口size
    this.wrap = d3.select('.crp-container') //容器名称
    this.nodes = data.nodes
    this.links = data.links
    this.headerHeight = 30
    this.pointDistanceX = 0 //点击间距
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
            .attr("theme", d => d.theme)
            .attr("transform", d => `translate(${d.pos_x},${d.pos_y})`)
        let rect = g.append('rect')
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", "crp-node-wrap")
            .attr("stroke-width", 2)
            .attr("stroke", "#e5e3e6")
            .attr("fill", "#fff")
            .attr("x", 0)
            .attr('y', 0)
            .style("width", this.nodeW)
            .style("height", this.nodeH)
        var bound = rect.node().getBoundingClientRect();
        var width = bound.width;
        var height = bound.height - this.headerHeight;
        let rectH = g.append('rect')
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", "crp-node-header")
            .attr("y", "0")
            .attr("stroke-width", 2)
            .attr("stroke", d => d.theme)
            .attr("fill", d => d.theme)
            .style("width", this.nodeW)
        //横条 取消rect下圆角
        g.append('rect')
            .attr("class", "crp-node-middle")
            .attr("fill", d => d.theme)
            .attr("y", this.headerHeight - 5)
            .attr("stroke-width", 2)
            .attr("stroke", d => d.theme)
            .attr("fill", d => d.theme)
            .style("width", this.nodeW)

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
                nodeCircle.setAttribute('class', 'node-link node-input')
                nodeCircle.setAttribute("linkType", "input")
                nodeCircle.setAttribute('input', (i + 1))
                nodeCircle.setAttribute('cx', 0)
                nodeCircle.setAttribute('cy', (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("input"))) + this.headerHeight)
                nodeCircle.setAttribute('r', this.linkSize/2)
                nodeCircle.setAttribute('stroke', nodes[j].getAttribute("theme"));
                nodes[j].appendChild(nodeCircle)
            }
            //draw outputs
            for (let i = 0; i < nodes[j].getAttribute('output'); i++) {
                var nodeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                nodeRect.setAttribute('class', 'node-link node-output')
                nodeRect.setAttribute("linkType", "output")
                nodeRect.setAttribute('output', (i + 1))
                nodeRect.setAttribute('width', this.linkSize)
                nodeRect.setAttribute('height', this.linkSize)
                nodeRect.setAttribute("y", (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("output"))) + this.headerHeight - this.linkSize/2)
                nodeRect.setAttribute('x', width - this.linkSize/2)
                nodeRect.setAttribute('stroke', nodes[j].getAttribute("theme"));
                nodes[j].appendChild(nodeRect)
            }

        }
    },
    dragAdd: function () {
        const that = this
        //node点击
        d3.selectAll('.crp-node').call(d3.drag()
            .on("start", this.started)
            .on("drag", this.dragged)
            .on("end", this.ended))
        //连接点点击
        d3.selectAll(".node-link").call(
            d3.drag()
            .on("start", this.linestarted)
            .on("drag", this.linedragged)
            .on("end", this.lineended)
        );
    },
    started: function (d) {
        //计算点击位置间距
        this.pointDistanceX = d3.event.x - d.pos_x
        this.pointDistanceY = d3.event.y - d.pos_y
    },
    dragged: function (d) {
        let transform = d3.select(this).attr('transform')
        d3.select(this).attr('transform', `translate(${d3.event.x - this.pointDistanceX},${d3.event.y - this.pointDistanceY})`)
    },
    ended: function (d) {
        d.pos_x = d3.event.x - this.pointDistanceX
        d.pos_y = d3.event.y - this.pointDistanceY
    },
    linestarted: function (d) {
        let anchor = d3.select(this)
        let nodeActive = d3.select(this.parentNode)
        let linkType = d3.select(this).attr('linkType')
        let linePoint = [anchor.attr('x') + (+anchor.attr("output") + 1)]
        switch (linkType) {
            case "input":
                linePoint = [anchor.attr('x') - (+anchor.attr("output") + 1)]
        }
        console.log(d3.select(this))
        activeLine = d3.select(this.wrap)
            .append("path")
            .attr("class", "cable")
            .attr("from", nodeActive.attr("id"))
            .attr("start", dx + ", " + dy)
            .attr("output", d3.select(this).attr("output"))
            .attr("marker-end", "url(#arrowhead)");
    }

}


var bew = new Crp('crp-container', data)
bew.init()