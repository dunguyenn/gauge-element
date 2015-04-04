Polymer 'gauge-element',
  created: ->
    console.log 'gauge created'
#    console.log @
  ready: ->
    console.log "gauge ready"

    arrowColor = "#1e98e4"
    gaugeColor = "#666"

    @.paper = Raphael(@.$.gauge, 400, 340)

    @.arrow = @.paper.path("M200,200 m5,0 L200,10 l-5,200 z").attr
      "fill": arrowColor
      "stroke-width": 0
    .transform("r90,200,200")

    @.paper.circle(200,200,10).attr
      "fill": arrowColor
      "stroke-width": 0

    console.log "aperture:" + @.aperture

    startAngle = 90 + (360 - @.aperture)/2
    console.log "startAngle:" + startAngle

    @.arrow.transform("...r" + startAngle + ",200,200")

    angle = @.aperture/@.data.length
    console.log "angle:" + angle

#    @.drawMarks(50, 100)

    for d, i in @.data
      endAngle = startAngle + angle
      color = if d.color? then d.color else gaugeColor
      @.drawArc(startAngle, endAngle, 180, color)
      startAngle += angle

  publish:
    label: ''
    aperture: 270
    data: []
    arcs: []
    marks: []

  drawArc: (start, end, radius, color) ->
    startAngle = @.getPointOnCircle 200, 180, start
    endAngle = @.getPointOnCircle 200, 180, end

    @.arcs.push @.paper.path("M" + startAngle.x + "," + startAngle.y + " A" + radius + "," + radius + " 0 0,1 " + endAngle.x + "," + endAngle.y).attr
      "stroke": color
      "stroke-width": 4

  drawMarks: (R, total) ->
    for i in [0..total]
      console.log i
      alpha = @.aperture / total
      a = alpha * Math.PI / 180
      x = 200 + R * Math.cos(a)
      y = 200 - R * Math.sin(a)
      @.marks.push @.paper.circle(x, y, 5)

  getPointOnCircle: (center, radius, angle) ->
    x: center + radius * Math.cos(Math.PI*angle/180)
    y: center + radius * Math.sin(Math.PI*angle/180)
