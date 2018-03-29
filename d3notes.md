### D3学习笔记

- 元素操作

  ```javascript
  let p = d3.select("body").selectAll('p').text('helloword')
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