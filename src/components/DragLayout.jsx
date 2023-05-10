import React, { PureComponent } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";
import {
  getBarChart,
  getLineChart,
  getPieChart,
  getBar2Chart,
  getLine2Chart,
  getPie2Chart,
} from "./chart";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
  };

  constructor(props) {
    super(props);

    this.state = {
      layouts: this.getFromLS("layouts") || {},
      widgets: [],
    };
  }

  getFromLS(key) {
    let ls = {};
    if (localStorage) {
      try {
        ls = JSON.parse(localStorage.getItem("rgl-8")) || {};
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls[key];
  }

  saveToLS(key, value) {
    if (localStorage) {
      localStorage.setItem(
        "rgl-8",
        JSON.stringify({
          [key]: value,
        })
      );
    }
  }
  generateDOM = () => {
    return _.map(this.state.widgets, (l, i) => {
      let option;
      if (l.type === "bar") {
        option = getBarChart();
      } else if (l.type === "line") {
        option = getLineChart();
      } else if (l.type === "pie") {
        option = getPieChart();
      } else if (l.type === "bar2") {
        option = getBar2Chart();
      } else if (l.type === "line2") {
        option = getLine2Chart();
      } else if (l.type === "pie2") {
        option = getPie2Chart();
      }
      let component = (
        <ReactEcharts
          className="reactEcharts"
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{ width: "100%", height: "100%" }}
        />
      );
      return (
        <div key={l.i} data-grid={l}>
          <span className="remove" onClick={this.onRemoveItem.bind(this, i, l)}>
            x
          </span>
          {component}
        </div>
      );
    });
  };

  addChart(type, data) {
    const addItem = {
      x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    this.setState({
      widgets: this.state.widgets.concat({
        ...addItem,
        type,
        data,
      }),
    });
  }

  onRemoveItem(i, l) {
    console.log(this.state.widgets, l);
    this.setState({
      widgets: this.state.widgets.filter((item, index) => index != i),
    });
    this.props.setState(l.data);
  }

  onLayoutChange(layout, layouts) {
    this.saveToLS("layouts", layouts);
    this.setState({ layouts });
  }
  onDrop = (layout, layoutItem, _event) => {
    console.log('[ layoutItem ] >', layoutItem)
  };
  render() {
    return (
      <ResponsiveReactGridLayout
        {...this.props}
        compactType={null}
        isDroppable={true}
        onDrop={this.onDrop}
        onBreakpointChange={this.onBreakpointChange}
        layouts={this.state.layouts}
        onLayoutChange={(layout, layouts) =>
          this.onLayoutChange(layout, layouts)
        }
      >
        {this.generateDOM()}
      </ResponsiveReactGridLayout>
    );
  }
}
