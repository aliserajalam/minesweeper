const grid = document.querySelector('.grid')
let width = 10
let cells = []
let isGameOver = false

let bombAmount = 20
let flags = 0

// create Board
function createBoard() {
    // get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)

    const shuffledArray = gameArray.sort(() => Math.random() -0.5)


    for (let i=0; i < width*width; i++) {
        const cell = document.createElement('div')
        cell.setAttribute('id', i)
        cell.classList.add('cell')
        cell.classList.add(shuffledArray[i])

        grid.appendChild(cell)
        cells.push(cell)

        // Normal click
        cell.addEventListener('click', function(e) {
            click(cell)
        })

        // Ctrl and left click
        cell.oncontextmenu = function(e) {
            e.preventDefault()
            addFlag(cell)
        }
    }

    //add numbers
    for (let i=0; i<cells.length; i++) {
        let total = 0
        const isLeftEdge = (i % width === 0)
        const isRightEdge = (i % width === width - 1)

        if (cells[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('bomb')) total ++
            if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('bomb')) total ++
            if (i > 10 && cells[i - width].classList.contains('bomb')) total ++
            if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('bomb')) total ++
            if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('bomb')) total ++
            if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('bomb')) total ++
            if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('bomb')) total ++
            if (i < 89 && cells[i+width].classList.contains('bomb')) total++

            cells[i].setAttribute('data', total)
        }
    }
}



function click(cell) {

    let currentId = cell.id

    if (isGameOver) return
    if (cell.classList.contains('checked') || cell.classList.contains('flag')) return

    if (cell.classList.contains('bomb')) {
        gameOver(cell)
    } else {
        let total = cell.getAttribute('data')
        if (total != 0) {
            cell.classList.add('checked')
            if (total == 1) cell.classList.add('one')
            if (total == 2) cell.classList.add('two')
            if (total == 3) cell.classList.add('three')
            if (total == 4) cell.classList.add('four')
            if (total == 5) cell.classList.add('five')
            if (total == 6) cell.classList.add('six')
            if (total == 7) cell.classList.add('seven')
            if (total == 8) cell.classList.add('eight')
            cell.innerHTML = total
            return
        }
        checkCell(cell, currentId)
    }
    cell.classList.add('checked')
}


// Check neighbouring cells
function checkCell(cell, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = cells[parseInt(currentId) - 1].id
            const newCell = document.getElementById(newId)
            click(newCell)
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = cells[parseInt(currentId) + 1 - width].id
            const newCell = document.getElementById(newId)
            click(newCell) 
        }
        if (currentId > 10) {
            const newId = cells[parseInt(currentId - width)].id
            const newCell = document.getElementById(newId)
            click(newCell) 
        }
        if (currentId > 11 && !isLeftEdge) {
            const newId = cells[parseInt(currentId) - 1 - width].id
            const newCell = document.getElementById(newId)
            click(newCell)
        }
        if (currentId < 98 && !isRightEdge) {
            const newId = cells[parseInt(currentId) + 1].id
            const newCell = document.getElementById(newId)
            click(newCell)
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = cells[parseInt(currentId) - 1 + width].id
            const newCell = document.getElementById(newId)
            click(newCell)
        }
        if (currentId < 88 && !isRightEdge) {
            const newId = cells[parseInt(currentId) + 1 + width].id
            const newCell = document.getElementById(newId)
            click(newCell)
        }
        if (currentId < 89) {
            const newId = cells[parseInt(currentId) + width].id
            const newCell = document.getElementById(newId)
            click(newCell)
        }
    }, 10)
}

function gameOver(cell) {
    console.log()
    isGameOver = true

    // show all bombs
    cells.forEach(cell => {
        if (cell.classList.contains('bomb')) {
            cell.innerHTML = '&#128163;'
            cell.classList.add('checked')
        }
    })
}

// add Flag with right click
function addFlag(cell) {
    if(isGameOver) return
    if(!cell.classList.contains('checked') && (flags < bombAmount)) {
        if (!cell.classList.contains('flag')) {
            cell.classList.add('flag')
            cell.innerHTML = '&#128681;'
            flags ++
            checkForWin()
        } else {
            cell.classList.remove('flag')
            cell.innerHTML = ''
            flags --
        }
    }
}


function checkForWin() {
    let matches = 0

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('flag') && cells[i].classList.contains('bomb')) {
            matches ++
        }
        if (matches === bombAmount) {
            console.log('You Won!')
            isGameOver = true
        }
    }
}


createBoard()