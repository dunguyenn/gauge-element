Polymer 'gauge-element',
  created: ->
#    console.log 'gauge created'
  ready: ->
#    console.log "gauge ready"

    if @.aperture < 180
      paperHeight = @.offsetWidth/2 + 20
    else
#      paperHeight = @.offsetHeight

    paperWidth = @.offsetWidth

    @.paper = Raphael(@.$.gauge, paperWidth, paperHeight)
    @.arcs = @.paper.set()
    @.marks = @.paper.set()
    @.labels = @.paper.set()
    @.center =
      x: @.offsetWidth/2
      y: @.offsetWidth/2

    @.startAngle = 90 + (360 - @.aperture)/2
    @.angle = @.aperture/(@.data.length-1)
    arkStartAngle = @.startAngle - @.angle/2

#    console.log "aperture:" + @.aperture
#    console.log "startAngle:" + startAngle
#    console.log "angle:" + angle
#    console.log "arkStartAngle:" + arkStartAngle

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

#    Рисуем метки
    @.drawMarks 190, (@.data.length-1)*10
    @.drawLabels 190
#    Рисуем стрелку
    @.drawArrow @.startAngle

#  Параметры по умолчанию
  publish:
    label: ''
    aperture: 270
    data: []

  drawArc: (start, end, radius, color) ->
    startAngle = @.getPointOnCircle radius, start
    endAngle = @.getPointOnCircle radius, end
    arc = @.paper.path("M" + startAngle.x + "," + startAngle.y + " A" + radius + "," + radius + " 0 0,1 " + endAngle.x + "," + endAngle.y)
    if !color
      arc.node.setAttribute('class', 'arc arc--default')
    else
      arc.node.setAttribute('class', 'arc arc--with-color')
      arc.attr({"stroke": color})

  drawMarks: (R, total) ->
    for i in [0..total]
      angle = @.aperture / total
      pos = @.getPointOnCircle R, angle*i
      mark =  @.paper.circle(pos.x, pos.y, 1).rotate(@.startAngle, @.center.x, @.center.y)
      mark.node.setAttribute('class', 'mark')

  drawLabels: (R) ->
    for d, i in @.data
      markStartPos = @.getPointOnCircle R, @.getArcCenter i
      markEndPos = @.getPointOnCircle R + 5, @.getArcCenter i
      labelPos = @.getPointOnCircle R + 15, @.getArcCenter i

      label =  @.paper.path("M" + markStartPos.x + "," + markStartPos.y + " L" + markEndPos.x + "," + markEndPos.y + " z")
      label.node.setAttribute('class', 'label label__mark')

      if typeof d == "number" or typeof d == "string"
        labelText = @.paper.text(labelPos.x, labelPos.y, d)
      else
        labelText = @.paper.text(labelPos.x, labelPos.y, d.label)
      labelText.node.setAttribute('class', 'label label__text')

  drawArrow: (angle) ->
#    Основание стрелки
    @.paper.circle(@.center.x, @.center.y, 10)
      .node.setAttribute('class', 'arrow arrow__base')
#    Стрелка
    @.arrow = @.paper.path("M" + @.center.x + "," + @.center.y + " m0,-5 l190,5 l-190,5 z")
      .transform("r" + angle + "," + @.center.x + "," + @.center.y)
    @.arrow.node.setAttribute('class', 'arrow')

#  Поворот стрелки на заданный угол
  rotateArrow: (angle) ->
    @.arrow.animate
      transform: "r" + angle + "," + @.center.x + "," + @.center.y
    , 500, "<>"

#  Позвращает объект с координатами точки находящейся под заданным углом на окружности заданного радиуса
  getPointOnCircle: (radius, angle) ->
    x: @.center.x + radius * Math.cos(Math.PI*angle/180)
    y: @.center.y + radius * Math.sin(Math.PI*angle/180)

#  Возворащает угол в градусах который соответствует середине сектора
  getArcCenter: (value) -> @.startAngle + @.angle * parseInt(value)


  valueChanged: (oldValue, newValue) -> @.rotateArrow @.getArcCenter newValue

  selectNext: ->
    if @.value < @.data.length-1
      @.value = parseInt(@.value) + 1
    else
      @.value = 0

