
let self = ""
const Crp = function (wrap, data) {
    self = this
    this.wrap = d3.select(`.${wrap}`) //容器名称
    this.nodeW = 180 //node宽度
    this.nodeH = 90 //node高度
    this.linkSize = 15 //连接口size
    this.lineColor = '#e5e3e6' //连线颜色

    this.drawing = false
    this.nodes = data.nodes
    this.links = data.links

    this.headerHeight = 30
    this.pointDistanceX = 0 //点击间距
    this.pointDistanceY = 0
    this.points = []
    this.activeLine = ''
    this.activeLink = ''
    this.nodeLineBegin = ''
    this.anchorCurrent = ''
    this.nodeCurrent - ''
    this.anchorBegin = '' //起始联结口
    this.currentNodeName = ''
}
Crp.prototype = {
    init: function (event) {
        //取消浏览器右键
        document.oncontextmenu = function () {　　
            return false;
        }
        //取消文本选中
        document.onselectstart = function () {
            return false;
        };

        document.onclick = function (params) {
            d3.selectAll(".node-menu").remove()
        }

        //取消文本选中
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        //设置宽高
        let parentNode = this.wrap.node().parentNode
        this.wrap.attr("width",parentNode.offsetWidth).attr("height",parentNode.offsetHeight)
        //初始化nodes
        this.drawConnector()
        this.dragAdd()
    },
    drawConnector: function () {
        console.log(this.nodes)
        //渲染主题色
        for(let i =0;i<this.nodes.length;i++){
            switch (this.nodes[i].type){
                case "calc":
                    this.nodes[i].theme = "#977e74";
                    break;
                case "handle":
                    this.nodes[i].theme = "#ea7327";
                    break;
                case "data":
                    this.nodes[i].theme = "#4BB3D3";
                    break;
                case "output":
                    this.nodes[i].theme = "#2566af";

            }
        }
        
        let g = this.wrap.selectAll('.crp-node').data(this.nodes).enter().append("g")
            .attr("class", "crp-node")
            .attr("id", d => d.nodeId)
            .attr("input", d => d.input)
            .attr("output", d => d.output)
            .attr("theme", d => d.theme)
            .attr("name",d => d.name)
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

        d3.selectAll(".node-link").on("mouseover",this.linkover, true).on("mouseleave", this.linkleave, true)
        d3.selectAll(".crp-node").on("mousedown", this.nodeDown, true)
        //node点击
        d3.selectAll(".crp-node").call(
            d3.drag().subject(this.subject)
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
     subject:function(d) {
        return d == null ? {x: event.x, y: event.y} : d;
      },
    started: function () {
        let that = self
        let d = d3.event.subject 
        //计算点击位置间距
        that.pointDistanceX = d3.event.x - d.pos_x
        that.pointDistanceY = d3.event.y - d.pos_y
    },
    dragged: function (d) {
        let that = self
        let transform = d3.select(this).attr('transform')
        d3.select(this).attr('transform', `translate(${d3.event.x - that.pointDistanceX},${d3.event.y - that.pointDistanceY})`)
        that.updateLine(d3.select(this)) //更新线
    },
    ended: function (d) {
        let that = self
        d.pos_x = d3.event.x - that.pointDistanceX
        d.pos_y = d3.event.y - that.pointDistanceY
    },
    linestarted: function (d) {
        let that = d3.event.subject
        let linkType = d3.select(this).attr('linkType')
        let linePoint = []
        let activeLink = d3.select(this)
        //计算node内连接线起始点
        switch (linkType) {
            case "input":
                // linePoint = [parseInt(that.anchorBegin.attr('cx')), parseInt(that.anchorBegin.attr('cy'))]
                alert('不是输出端点')
                break;
            case "output":
                that.anchorBegin = d3.select(this)
                that.nodeLineBegin = d3.select(this.parentNode)
                linePoint = [parseInt(that.anchorBegin.attr('x')) + that.linkSize + 2, parseInt(that.anchorBegin.attr('y')) + that.linkSize / 2]
                that.activeLine = that.wrap
                    .append("path")
                    .attr("class", "cable")
                    .attr("from", that.nodeLineBegin.attr("id"))
                    .attr("start", linePoint[0] + ", " + linePoint[1])
                    .attr("output", d3.select(this).attr("output"))
                    .attr("marker-end", "url(#arrow)");
                that.points.push([that.getTranslate(that.nodeLineBegin.attr('transform'))[0] + linePoint[0], that.getTranslate(that.nodeLineBegin.attr('transform'))[1] + linePoint[1]])
                break;
        }


    },
    linedragged: function () {
        //获取底层this
        let that = d3.event.subject
        that.drawing = true
        let nodeActive = d3.select(this.parentNode)
        let lineData = ''
        if (that.points.length != 0) {
            that.points[1] = [d3.event.x + that.getTranslate(nodeActive.attr('transform'))[0], d3.event.y + that.getTranslate(nodeActive.attr('transform'))[1]];
            that.activeLine.style('pointer-events', 'none');
            //连线基本数据
            lineData = "M" + that.points[0][0] + "," + that.points[0][1] +
                "L" + that.points[1][0] + "," + that.points[1][1];
            //画线
            that.drawLine(lineData)
        }

    },
    lineended: function () {
        let that = d3.event.subject
        let nodeLineEnd = d3.select(this.parentNode)
        let anchorEnd = d3.select(this)
        //判断 终点是否为节点、输入对接输出、是否为同一个node元素
        if (that.activeLine && that.drawing == true) {
            if (that.anchorCurrent != '' && that.anchorBegin.attr('linkType') != that.anchorCurrent.attr('linkType') && that.nodeLineBegin.attr('id') != that.nodeCurrent.attr('id')) {
                // that.activeLine.attr('to', that.nodeCurrent.attr('id'))
                // that.activeLine.attr('end', that.linkCurrent.attr('cx')+','+that.linkCurrent.attr('cy'))
                // let lineData = "M" +that.points[0][0]+ "," + that.points[0][1] +
                // "L" + (that.getTranslate(that.nodeCurrent.attr('transform'))[0] - that.linkSize) + "," + that.points[1][1];
                let beginPos = [that.points[0][0], that.points[0][1]] //折线起始点
                let endPos = [that.getTranslate(that.nodeCurrent.attr('transform'))[0] - that.linkSize, that.points[1][1]] //折线终止点
                // let middlePosW = (endPos[0] + that.points[0][0])/2
                // let polyLine = `${that.points[0][0]},${that.points[0][1]} ${middlePosW},${that.points[0][1]} ${middlePosW},${that.points[1][1]} ${endPos[0]},${that.points[1][1]}`


                that.drawPoly(beginPos, endPos) //绘制折线
            } else {

            }
            that.drawing = false
            that.activeLine.remove()
            that.activeLine = ""
            // that.nodeCurrent = ""
            // that.anchorCurrent = ""
            // that.anchorBegin = ""
            that.points = []
        }

    },
    linkover: function () {
        //判断连接点

        const that = self
        if (that.drawing == true) {

            that.anchorCurrent = d3.select(this)
            that.nodeCurrent = d3.select(this.parentNode)
        }

    },
    linkleave: function () {
        const that = self
        that.anchorCurrent = ''
    },
    drawLine: function (lineData) {
        const that = self
        that.activeLine.attr("d", lineData).attr("stroke-width", 2).attr("stroke", that.lineColor).attr("fill", that.lineColor);
    },
    drawPoly: function (beginPos, endPos, currentPoly) {
        const that = self
        let middlePosX = (parseInt(endPos[0]) + parseInt(beginPos[0])) / 2 //计算中间点X
        let middleposY = (parseInt(endPos[1]) + parseInt(beginPos[1])) / 2 -that.headerHeight/2//计算中间点Y
        let polyLine = `${beginPos[0]},${beginPos[1]} ${middlePosX},${beginPos[1]} ${middlePosX},${endPos[1]} ${endPos[0]},${endPos[1]}`
        let nodeDistance = [Math.abs(beginPos[0] - endPos[0]), Math.abs(beginPos[1] - endPos[1])] //两个节点间的距离

        if (beginPos[0] - endPos[0] >= -that.nodeH / 2) {
            console.log("right")
            //起始点在结束点右侧
            polyLine = `${beginPos[0]},${beginPos[1]} ${+beginPos[0]+parseInt(that.nodeH/2)},${beginPos[1]} ${+beginPos[0]+parseInt(that.nodeH/2)},${middleposY} ${endPos[0]-that.nodeH/2},${middleposY} ${endPos[0]-that.nodeH/2},${endPos[1]} ${endPos[0]},${endPos[1]}`

            if(endPos[1]-beginPos[1] <= 100){
                //右上间距过小
                console.log("right-bottom")
                // polyLine = `${beginPos[0]},${beginPos[1]} ${endPos[0]},${endPos[1]}`
            }
        }

        if (!currentPoly) {
            //create polyline
            that.wrap.append("polyline").attr("points", polyLine)
                .attr("fill", "none")
                .attr("stroke-width", "2")
                .attr("stroke", that.lineColor)
                .attr("marker-end", "url(#arrow)")
                .attr("from", that.nodeLineBegin.attr("id"))
                .attr('to', that.nodeCurrent.attr('id'))
                .attr("start", `${that.anchorBegin.attr('x')},${that.anchorBegin.attr('y')}`)
                .attr('end', `${that.anchorCurrent.attr('cx')},${that.anchorCurrent.attr('cy')}`);
        } else {
            d3.select(currentPoly).attr("points", polyLine)
        }

    },
    getTranslate: function (transform) {
        //解析translate坐标
        let arr = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",");
        return [+arr[0], +arr[1]];
    },
    //更新连线
    updateLine: function (elem) {

        const that = self
        let id = elem.attr('id')
        let tran_pos = that.getTranslate(elem.attr("transform")); //获取对于总容器坐标

        d3.selectAll('polyline[from="' + id + '"]').each(function () { //start link
            let start_pos = d3.select(this).attr("start").split(",") ////获取相对容器坐标
            let pointsArr = d3.select(this).attr("points").split(" ")
            let end_pos = pointsArr[pointsArr.length - 1].split(",")
            start_pos[0] = +start_pos[0] + tran_pos[0] + that.linkSize
            start_pos[1] = +start_pos[1] + tran_pos[1] + that.linkSize / 2
            that.drawPoly(start_pos, end_pos, this)
            // d3.select(this).attr("d", function () {
            //     return "M" + start_pos[0] + "," + start_pos[1] +
            //         "L" + end_pos[0] + "," + end_pos[1];
            // })
        })

        d3.selectAll('polyline[to="' + id + '"]').each(function () { //start link
            let pointsArr = d3.select(this).attr("points").split(" ") //折线坐标点数组
            let start_pos = pointsArr[0].split(","); //获取相对容器坐标
            let end_pos = d3.select(this).attr("end").split(",");
            end_pos[0] = +end_pos[0] + tran_pos[0] - that.linkSize
            end_pos[1] = +end_pos[1] + tran_pos[1]
            that.drawPoly(start_pos, end_pos, this)
            // d3.select(this).attr("d", function () {
            //     return "M" + start_pos[0] + "," + start_pos[1] +
            //         "L" + end_pos[0] + "," + end_pos[1];
            // })
        })
        //清空临时数据

    },
    nodeDown: function (e) {
        const that = self
        console.log(d3.event.target.parentNode)
        d3.select(this).raise()
        that.currentNodeName = d3.select(d3.event.target.parentNode).attr("name")
        that.nodeDownExtra()

    },
    addNode:function(nodeObj){
        const that = self
        let nodeNew = JSON.parse(JSON.stringify(nodeObj))
        that.nodes.push(nodeNew)
        that.drawConnector()
        that.dragAdd()
    },
    nodeDel:function(nodeId){
        const that = self
        d3.select(`#${nodeId}`).remove()
        for(let i=0;i<that.nodes.length;i++){
            if(that.nodes[i]['nodeId'] == nodeId){
                that.nodes.splice(i,1)
            }
        }
        //删除关联连线
        d3.selectAll('polyline[from="' + nodeId + '"]').each(function () {
            d3.select(this).remove()
        })

        d3.selectAll('polyline[to="' + nodeId + '"]').each(function () {
            d3.select(this).remove()
        })
        return that.nodes
    },
    getData: function () {
        //获取节点信息
        const that = self

        return {
            "nodes": that.nodes,
            "links": that.links,
            "currentNodeName":that.currentNodeName
        }
    },
    nodeDownExtra: function () {
        //外部调用函数
    }
}
