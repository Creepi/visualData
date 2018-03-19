### D3学习笔记

- 元素操作

  ```javascript
  let p = d3.select("body").selectAll('p').text('helloword')
  ```

  ​

- 绑定数据

  - 绑定一个数据到选择集上

    ```javascript
    let str = 'hello'
    p.datum(str)
    p.text(function(d, i){
        return "第 "+ i + " 个元素绑定的数据是 " + d;
    });
    ```

  - 绑定一个数组到选择集上

    ```javascript
    const arr = ['cat','dog','fish']
    p.data(arr)
    p.text(function(d, i){
        return "第 "+ i + " 个元素绑定的数据是 " + d;
    });
    ```

    > 注:d为数据,i为索引

