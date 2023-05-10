import React from "react";
import Draggable from "../views/Draggable";
import DragGroup from "../views/DragGroup";
import Droppable from "../views/Droppable";
import DragLayout from "./DragLayout";

import bar from "../assets/bar.webp";
import line from "../assets/line.webp";
import pie from "../assets/pie.webp";
import bar2 from "../assets/bar2.png";
import line2 from "../assets/line2.png";
import pie2 from "../assets/pie2.png";
const data = [
  {
    text: "第一部分",
    children: [
      { text: "柱状图", type: "bar", url: bar },
      { text: "折线图", type: "line", url: line },
      { text: "饼图", type: "pie", url: pie },
    ],
  },
  {
    text: "第二部分",
    children: [
      { text: "柱状图2", type: "bar2", url: bar2 },
      { text: "折线图2", type: "line2", url: line2 },
      { text: "饼图2", type: "pie2", url: pie2 },
    ],
  },
  {
    text: "第三部分",
    children: [
      { text: "柱状图3", type: "bar", url: bar },
      { text: "折线图3", type: "line", url: line },
      { text: "饼图3", type: "pie", url: pie },
    ],
  },
];
/* 
    使得数组中所有的元素都拥有了唯一的key值。
 */
function addKey(data) {
  let idx = 0; // 外部变量，初始化为0

  function loop(item) {
    item.forEach((subItem) => {
      if (subItem.children && subItem.children.length > 0) {
        loop(subItem.children); // 递归调用
      } else {
        subItem.key = ++idx; // 修改数组中元素的key值
        subItem.disable = false; // 修改数组中元素的key值
      }
    });
  }

  loop(data);
}

addKey(data);
function Content() {
  const DragLayoutRef = React.useRef(null);
  const [box1, setBox1] = React.useState(data);
  const [box2, setBox2] = React.useState([]);

  const handleBox2 = (item,e) => {
    console.log(item,e);
    if (item.disable) return;
    if (box2.find((each) => each.key === item.key)) return;
    // remove from box1
    setBox1((prev) => {
      item.disable = true;
      const copy = [...prev];
      DragLayoutRef.current.addChart(item.type, item);
      setBox2(copy);
      return copy;
    });
    // add to box2
    setBox2((prev) => {
      return [item];
    });
  };

  const setState = (values) => {
    let data1;
    box1.map((item) => {
      const children = item.children?.filter((p) => p.key === values.key)[0];
      if (children) {
        data1 = children;
      }
    });
    const data2 = box2.filter((p) => p.key !== values.key);
    data1.disable = false;
    setBox2(data2);
  };
  const fullScreen=(el)=> {
    var elem = document.getElementById(el);
    console.log('[ elem ] >', elem)
    if(elem){
      // 判断当前浏览器是否支持全屏API
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
      }
    }
    
  }
  return (
    <div className="flex-row">
      <div className="left">
        <Droppable accept="drag-3" text="工具栏" state={box1}>
        <div onClick={()=>fullScreen('rightFull')} className="fullButton">全屏</div>
          {box1.map((item, index) => {
            return (
              <DragGroup title={item.text} key={index}>
                {item.children?.map((drag) => (
                  <Draggable
                    key={drag.key}
                    type="drag-3"
                    text={drag.text}
                    item={drag}
                    disable={drag.disable}
                    state={box1}
                  />
                ))}
              </DragGroup>
            );
          })}
        </Droppable>
        <div
          className="droppable-element"
          draggable={true}
          unselectable="on"
          onDragStart={e => e.dataTransfer.setData("text/plain", "")}
        >
          Droppable Element (Drag me!)
        </div>
      </div>
      <div className="right" id="rightFull">
        <Droppable accept="drag-3" handleDrop={handleBox2} state={box2}>
          <DragLayout ref={DragLayoutRef} setState={setState} />
        </Droppable>
      </div>
    </div>
  );
}

export default Content;