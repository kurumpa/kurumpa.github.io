window.onload = function () {
  const model = monaco.editor.createModel(localStorage['__code_v.1'] || '// write code here\nstart(0, 0);', 'javascript')
  model.onDidChangeContent(() => {
    localStorage['__code_v.1'] = model.getValue()
  })
  window.editor = monaco.editor.create(document.getElementById('code'), {
    model,
    minimap: {
      enabled: false
    }
  })

  const gameCanvas = window.gameCanvas = new Vue({
    el: '#gameCanvas',
    data: {
      rows: 40,
      cols: 40,
      cellSize: 30,
      state: []
    }
  })

  const st = gameCanvas.state
  window.start = (x, y) => setPlayerPosition(st, [x, y])
  window.move = (direction) => movePlayer(st, gameCanvas.rows, gameCanvas.cols, direction)
  window.paint = (color) => paintCell(st, getPlayerPosition(st), color)

  for (let x = 0; x < gameCanvas.cols; x += 1) {
    gameCanvas.state.push([])
    for (let y = 0; y < gameCanvas.rows; y += 1) {
      gameCanvas.state[x].push({
        contents: [],
        background: 'white'
      })
    }
  }
}
let debounce
window.addEventListener('resize', () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => window.editor.layout(), 200)
})

function getPlayerPosition (state) {
  let pos = []
  state.forEach((col, x) => {
    col.forEach((cell, y) => {
      if (cell.contents.includes('player')) {
        pos = [x, y]
      }
    })
  })
  return pos
}

function setPlayerPosition (state, [x, y]) {
  removeAt(state, getPlayerPosition(state), 'player')
  insertAt(state, [x, y], 'player')
}


function removeAt (state, [x, y], contents) {
  if (typeof x === 'undefined' || typeof y === 'undefined') {
    return
  }
  const idx = state[x][y].contents.indexOf(contents)
  if (idx > -1) { state[x][y].contents.splice(idx, 1) }
}
function insertAt (state, [x, y], contents) {
  if (typeof x === 'undefined' || typeof y === 'undefined') {
    return
  }
  const idx = state[x][y].contents.indexOf(contents)
  if (idx < 0) { state[x][y].contents.push(contents) }
}

function movePlayer (state, canvasWidth, canvasHeight, direction) {
  const pos = getPlayerPosition(state)
  const d = {
    left: [pos[0] < 1 ? 0 : -1, 0],
    right: [pos[0] >= canvasWidth - 1 ? 0 : 1, 0],
    up: [0, pos[1] < 1 ? 0 : -1],
    down: [0, pos[1] >= canvasHeight - 1 ? 0 : 1],
  }
  const dd = d[direction]

  if (dd) {
    removeAt(state, pos, 'player')
    insertAt(state, [pos[0] + dd[0], pos[1] + dd[1]], 'player')
  } else {
    throw new Error(`Direction ${direction} is not valid. Valid directions are ${Object.keys(d).join(', ')}`)
  }
}

function paintCell (state, [x, y], color) {
  state[x][y].background = color
}
