window.onload = () => {
    boxesInit()
    candyInit();
}

var swapBox1, swapBox2;
const GRID_SIZE = 9;

function updateScoreBoard(incrementScoreBy){
    let score = document.getElementsByClassName('score')[0];
    let currentScore = parseInt(score.innerHTML);
    score.innerHTML = currentScore + incrementScoreBy;
}

function removeMarkedBoxes(markedBoxes){
    
    for(let i=0; i<markedBoxes.length; i++){
        let box = markedBoxes[i];
        let oldCandy = box.className.replace('box ', '');
        delete box.dataset.toberemoved
        box.className = 'box ' + getRandomCandyExcept(oldCandy);
    }
}

function markForRemovalInRow(rowNum, numOfBoxes, startPositionFromEnd){
    let boxesToRemove = document.querySelectorAll('.box[data-row="'+rowNum+'"]');

    for(let i = startPositionFromEnd-1; i>= startPositionFromEnd-numOfBoxes; i--){
        boxesToRemove[i].dataset.toberemoved = true;

    }
}

function markForRemovalInCol(colNum, numOfBoxes, startPositionFromEnd){
    let boxesToRemove = document.querySelectorAll('.box[data-col="'+colNum+'"]');

    for(let i = startPositionFromEnd-1; i>= startPositionFromEnd-numOfBoxes; i--){
        boxesToRemove[i].dataset.toberemoved = true;
    }
}

function scanRows() {
    let found = false;
    for (let rowNum = 0; rowNum < GRID_SIZE; rowNum++) {
        let classArray = [];
        let boxesInARow = document.querySelectorAll('.box[data-row="'+rowNum+'"]')
        for (let colNum = 0; colNum < GRID_SIZE; colNum++) {
            let className = boxesInARow[colNum].className;
            className = className.replace('box ', '');
            classArray.push(className);
        } 
        let countClasses = 1;
        for (let i = 0; i < classArray.length; i++) {
            if (classArray[i] == classArray[i - 1])
                countClasses++;
            else {
                if(countClasses>=3){
                    console.log(countClasses,'class: ', classArray[i],'col: ', i, 'row: ' , rowNum);
                    markForRemovalInRow(rowNum, countClasses, i);
                    found = true;
                }
                countClasses = 1;
            }          
        }
        if(countClasses>=3){
            //console.log(countClasses,'class: ', classArray[i],'col: ', i, 'row: ' , rowNum);
            markForRemovalInRow(rowNum, countClasses, GRID_SIZE);
            found = true;
        }
    }
    return found;
}

function scanCols() {
    let found = false;
    for (let colNum = 0; colNum < GRID_SIZE; colNum++){
        let classArray = [];
        let boxesInACol = document.querySelectorAll('.box[data-col="'+colNum+'"]')
        for (let rowNum = 0; rowNum < GRID_SIZE; rowNum++){
            let className = boxesInACol[rowNum].className;
            className = className.replace('box ', '');
            classArray.push(className);
        }
        let countClasses = 1;
        for (let i = 0; i < classArray.length; i++) {
            if (classArray[i] == classArray[i - 1])
                countClasses++;
            else {
                if(countClasses>=3){
                    console.log(countClasses,'class: ', classArray[i],'row: ', i, 'col: ' , colNum);
                    markForRemovalInCol(colNum, countClasses, i);
                    found = true;
                }
                countClasses = 1;
            }           
        }
        if(countClasses>=3){
            //console.log(countClasses,'class: ', classArray[i],'col: ', i, 'row: ' , rowNum);
            markForRemovalInCol(colNum, countClasses, GRID_SIZE);
            found = true;
        }
    }
    return found;
}

function scanBoard() {
    let f1 = scanRows();
    let f2 = scanCols();
    
    setTimeout(function(){
        let markedBoxes = document.querySelectorAll('.box[data-toberemoved]');
        updateScoreBoard(markedBoxes.length);
        removeMarkedBoxes(markedBoxes);
    }, 1000);
    return (f1 || f2);
    
}
function dragover_handler(ev) {
    ev.preventDefault();
    //ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
    ev.preventDefault();
    swapBox2 = ev.target;
    if (isSwapAllowed(swapBox1, swapBox2)) {
        swapBoxes(swapBox1, swapBox2);
        scanBoard();
    }
}
function drag_handler(ev) {
    swapBox1 = ev.target;
}
function swapBoxes(box1, box2) {
    let auxClassName;
    auxClassName = box2.className;
    box2.className = box1.className;
    box1.className = auxClassName;
}
function isSwapAllowed(box1, box2) {
    box1Number = parseInt(box1.innerHTML);
    box2Number = parseInt(box2.innerHTML);
    if (box1.className == box2.className) {
        console.log("same color");
        return false
    }
    if (box1Number % GRID_SIZE == 0 && box2Number == box1Number - 1)
        return false;
    if (box2Number % GRID_SIZE == 0 && box1Number == box2Number - 1)
        return false;
    if (box1Number == box2Number + 1 ||
        box1Number == box2Number - 1 ||
        box1Number == box2Number + GRID_SIZE ||
        box1Number == box2Number - GRID_SIZE) {
        return true;
    } else
        return false;
}
function getRandomCandy(){
    let candies = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
    return candies[Math.floor(Math.random() * candies.length)]
}
function getRandomCandyExcept(candy){
    let newCandy = getRandomCandy();
    while (newCandy == candy){
        newCandy = getRandomCandy();
    }
    return newCandy;
}
function boxesInit() {
    let gameBoard = document.getElementById('game-board')
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        let divBox = document.createElement('div');
        divBox.classList.add('box');
        gameBoard.appendChild(divBox)
    }
}
function candyInit() {   
    let boxes = document.body.getElementsByClassName("box");
    let boxNumber = 0;
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            let box = boxes[9*row + col];
            box.innerHTML = boxNumber;
            box.dataset.id = boxNumber;
            box.dataset.row = row;
            box.dataset.col = col;
            boxNumber += 1;
            let candy = getRandomCandy();
            box.classList.add(candy);
            box.draggable = true;
            box.addEventListener('dragover', dragover_handler);
            box.addEventListener('drop', drop_handler);
            box.addEventListener('drag', drag_handler);
        }
    }
    // let scan = scanBoard();
    // while (scan){
    //     scan = scanBoard();
    // }
}




