Polymer('gauge-element', {
  created: function() {},
  ready: function() {
    var arkStartAngle, color, d, endAngle, i, j, len, paperHeight, paperWidth, ref;
    if (this.aperture < 180) {
      paperHeight = this.offsetWidth / 2 + 20;
    } else {

    }
    paperWidth = this.offsetWidth;
    this.paper = Raphael(this.$.gauge, paperWidth, paperHeight);
    this.arcs = this.paper.set();
    this.marks = this.paper.set();
    this.labels = this.paper.set();
    this.center = {
      x: this.offsetWidth / 2,
      y: this.offsetWidth / 2
    };
    this.startAngle = 90 + (360 - this.aperture) / 2;
    this.angle = this.aperture / (this.data.length - 1);
    arkStartAngle = this.startAngle - this.angle / 2;
    ref = this.data;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      d = ref[i];
      color = d.color ? d.color : void 0;
      endAngle = arkStartAngle + this.angle;
      switch (i) {
        case 0:
          this.drawArc(arkStartAngle + this.angle / 2, endAngle, 180, color);
          break;
        case this.data.length - 1:
          this.drawArc(arkStartAngle, endAngle - this.angle / 2, 180, color);
          break;
        default:
          this.drawArc(arkStartAngle, endAngle, 180, color);
      }
      arkStartAngle += this.angle;
    }
    this.drawMarks(190, (this.data.length - 1) * 10);
    this.drawLabels(190);
    return this.drawArrow(this.startAngle);
  },
  publish: {
    label: '',
    aperture: 270,
    data: []
  },
  drawArc: function(start, end, radius, color) {
    var arc, endAngle, startAngle;
    startAngle = this.getPointOnCircle(radius, start);
    endAngle = this.getPointOnCircle(radius, end);
    arc = this.paper.path("M" + startAngle.x + "," + startAngle.y + " A" + radius + "," + radius + " 0 0,1 " + endAngle.x + "," + endAngle.y);
    if (!color) {
      return arc.node.setAttribute('class', 'arc arc--default');
    } else {
      arc.node.setAttribute('class', 'arc arc--with-color');
      return arc.attr({
        "stroke": color
      });
    }
  },
  drawMarks: function(R, total) {
    var angle, i, j, mark, pos, ref, results;
    results = [];
    for (i = j = 0, ref = total; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      angle = this.aperture / total;
      pos = this.getPointOnCircle(R, angle * i);
      mark = this.paper.circle(pos.x, pos.y, 1).rotate(this.startAngle, this.center.x, this.center.y);
      results.push(mark.node.setAttribute('class', 'mark'));
    }
    return results;
  },
  drawLabels: function(R) {
    var d, i, j, label, labelPos, labelText, len, markEndPos, markStartPos, ref, results;
    ref = this.data;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      d = ref[i];
      markStartPos = this.getPointOnCircle(R, this.getArcCenter(i));
      markEndPos = this.getPointOnCircle(R + 5, this.getArcCenter(i));
      labelPos = this.getPointOnCircle(R + 15, this.getArcCenter(i));
      label = this.paper.path("M" + markStartPos.x + "," + markStartPos.y + " L" + markEndPos.x + "," + markEndPos.y + " z");
      label.node.setAttribute('class', 'label label__mark');
      if (typeof d === "number" || typeof d === "string") {
        labelText = this.paper.text(labelPos.x, labelPos.y, d);
      } else {
        labelText = this.paper.text(labelPos.x, labelPos.y, d.label);
      }
      results.push(labelText.node.setAttribute('class', 'label label__text'));
    }
    return results;
  },
  drawArrow: function(angle) {
    this.paper.circle(this.center.x, this.center.y, 10).node.setAttribute('class', 'arrow arrow__base');
    this.arrow = this.paper.path("M" + this.center.x + "," + this.center.y + " m0,-5 l190,5 l-190,5 z").transform("r" + angle + "," + this.center.x + "," + this.center.y);
    return this.arrow.node.setAttribute('class', 'arrow');
  },
  rotateArrow: function(angle) {
    return this.arrow.animate({
      transform: "r" + angle + "," + this.center.x + "," + this.center.y
    }, 500, "<>");
  },
  getPointOnCircle: function(radius, angle) {
    return {
      x: this.center.x + radius * Math.cos(Math.PI * angle / 180),
      y: this.center.y + radius * Math.sin(Math.PI * angle / 180)
    };
  },
  getArcCenter: function(value) {
    return this.startAngle + this.angle * parseInt(value);
  },
  valueChanged: function(oldValue, newValue) {
    return this.rotateArrow(this.getArcCenter(newValue));
  },
  selectNext: function() {
    if (this.value < this.data.length - 1) {
      return this.value = parseInt(this.value) + 1;
    } else {
      return this.value = 0;
    }
  }
});

//# sourceMappingURL=data:application/json;base64,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U0FBQyxLQUFELEdBQUE7V0FBVyxJQUFDLENBQUMsVUFBRixHQUFlLElBQUMsQ0FBQyxLQUFGLEdBQVUsUUFBQSxDQUFTLEtBQVQsRUFBcEM7RUFBQSxDQTlHZDtBQUFBLEVBaUhBLFlBQUEsRUFBYyxTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7V0FBd0IsSUFBQyxDQUFDLFdBQUYsQ0FBYyxJQUFDLENBQUMsWUFBRixDQUFlLFFBQWYsQ0FBZCxFQUF4QjtFQUFBLENBakhkO0FBQUEsRUFtSEEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLElBQUEsSUFBRyxJQUFDLENBQUMsS0FBRixHQUFVLElBQUMsQ0FBQyxJQUFJLENBQUMsTUFBUCxHQUFjLENBQTNCO2FBQ0UsSUFBQyxDQUFDLEtBQUYsR0FBVSxRQUFBLENBQVMsSUFBQyxDQUFDLEtBQVgsQ0FBQSxHQUFvQixFQURoQztLQUFBLE1BQUE7YUFHRSxJQUFDLENBQUMsS0FBRixHQUFVLEVBSFo7S0FEVTtFQUFBLENBbkhaO0NBREYsQ0FBQSxDQUFBIiwiZmlsZSI6ImdhdWdlLWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJQb2x5bWVyICdnYXVnZS1lbGVtZW50JyxcbiAgY3JlYXRlZDogLT5cbiMgICAgY29uc29sZS5sb2cgJ2dhdWdlIGNyZWF0ZWQnXG4gIHJlYWR5OiAtPlxuIyAgICBjb25zb2xlLmxvZyBcImdhdWdlIHJlYWR5XCJcblxuICAgIGlmIEAuYXBlcnR1cmUgPCAxODBcbiAgICAgIHBhcGVySGVpZ2h0ID0gQC5vZmZzZXRXaWR0aC8yICsgMjBcbiAgICBlbHNlXG4jICAgICAgcGFwZXJIZWlnaHQgPSBALm9mZnNldEhlaWdodFxuXG4gICAgcGFwZXJXaWR0aCA9IEAub2Zmc2V0V2lkdGhcblxuICAgIEAucGFwZXIgPSBSYXBoYWVsKEAuJC5nYXVnZSwgcGFwZXJXaWR0aCwgcGFwZXJIZWlnaHQpXG4gICAgQC5hcmNzID0gQC5wYXBlci5zZXQoKVxuICAgIEAubWFya3MgPSBALnBhcGVyLnNldCgpXG4gICAgQC5sYWJlbHMgPSBALnBhcGVyLnNldCgpXG4gICAgQC5jZW50ZXIgPVxuICAgICAgeDogQC5vZmZzZXRXaWR0aC8yXG4gICAgICB5OiBALm9mZnNldFdpZHRoLzJcblxuICAgIEAuc3RhcnRBbmdsZSA9IDkwICsgKDM2MCAtIEAuYXBlcnR1cmUpLzJcbiAgICBALmFuZ2xlID0gQC5hcGVydHVyZS8oQC5kYXRhLmxlbmd0aC0xKVxuICAgIGFya1N0YXJ0QW5nbGUgPSBALnN0YXJ0QW5nbGUgLSBALmFuZ2xlLzJcblxuIyAgICBjb25zb2xlLmxvZyBcImFwZXJ0dXJlOlwiICsgQC5hcGVydHVyZVxuIyAgICBjb25zb2xlLmxvZyBcInN0YXJ0QW5nbGU6XCIgKyBzdGFydEFuZ2xlXG4jICAgIGNvbnNvbGUubG9nIFwiYW5nbGU6XCIgKyBhbmdsZVxuIyAgICBjb25zb2xlLmxvZyBcImFya1N0YXJ0QW5nbGU6XCIgKyBhcmtTdGFydEFuZ2xlXG5cbiMgICAg0KDQuNGB0YPQtdC8INC00LXQu9C10L3QuNGPXG4gICAgZm9yIGQsIGkgaW4gQC5kYXRhXG4gICAgICBjb2xvciA9IGlmIGQuY29sb3IgdGhlbiBkLmNvbG9yXG4gICAgICBlbmRBbmdsZSA9IGFya1N0YXJ0QW5nbGUgKyBALmFuZ2xlXG4gICAgICBzd2l0Y2ggaVxuICAgICAgICB3aGVuIDBcbiMgICAgICAgICAgY29uc29sZS5sb2cgXCJmaXJzdCBhcmMgZHJhd2luZ1wiXG4gICAgICAgICAgQC5kcmF3QXJjKGFya1N0YXJ0QW5nbGUgKyBALmFuZ2xlLzIsIGVuZEFuZ2xlLCAxODAsIGNvbG9yKVxuICAgICAgICB3aGVuIEAuZGF0YS5sZW5ndGgtMVxuIyAgICAgICAgICBjb25zb2xlLmxvZyBcImxhc3QgYXJjIGRyYXdpbmdcIlxuICAgICAgICAgIEAuZHJhd0FyYyhhcmtTdGFydEFuZ2xlLCBlbmRBbmdsZSAtIEAuYW5nbGUvMiwgMTgwLCBjb2xvcilcbiAgICAgICAgZWxzZVxuIyAgICAgICAgICBjb25zb2xlLmxvZyBcImFyYyBkcmF3aW5nXCJcbiAgICAgICAgICBALmRyYXdBcmMoYXJrU3RhcnRBbmdsZSwgZW5kQW5nbGUsIDE4MCwgY29sb3IpXG4gICAgICBhcmtTdGFydEFuZ2xlICs9IEAuYW5nbGVcblxuIyAgICDQoNC40YHRg9C10Lwg0LzQtdGC0LrQuFxuICAgIEAuZHJhd01hcmtzIDE5MCwgKEAuZGF0YS5sZW5ndGgtMSkqMTBcbiAgICBALmRyYXdMYWJlbHMgMTkwXG4jICAgINCg0LjRgdGD0LXQvCDRgdGC0YDQtdC70LrRg1xuICAgIEAuZHJhd0Fycm93IEAuc3RhcnRBbmdsZVxuXG4jICDQn9Cw0YDQsNC80LXRgtGA0Ysg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgcHVibGlzaDpcbiAgICBsYWJlbDogJydcbiAgICBhcGVydHVyZTogMjcwXG4gICAgZGF0YTogW11cblxuICBkcmF3QXJjOiAoc3RhcnQsIGVuZCwgcmFkaXVzLCBjb2xvcikgLT5cbiAgICBzdGFydEFuZ2xlID0gQC5nZXRQb2ludE9uQ2lyY2xlIHJhZGl1cywgc3RhcnRcbiAgICBlbmRBbmdsZSA9IEAuZ2V0UG9pbnRPbkNpcmNsZSByYWRpdXMsIGVuZFxuICAgIGFyYyA9IEAucGFwZXIucGF0aChcIk1cIiArIHN0YXJ0QW5nbGUueCArIFwiLFwiICsgc3RhcnRBbmdsZS55ICsgXCIgQVwiICsgcmFkaXVzICsgXCIsXCIgKyByYWRpdXMgKyBcIiAwIDAsMSBcIiArIGVuZEFuZ2xlLnggKyBcIixcIiArIGVuZEFuZ2xlLnkpXG4gICAgaWYgIWNvbG9yXG4gICAgICBhcmMubm9kZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2FyYyBhcmMtLWRlZmF1bHQnKVxuICAgIGVsc2VcbiAgICAgIGFyYy5ub2RlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXJjIGFyYy0td2l0aC1jb2xvcicpXG4gICAgICBhcmMuYXR0cih7XCJzdHJva2VcIjogY29sb3J9KVxuXG4gIGRyYXdNYXJrczogKFIsIHRvdGFsKSAtPlxuICAgIGZvciBpIGluIFswLi50b3RhbF1cbiAgICAgIGFuZ2xlID0gQC5hcGVydHVyZSAvIHRvdGFsXG4gICAgICBwb3MgPSBALmdldFBvaW50T25DaXJjbGUgUiwgYW5nbGUqaVxuICAgICAgbWFyayA9ICBALnBhcGVyLmNpcmNsZShwb3MueCwgcG9zLnksIDEpLnJvdGF0ZShALnN0YXJ0QW5nbGUsIEAuY2VudGVyLngsIEAuY2VudGVyLnkpXG4gICAgICBtYXJrLm5vZGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYXJrJylcblxuICBkcmF3TGFiZWxzOiAoUikgLT5cbiAgICBmb3IgZCwgaSBpbiBALmRhdGFcbiAgICAgIG1hcmtTdGFydFBvcyA9IEAuZ2V0UG9pbnRPbkNpcmNsZSBSLCBALmdldEFyY0NlbnRlciBpXG4gICAgICBtYXJrRW5kUG9zID0gQC5nZXRQb2ludE9uQ2lyY2xlIFIgKyA1LCBALmdldEFyY0NlbnRlciBpXG4gICAgICBsYWJlbFBvcyA9IEAuZ2V0UG9pbnRPbkNpcmNsZSBSICsgMTUsIEAuZ2V0QXJjQ2VudGVyIGlcblxuICAgICAgbGFiZWwgPSAgQC5wYXBlci5wYXRoKFwiTVwiICsgbWFya1N0YXJ0UG9zLnggKyBcIixcIiArIG1hcmtTdGFydFBvcy55ICsgXCIgTFwiICsgbWFya0VuZFBvcy54ICsgXCIsXCIgKyBtYXJrRW5kUG9zLnkgKyBcIiB6XCIpXG4gICAgICBsYWJlbC5ub2RlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWwgbGFiZWxfX21hcmsnKVxuXG4gICAgICBpZiB0eXBlb2YgZCA9PSBcIm51bWJlclwiIG9yIHR5cGVvZiBkID09IFwic3RyaW5nXCJcbiAgICAgICAgbGFiZWxUZXh0ID0gQC5wYXBlci50ZXh0KGxhYmVsUG9zLngsIGxhYmVsUG9zLnksIGQpXG4gICAgICBlbHNlXG4gICAgICAgIGxhYmVsVGV4dCA9IEAucGFwZXIudGV4dChsYWJlbFBvcy54LCBsYWJlbFBvcy55LCBkLmxhYmVsKVxuICAgICAgbGFiZWxUZXh0Lm5vZGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdsYWJlbCBsYWJlbF9fdGV4dCcpXG5cbiAgZHJhd0Fycm93OiAoYW5nbGUpIC0+XG4jICAgINCe0YHQvdC+0LLQsNC90LjQtSDRgdGC0YDQtdC70LrQuFxuICAgIEAucGFwZXIuY2lyY2xlKEAuY2VudGVyLngsIEAuY2VudGVyLnksIDEwKVxuICAgICAgLm5vZGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhcnJvdyBhcnJvd19fYmFzZScpXG4jICAgINCh0YLRgNC10LvQutCwXG4gICAgQC5hcnJvdyA9IEAucGFwZXIucGF0aChcIk1cIiArIEAuY2VudGVyLnggKyBcIixcIiArIEAuY2VudGVyLnkgKyBcIiBtMCwtNSBsMTkwLDUgbC0xOTAsNSB6XCIpXG4gICAgICAudHJhbnNmb3JtKFwiclwiICsgYW5nbGUgKyBcIixcIiArIEAuY2VudGVyLnggKyBcIixcIiArIEAuY2VudGVyLnkpXG4gICAgQC5hcnJvdy5ub2RlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXJyb3cnKVxuXG4jICDQn9C+0LLQvtGA0L7RgiDRgdGC0YDQtdC70LrQuCDQvdCwINC30LDQtNCw0L3QvdGL0Lkg0YPQs9C+0LtcbiAgcm90YXRlQXJyb3c6IChhbmdsZSkgLT5cbiAgICBALmFycm93LmFuaW1hdGVcbiAgICAgIHRyYW5zZm9ybTogXCJyXCIgKyBhbmdsZSArIFwiLFwiICsgQC5jZW50ZXIueCArIFwiLFwiICsgQC5jZW50ZXIueVxuICAgICwgNTAwLCBcIjw+XCJcblxuIyAg0J/QvtC30LLRgNCw0YnQsNC10YIg0L7QsdGK0LXQutGCINGBINC60L7QvtGA0LTQuNC90LDRgtCw0LzQuCDRgtC+0YfQutC4INC90LDRhdC+0LTRj9GJ0LXQudGB0Y8g0L/QvtC0INC30LDQtNCw0L3QvdGL0Lwg0YPQs9C70L7QvCDQvdCwINC+0LrRgNGD0LbQvdC+0YHRgtC4INC30LDQtNCw0L3QvdC+0LPQviDRgNCw0LTQuNGD0YHQsFxuICBnZXRQb2ludE9uQ2lyY2xlOiAocmFkaXVzLCBhbmdsZSkgLT5cbiAgICB4OiBALmNlbnRlci54ICsgcmFkaXVzICogTWF0aC5jb3MoTWF0aC5QSSphbmdsZS8xODApXG4gICAgeTogQC5jZW50ZXIueSArIHJhZGl1cyAqIE1hdGguc2luKE1hdGguUEkqYW5nbGUvMTgwKVxuXG4jICDQktC+0LfQstC+0YDQsNGJ0LDQtdGCINGD0LPQvtC7INCyINCz0YDQsNC00YPRgdCw0YUg0LrQvtGC0L7RgNGL0Lkg0YHQvtC+0YLQstC10YLRgdGC0LLRg9C10YIg0YHQtdGA0LXQtNC40L3QtSDRgdC10LrRgtC+0YDQsFxuICBnZXRBcmNDZW50ZXI6ICh2YWx1ZSkgLT4gQC5zdGFydEFuZ2xlICsgQC5hbmdsZSAqIHBhcnNlSW50KHZhbHVlKVxuXG5cbiAgdmFsdWVDaGFuZ2VkOiAob2xkVmFsdWUsIG5ld1ZhbHVlKSAtPiBALnJvdGF0ZUFycm93IEAuZ2V0QXJjQ2VudGVyIG5ld1ZhbHVlXG5cbiAgc2VsZWN0TmV4dDogLT5cbiAgICBpZiBALnZhbHVlIDwgQC5kYXRhLmxlbmd0aC0xXG4gICAgICBALnZhbHVlID0gcGFyc2VJbnQoQC52YWx1ZSkgKyAxXG4gICAgZWxzZVxuICAgICAgQC52YWx1ZSA9IDBcblxuIl19