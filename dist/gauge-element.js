Polymer('gauge-element', {
  publish: {
    data: [],
    value: 0,
    aperture: 270
  },
  ready: function() {
    var alpha, h, paperHeight, paperWidth;
    paperWidth = this.offsetWidth;
    if (this.aperture < 180) {
      paperHeight = this.offsetWidth / 2 + 20;
    } else if (this.aperture < 360) {
      alpha = (180 - (360 - this.aperture)) / 2;
      h = this.offsetWidth / 2 * Math.sin(Math.PI * alpha / 180);
      paperHeight = this.offsetWidth / 2 + h;
    } else {
      paperHeight = this.offsetWidth;
    }
    this.paper = Raphael(this.$.gauge, paperWidth, paperHeight);
    this.arcs = this.paper.set();
    this.marks = this.paper.set();
    this.labels = this.paper.set();
    this.startAngle = 90 + (360 - this.aperture) / 2;
    this.center = {
      x: this.offsetWidth / 2,
      y: this.offsetWidth / 2
    };
    return this.drawArrow(this.startAngle);
  },
  drawArc: function(start, end, radius, color) {
    var arc, endAngle, startAngle;
    startAngle = this.getPointOnCircle(radius, start);
    endAngle = this.getPointOnCircle(radius, end);
    arc = this.paper.path("M" + startAngle.x + "," + startAngle.y + " A" + radius + "," + radius + " 0 0,1 " + endAngle.x + "," + endAngle.y);
    if (!color) {
      arc.node.setAttribute('class', 'arc arc--default');
    } else {
      arc.node.setAttribute('class', 'arc arc--with-color');
      arc.attr({
        "stroke": color
      });
    }
    return this.arcs.push(arc);
  },
  drawSegments: function() {
    var arkStartAngle, color, d, endAngle, i, j, len, ref, results;
    this.startAngle = 90 + (360 - this.aperture) / 2;
    this.angle = this.aperture / (this.data.length - 1);
    arkStartAngle = this.startAngle - this.angle / 2;
    ref = this.data;
    results = [];
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
      results.push(arkStartAngle += this.angle);
    }
    return results;
  },
  drawMarks: function(R, total) {
    var angle, i, j, mark, pos, ref, results;
    results = [];
    for (i = j = 0, ref = total; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      angle = this.aperture / total;
      pos = this.getPointOnCircle(R, angle * i);
      mark = this.paper.circle(pos.x, pos.y, 1).rotate(this.startAngle, this.center.x, this.center.y);
      mark.node.setAttribute('class', 'mark');
      results.push(this.marks.push(mark));
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
      this.labels.push(label);
      if (typeof d === "number" || typeof d === "string") {
        labelText = this.paper.text(labelPos.x, labelPos.y, d);
      } else {
        labelText = this.paper.text(labelPos.x, labelPos.y, d.label);
      }
      labelText.node.setAttribute('class', 'label label__text');
      results.push(this.labels.push(labelText));
    }
    return results;
  },
  drawArrow: function(angle) {
    this.arrow = this.paper.path("M" + this.center.x + "," + this.center.y + " m0,-5 l190,5 l-190,5 z").transform("r" + angle + "," + this.center.x + "," + this.center.y);
    this.arrow.node.setAttribute('class', 'arrow');
    return this.paper.circle(this.center.x, this.center.y, 10).node.setAttribute('class', 'arrow arrow__base');
  },
  draw: function() {
    this.arcs.remove();
    this.labels.remove();
    this.marks.remove();
    this.drawSegments();
    this.drawMarks(190, (this.data.length - 1) * 10);
    this.drawLabels(190);
    return this.rotateArrow(this.getArcCenter(this.value));
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
  dataChanged: function() {
    return this.draw();
  },
  apertureChanged: function() {
    return this.draw();
  }
});

//# sourceMappingURL=gauge-element.js.map