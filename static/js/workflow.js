const data = {
    nodes: [{
            'name': 'data',
            'pos_x': 150,
            'pos_y': 200,
            'type': 'dataSource',
            'input': 2,
            'output': 1,
            'dataId': 'node-1',
            'theme': '#3e72b3',
            'nodeId': '2131241'
        },
        {
            'name': 'cal',
            'pos_x': 250,
            'pos_y': 300,
            'type': 'caculate',
            'input': 1,
            'output': 1,
            'dataId': 'node-2',
            'theme': '#67b17a',
            'nodeId': '324234'
        }
    ],
    links: [{
        "source": "0",
        "target": "1",
        "data": {}
    }, ]
}
const Crp = function (wrap, data) {
    this.wrap = d3.select('.crp-container') //容器名称
    this.nodeW = 180 //node宽度
    this.nodeH = 90 //node高度
    this.linkSize = 15 //连接口size
    this.lineColor = '#e5e3e6'//连线颜色

    this.nodes = data.nodes
    this.links = data.links

    this.headerHeight = 30
    this.pointDistanceX = 0 //点击间距
    this.pointDistanceY = 0
    this.points = []
    this.activeLine = ''
    this.activeLink = ''
    this.nodeLineBegin = ''
    this.linkCurrent = ''
    this.nodeCurrent - ''
    this.anchorBegin = '' //起始联结口
    d3.dataList = this
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
            .attr("id", d => '#' + d.nodeId)
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
        //定义箭头
        let defs = this.wrap.append("defs");

        let arrowMarker = defs.append("marker")
            .attr("id", "arrow")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "16")
            .attr("markerHeight", "16")
            .attr("viewBox", "0 0 12 12")
            .attr("refX", "8")
            .attr("refY", "6")
            .attr("orient", "auto");

        let arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

        arrowMarker.append("path")
            .attr("d", arrow_path)
            .attr("fill", this.lineColor);

        //绘制端点
        let nodes = document.getElementsByClassName('crp-node')
        for (let j = 0; j < nodes.length; j++) {
            //draw inputs
            for (let i = 0; i < nodes[j].getAttribute('input'); i++) {
                let nodeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                nodeCircle.setAttribute('class', 'node-link node-input')
                nodeCircle.setAttribute("linkType", "input")
                nodeCircle.setAttribute('input', (i + 1))
                nodeCircle.setAttribute('cx', 0)
                nodeCircle.setAttribute('cy', (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("input"))) + this.headerHeight)
                nodeCircle.setAttribute('r', this.linkSize / 2)
                nodeCircle.setAttribute('stroke', nodes[j].getAttribute("theme"));
                nodes[j].appendChild(nodeCircle)
            }
            //draw outputs
            for (let i = 0; i < nodes[j].getAttribute('output'); i++) {
                let nodeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                nodeRect.setAttribute('class', 'node-link node-output')
                nodeRect.setAttribute("linkType", "output")
                nodeRect.setAttribute('output', (i + 1))
                nodeRect.setAttribute('width', this.linkSize)
                nodeRect.setAttribute('height', this.linkSize)
                nodeRect.setAttribute("y", (i + 1) * height / (1 + parseInt(nodes[j].getAttribute("output"))) + this.headerHeight - this.linkSize / 2)
                nodeRect.setAttribute('x', width - this.linkSize / 2)
                nodeRect.setAttribute('stroke', nodes[j].getAttribute("theme"));
                nodes[j].appendChild(nodeRect)
            }

        }
    },
    dragAdd: function () {
        d3.selectAll(".node-link").on("mouseover", this.linkover, true).on("mouseleave", this.linkleave, true)
        //node点击
        d3.selectAll('.crp-node').call(d3.drag()
            .on("start", this.started)
            .on("drag", this.dragged)
            .on("end", this.ended))
        //连接点点击
        d3.selectAll(".node-link").call(
            d3.drag().subject(this)
            .on("start", this.linestarted)
            .on("drag", this.linedragged)
            .on("end", this.lineended)
        );
        //获取当前选中连接点


    },
    started: function (d) {
        let that = d3.dataList
        //计算点击位置间距
        that.pointDistanceX = d3.event.x - d.pos_x
        that.pointDistanceY = d3.event.y - d.pos_y
    },
    dragged: function (d) {
        let that = d3.dataList
        let transform = d3.select(this).attr('transform')
        d3.select(this).attr('transform', `translate(${d3.event.x - that.pointDistanceX},${d3.event.y - that.pointDistanceY})`)
        that.updateLine(d3.select(this)) //更新线
    },
    ended: function (d) {
        let that = d3.dataList
        d.pos_x = d3.event.x - that.pointDistanceX
        d.pos_y = d3.event.y - that.pointDistanceY
    },
    linestarted: function (d) {
        let that = d3.event.subject
        let linkType = d3.select(this).attr('linkType')
        let linePoint = []
        let activeLink = d3.select(this)
        that.anchorBegin = d3.select(this)
        that.nodeLineBegin = d3.select(this.parentNode)
        //计算node内连接线起始点
        switch (linkType) {
            case "input":
                linePoint = [parseInt(that.anchorBegin.attr('cx')), parseInt(that.anchorBegin.attr('cy'))]
                break;
            case "output":
                linePoint = [parseInt(that.anchorBegin.attr('x')) + that.linkSize / 2, parseInt(that.anchorBegin.attr('y')) + that.linkSize / 2]
                break;
        }

        that.activeLine = that.wrap
            .append("path")
            .attr("class", "cable")
            .attr("from", that.nodeLineBegin.attr("id"))
            .attr("start", linePoint[0] + ", " + linePoint[1])
            .attr("output", d3.select(this).attr("output"))
            .attr("marker-end", "url(#arrow)");
        that.points.push([that.getTranslate(that.nodeLineBegin.attr('transform'))[0] + linePoint[0], that.getTranslate(that.nodeLineBegin.attr('transform'))[1] + linePoint[1]])
    },
    linedragged: function () {
        //获取底层this
        let that = d3.event.subject
        let nodeActive = d3.select(this.parentNode)
        let lineData = ''
        that.points[1] = [d3.event.x + that.getTranslate(nodeActive.attr('transform'))[0], d3.event.y + that.getTranslate(nodeActive.attr('transform'))[1]];
        that.activeLine.style('pointer-events', 'none');
        //连线基本数据
        lineData = "M" + that.points[0][0] + "," + that.points[0][1] +
            "L" + that.points[1][0] + "," + that.points[1][1];
        //画线
        that.drawLine(lineData)
    },
    lineended: function () {
        let that = d3.event.subject
        console.log(that.anchorBegin.attr('linkType'))
        let nodeLineEnd = d3.select(this.parentNode)
        let anchorEnd = d3.select(this)
        console.log(anchorEnd.attr('linkType'))
        //判断 终点是否为节点、输入对接输出、是否为同一个node元素
        if (that.linkCurrent != '' && that.anchorBegin.attr('linkType') != that.linkCurrent.attr('linkType') && that.nodeLineBegin.attr('id') != that.nodeCurrent.attr('id')) {

        } else {
            that.activeLine.remove()
        }
        that.points = [] //连接线坐标清零
        that.activeLink = ''
    },
    linkover: function () {
        d3.dataList.linkCurrent = d3.select(this)
        d3.dataList.nodeCurrent = d3.select(this.parentNode)
    },
    linkleave: function () {
        console.log(d3.dataList.linkCurrent)
        d3.dataList.linkCurrent = ''
    },
    drawLine: function (lineData) {
        that = d3.dataList
        that.activeLine.attr("d", lineData).attr("stroke-width", 2).attr("stroke", that.lineColor).attr("fill", that.lineColor);

    },
    getTranslate: function (transform) {
        //解析translate坐标
        let arr = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",");
        return [+arr[0], +arr[1]];
    },
    //更新连线
    updateLine:function(elem) {
        elem.attr()
    }

}


var bew = new Crp('crp-container', data)
bew.init()