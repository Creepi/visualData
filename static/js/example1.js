const width = 200
const height = 200
const dataset = ["I like dog","I like cat","I like snake"];
for(let i =0;i<3;i++){
    let ps = document.createElement("p");
    document.body.appendChild(ps);
}

let p = d3.select("body").selectAll('p').text('helloword')
p.data(dataset);
p.text(function(d, i){
    return "第 "+ i + " 个元素绑定的数据是 " + d;
});
