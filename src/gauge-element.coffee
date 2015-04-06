Polymer 'gauge-element',
  publish:
    data: []
    value: 0
    aperture: 270

  ready: ->
    paperWidth = @.offsetWidth

    if @.aperture < 180
      paperHeight = @.offsetWidth/2 + 20
    else if @.aperture < 360
      alpha = (180-(360-@.aperture))/2
      h = @.offsetWidth/2 * Math.sin(Math.PI*alpha/180)
      paperHeight = @.offsetWidth/2 + h
    else paperHeight = @.offsetWidth

    @.paper = Raphael(@.$.gauge, paperWidth, paperHeight)
    @.arcs = @.paper.set()
    @.marks = @.paper.set()
    @.labels = @.paper.set()
    @.startAngle = 90 + (360 - @.aperture)/2

    @.center =
      x: @.offsetWidth/2
      y: @.offsetWidth/2

    @.drawArrow @.startAngle

#  Рисуем сектор
  drawArc: (start, end, radius, color) ->
    startAngle = @.getPointOnCircle radius, start
    endAngle = @.getPointOnCircle radius, end
    arc = @.paper.path("M" + startAngle.x + "," + startAngle.y + " A" + radius + "," + radius + " 0 0,1 " + endAngle.x + "," + endAngle.y)
    if !color
      arc.node.setAttribute('class', 'arc arc--default')
    else
      arc.node.setAttribute('class', 'arc arc--with-color')
      arc.attr({"stroke": color})
    @.arcs.push arc

#  Рисуем шкалу
  drawSegments: ->
    @.startAngle = 90 + (360 - @.aperture)/2
    @.angle = @.aperture/(@.data.length-1)
    arkStartAngle = @.startAngle - @.angle/2
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

#  Рисуем точки
  drawMarks: (R, total) ->
    for i in [0..total]
      angle = @.aperture / total
      pos = @.getPointOnCircle R, angle*i
      mark =  @.paper.circle(pos.x, pos.y, 1).rotate(@.startAngle, @.center.x, @.center.y)
      mark.node.setAttribute('class', 'mark')
      @.marks.push mark

#  Рисуем значения
  drawLabels: (R) ->
    for d, i in @.data
      markStartPos = @.getPointOnCircle R, @.getArcCenter i
      markEndPos = @.getPointOnCircle R + 5, @.getArcCenter i
      labelPos = @.getPointOnCircle R + 15, @.getArcCenter i

      label =  @.paper.path("M" + markStartPos.x + "," + markStartPos.y + " L" + markEndPos.x + "," + markEndPos.y + " z")
      label.node.setAttribute('class', 'label label__mark')
      @.labels.push label

      if typeof d == "number" or typeof d == "string"
        labelText = @.paper.text(labelPos.x, labelPos.y, d)
      else
        labelText = @.paper.text(labelPos.x, labelPos.y, d.label)
      labelText.node.setAttribute('class', 'label label__text')
      @.labels.push labelText

#  Рисуем стрелку под заданным углом
  drawArrow: (angle) ->
#    Стрелка
    @.arrow = @.paper.path("M" + @.center.x + "," + @.center.y + " m0,-5 l190,5 l-190,5 z")
      .transform("r" + angle + "," + @.center.x + "," + @.center.y)
    @.arrow.node.setAttribute('class', 'arrow')
#    Основание стрелки
    @.paper.circle(@.center.x, @.center.y, 10)
      .node.setAttribute('class', 'arrow arrow__base')

  draw: ->
#    Удаляем отрисованные элементы
    @.arcs.remove()
    @.labels.remove()
    @.marks.remove()

    @.drawSegments()
    @.drawMarks 190, (@.data.length-1)*10
    @.drawLabels 190
    @.rotateArrow @.getArcCenter @.value

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

#  Поворачиваем стрелку при изменение атрибута value
  valueChanged: (oldValue, newValue) -> @.rotateArrow @.getArcCenter newValue

# Перерисовываем шкалу и метки при изменении атрибутов data и aperture
  dataChanged: -> @.draw()
  apertureChanged: -> @.draw()
