Polymer 'gauge-element',
  created: ->
    console.log 'gauge created'
  ready: ->
    console.log "gauge ready"

    @.paper = Raphael(@.$.gauge, 400, 340)
    @.arcs = @.paper.set()
    @.marks = @.paper.set()
    @.center =
      x: 200
      y: 200

    @.startAngle = 90 + (360 - @.aperture)/2
    @.angle = @.aperture/(@.data.length-1)
    arkStartAngle = @.startAngle - @.angle/2

#    console.log "aperture:" + @.aperture
#    console.log "startAngle:" + startAngle
#    console.log "angle:" + angle
#    console.log "arkStartAngle:" + arkStartAngle

#    Рисуем метки
    @.drawMarks 190, (@.data.length-1)*10

#    Рисуем деления
    for d, i in @.data
      color = if d.color then d.color
      endAngle = arkStartAngle + @.angle
      switch i
        when 0
#          console.log "first arc drawing"
          @.drawArc(arkStartAngle + @.angle/2, endAngle, 180, color)
        when @.data.length-1
#          console.log "last arc drawing"
          @.drawArc(arkStartAngle, endAngle - @.angle/2, 180, color)
        else
#          console.log "arc drawing"
          @.drawArc(arkStartAngle, endAngle, 180, color)
      arkStartAngle += @.angle

#    Рисуем стрелку
    @.drawArrow @.startAngle

#  Параметры по умолчанию
  publish:
    label: ''
    aperture: 270
    data: []

  selectNext: ->
    if @.value < @.data.length-1
      @.value = parseInt(@.value) + 1
    else
      @.value = 0

  valueChanged: (oldValue, newValue) ->
    @.rotateArrow @.getArcCenter newValue

  drawArc: (start, end, radius, color) ->
    startAngle = @.getPointOnCircle radius, start
    endAngle = @.getPointOnCircle radius, end
    arc = @.paper.path("M" + startAngle.x + "," + startAngle.y + " A" + radius + "," + radius + " 0 0,1 " + endAngle.x + "," + endAngle.y)
    if color
      arc.node.setAttribute('class', 'arc arc--with-color')
      arc.attr({"stroke": color})
    else
      arc.node.setAttribute('class', 'arc arc--default')

    @.arcs.push arc

  drawMarks: (R, total) ->
    for i in [0..total]
      alpha = @.aperture / total
      a = @.getPointOnCircle R, alpha*i
      mark =  @.paper.circle(a.x, a.y, 1).rotate(@.startAngle, @.center.x, @.center.y)
      mark.node.setAttribute('class', 'mark')
      @.marks.push mark

  drawArrow: (angle) ->
#    Основание стрелки
    @.paper.circle(@.center.x, @.center.y, 10)
      .node.setAttribute('class', 'arrow arrow__base')
#    Стрелка
    @.arrow = @.paper.path("M" + @.center.x + "," + @.center.y + " m0,-5 l190,5 l-190,5 z")
      .transform("r" + angle + "," + @.center.x + "," + @.center.y)
    @.arrow.node.setAttribute('class', 'arrow')
#

  rotateArrow: (angle) ->
    @.arrow.animate
      transform: "r" + angle + "," + @.center.x + "," + @.center.y
    , 500, ">"

  getPointOnCircle: (radius, angle) ->
    x: @.center.x + radius * Math.cos(Math.PI*angle/180)
    y: @.center.y + radius * Math.sin(Math.PI*angle/180)

  getArcCenter: (value) -> @.startAngle + @.angle * parseInt(value)
