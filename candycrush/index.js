window.onload = () => {
    candyInit();
}

var swapBox1, swapBox2;
var GRID_SIZE = 9;

function dragover_handler(ev) {
    ev.preventDefault();
    //ev.dataTransfer.dropEffect = "move";
  }
function drop_handler(ev) {
    ev.preventDefault();
    swapBox2 = ev.target;
    if(isSwapAllowed(swapBox1, swapBox2))
        swapBoxes(swapBox1, swapBox2);
  }
function drag_handler(ev){
    swapBox1 = ev.target;
}
function swapBoxes(box1, box2){
    let auxClassName;
    auxClassName = box2.className;
    box2.className = box1.className;
    box1.className = auxClassName;
}
function isSwapAllowed(box1, box2){
    box1Number = parseInt(box1.innerHTML);
    box2Number = parseInt(box2.innerHTML);
    if(box1Number % GRID_SIZE == 0 && box2Number == box1Number-1)
        return false;
    if(box2Number % GRID_SIZE == 0 && box1Number == box2Number-1)
        return false;
    if(box1Number == box2Number +1 || 
        box1Number == box2Number -1 || 
        box1Number == box2Number + GRID_SIZE || 
        box1Number == box2Number - GRID_SIZE){
        return true;
    }else 
        return false;
}

function candyInit(){
    let candies = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
    let boxes = document.body.getElementsByClassName("box");
    let boxNumber = 0;
    for (let box of boxes){      
        box.innerHTML = boxNumber;
        box.dataset.id = boxNumber;
        boxNumber+=1;
        let candy = candies[Math.floor(Math.random() * candies.length)];
        box.classList.add(candy);
        box.draggable = true;
        box.addEventListener('dragover', dragover_handler);
        box.addEventListener('drop', drop_handler);
        box.addEventListener('drag', drag_handler);
    }
}




