### D3学习笔记

- 元素操作

  ```javascript
  let p = d3.select("body").selectAll('p').text('helloword')
  ```

  - *selection*.**filter**(*filter*)

    过滤选择集并返回一个新的过滤后的选择集。*filter* 可以是一个选择字符串也可以是一个函数。如果 *filter* 为函数则会为被过滤的选择集中的每个元素进行调用，并传递当前的数据 (*d*), 当前的索引 (*i*) 以及当前的分组 (*nodes*), 函数中 *this* 指向当前 DOM 元素 (*nodes*[*i*]).

    ```javascript
    var even = d3.selectAll("tr").filter(":nth-child(even)"); //过滤出表格行中的偶数行
    var even = d3.selectAll("tr:nth-child(even)");
    var even = d3.selectAll("tr").filter(function(d, i) { return i & 1; });
    var even = d3.selectAll("tr").select(function(d, i) { return i & 1 ? this : null; });
    ```

    ​

- 绑定数据

  - 绑定一个数据

    ```javascript
    const str = 'hello'
    p.datum(str)
    p.text(function(d, i){
        return "第 "+ i + " 个元素绑定的数据是 " + d;
    });
    ```

  - 绑定一个数组

    ```javascript
    const arr = ['cat','dog','fish']
    p.data(arr)
    p.text(function(d, i){
        return "第 "+ i + " 个元素绑定的数据是 " + d;
    });
    ```

    > 注:d为数据,i为索引

- 拖动

  - 绑定事件

    ```javascript
            d3.selectAll('.sel').call(d3.drag()
                .on("start", started)
                .on("drag", dragged)
                .on("end", ended))
    ```

  - 指定主体访问器

    ```javascript
            d3.selectAll('.sel').call(d3.drag().subject(this)
                .on("start", started)
                .on("drag", dragged)
                .on("end", ended))
    ```

- call

  ```JavaScript
  //已知函数
  function name(selection, first, last) {
    selection
        .attr("first-name", first)
        .attr("last-name", last);
  }

  d3.selectAll("div").call(name, "John", "Snow");
  //等同于
  name(d3.selectAll("div"), "John", "Snow");
  ```

  ​