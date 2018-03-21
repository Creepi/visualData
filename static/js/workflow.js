var nodes = [{
        name: 'data',
        pos_x: 150,
        pos_y: 200,
        type: 'dataSource',
        input: 1,
        output: 2
    },
    {
        name: 'cal',
        pos_x: 250,
        pos_y: 300,
        type: 'caculate',
        input: 1,
        output: 2
    }
]
const Crp = function (wrap,nodes) {
    this.wrap ="."+ wrap
    this.nodes = nodes

}
Crp.prototype = {
    init: function () {
        //初始化nodes
        d3.select(`${this.wrap}`).selectAll('.crp-node').data(this.nodes).enter().append('div').classed(
            'crp-node', true
        ).style('left', d => d.pos_x + 'px').style('top', d => d.pos_y + 'px').text(d => d.name)
        this.dragAdd()

    },
    dragAdd: function () {
        //拖拽功能
        var drag = d3.drag().on("start", function (d) {
            console.log("start");
        }).on("end", function (d) {
            console.log("end");
        }).on("drag", function (d) {
            d3.select(this).style(
                'left', d3.event.x -this.offsetWidth/2 + 'px').style('top', d3.event.y- this.offsetHeight/2 + 'px')
        });
        //绑定拖拽
        d3.selectAll(".crp-node").data(nodes).call(drag);
    }

}


var bew = new Crp('crp-container',nodes)
bew.init()