document.body.onload = getReady;
function getReady (){
  const TABLE_LENGTH = 50; //change de number of rows in the table
  var intervalId = 0;
  var start = document.getElementById('start');
  var controls = document.getElementById('controls');
  var playBtn = document.createElement('input');
  var totalCells = document.getElementsByTagName('td');
  var cells = new Array(TABLE_LENGTH);    //collection with cells states
  //var x = 0;
  //var y = 0;
  start.addEventListener('click', setEnviroment);
  playBtn = setConstrols(playBtn, 'play', playGame);
  controls.appendChild(playBtn);
  function setEnviroment (){
    let iniTable = document.getElementById('iniTable');
    let currentTag = document.getElementById('tablero');
    let newTable = document.createElement('table');
    fillCells();
    playBtn.disabled = false;
    start.value = 'reload';
    iniTable.removeChild(currentTag);
    newTable.id = 'tablero';
    iniTable.appendChild(newTable);
    for (let i = 0; i < TABLE_LENGTH; i++) {  /*adding new table rows*/
      let isCell = false;
      let newRow = document.createElement('tr');
      currentTag = document.getElementById('tablero');
      newRow.id = setId(i, isCell);
      currentTag.appendChild(newRow);
      currentTag = newRow;
      for (let j = 0; j < TABLE_LENGTH; j++) {   //adding new table cells
        var newCell = document.createElement('td');
        isCell = true;
        newCell.id = setId( (i * TABLE_LENGTH) + j, isCell);
        currentTag.appendChild(newCell);
      }
    }
  }
  function setConstrols(element, content, setEvent){
    element.id = `${content}Game`;
    element.type = 'button';
    element.value = content;
    element.disabled = true;
    element.addEventListener('click', setEvent);
    return element;
  }
  function playGame (){
    playBtn.value === 'play' ? continuePlaying() : stopGame();
  }
  function continuePlaying(){
    console.log('lets play');
    playBtn.value = 'stop';
    intervalId = setInterval(renderTable, 4000);
  }
  function stopGame (){
    playBtn.value = 'play';
    clearInterval(intervalId);
    console.log('stop please!');
  }
  function myPosition(a, b){
    let realPosition = (a*TABLE_LENGTH) + b;
    return realPosition;
  }
  function setId(num, isCell) {
    let cellId = '';
    if(isCell)
      cellId = 'cell';
    else
      cellId = 'row';
    return `${cellId}${num}`;
  }
  function fillCells(){
    for (let i = 0; i < TABLE_LENGTH; i++) { //asigning values to the cells
      cells[i] = new Array(TABLE_LENGTH);
      for(let j = 0; j < TABLE_LENGTH; j++){
        cells[i][j] = {
          howManyNeighbors: 0,
          alive: false,
          position: myPosition(i,j)
        }
        //console.log(`cell position ${cells[i][j].position} // i = ${i} j = ${j}`);
      }
    }
    let randomInitializedCells = getRandom(10, 30);
    for(let i = 0; i < randomInitializedCells; i++){
      for(let j = 0; j < randomInitializedCells; j++){
        let x = getRandom(15, 30);
        let y = getRandom(15, 30);
        cells[x][y].alive = true;
      }
    }
  }
  function getRandom(min, max){
    return Math.random() * (max - min) + min;
  }
  function renderTable(){
    setAlive();
    updateTable();
  }
  function updateTable(){
    let cellIndex = 0;
    for(let x = 0; x < TABLE_LENGTH; x++){
      for(let y = 0; y < TABLE_LENGTH; y++){
        totalCells[cellIndex].style.background = cells[x][y].alive ? 'yellow' : 'red';
        cellIndex++;
      }
    }
  }
  function setAlive (){
    var x;
    var y;
    var aliveNeighbors = 0;
    for(x = 0; x < TABLE_LENGTH; x++){
      for(y = 0; y < TABLE_LENGTH; y++){
        getNeighborsState(x,y);
      }
    }
  }
  function stillAlive(xIndex, yIndex, a, b){
    let x = a;
    let y = b;
    for(let i = 0; i < xIndex.length; i++){
      let a = xIndex[i];
      let b = yIndex[i];
      //console.log(a + ' , ' + b);
      //console.log(b);
      let alive = cells[a][b].alive;
      //let alive = true;
      if(alive){
      //if(cells[i][i].alive){
        aliveNeighbors++;
      }
    }
    if(aliveNeighbors === 2 || aliveNeighbors === 3){
      cells[x][y].alive = true;//still alive
    }
    else {
      cells[x][y].alive = false;//dies
    }
  }
  function getNeighborsState(a,b){
    let x = a;
    let y = b;
    aliveNeighbors = 0;
    if((x === 0 || x === TABLE_LENGTH-1) && (y === 0 || y === TABLE_LENGTH-1)){
      cells[x][y].howManyNeighbors = 3;
      //console.log(cells[x][y].position);
      threeNeighbors(x, y);
    }
    else if(((x>0 && x<TABLE_LENGTH-1) && (y===0 || y===TABLE_LENGTH-1)) || ((x===0 || x===TABLE_LENGTH-1) && (y>0 && y<TABLE_LENGTH-1))){
      cells[x][y].howManyNeighbors = 5;
      fiveNeighbors(x, y);
    }
    else{
      cells[x][y].howManyNeighbors = 8;
      //cells[x][y].alive = true;
      eightNeighbors(x, y);
    }
  }
  function threeNeighbors(a, b){
    let x = a;
    let y = b;
    //console.log('Esc 1');
    if(x === TABLE_LENGTH - 1){
      threeNeighborsCase1(x, y);
    }
    else if(x === 0){
      threeNeighborsCase2(x, y);
    }
    else if(x > y){
      threeNeighborsCase3(x, y);
    }
    else{
      threeNeighborsCase4(x, y);
    }
  }
  function fiveNeighbors(a, b){
    let x = a;
    let y = b;
    //console.log('Esc 2');
    if(y === 0){
      fiveNeighborsCase1(x, y);
    }
    else if(x === TABLE_LENGTH - 1){
      fiveNeighborsCase2(x, y);
    }
    else if(y === TABLE_LENGTH - 1){
      fiveNeighborsCase3(x, y);
    }
    else{
      fiveNeighborsCase4(x, y);
    }
  }
  function eightNeighbors(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(8);
    let yIndex = new Array(8);
    //console.log('Esc 3');
    xIndex = [a-1, a, a+1, a+1, a+1, a, a-1, a-1];
    yIndex = [b-1, b-1, b-1, b, b+1, b+1, b+1, b];
    stillAlive(xIndex, yIndex, a, b);
  }
  function threeNeighborsCase1(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(3);
    let yIndex = new Array(3);
    xIndex = [a, a-1, a-1];
    yIndex = [b-1, b-1, b];
    //console.log('case 1');
    stillAlive(xIndex, yIndex, a, b);
  }
  function threeNeighborsCase2(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(3);
    let yIndex = new Array(3);
    xIndex = [a+1, a+1, a];
    yIndex = [b, b+1, b+1];
    //console.log('case 2');
    stillAlive(xIndex, yIndex, a, b);
  }
  function threeNeighborsCase3(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(3);
    let yIndex = new Array(3);
    xIndex = [a-1, a-1, a];
    yIndex = [b, b+1, b+1];
    //console.log('case 3');
    stillAlive(xIndex, yIndex, a, b);
  }
  function threeNeighborsCase4(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(3);
    let yIndex = new Array(3);
    xIndex = [a, a+1, a+1];
    yIndex = [b-1, b-1, b];
    //console.log('case 4');
    stillAlive(xIndex, yIndex, a, b);
  }
  function fiveNeighborsCase1(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(5);
    let yIndex = new Array(5);
    xIndex = [a-1, a-1, a, a+1, a+1];
    yIndex = [b, b+1, b+1, b+1, b];
    //console.log('case 1');
    stillAlive(xIndex, yIndex, a, b);
  }
  function fiveNeighborsCase2(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(5);
    let yIndex = new Array(5);
    xIndex = [a, a-1, a-1, a-1, a];
    yIndex = [b-1, b-1, b, b+1, b+1];
    //console.log('case 2');
    stillAlive(xIndex, yIndex, a, b);
  }
  function fiveNeighborsCase3(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(5);
    let yIndex = new Array(5);
    xIndex = [a-1, a-1, a, a+1, a+1];
    yIndex = [b, b-1, b-1, b-1, b];
    //console.log('case 3');
    stillAlive(xIndex, yIndex, a, b);
  }
  function fiveNeighborsCase4(x, y){
    let a = x;
    let b = y;
    let xIndex = new Array(5);
    let yIndex = new Array(5);
    xIndex = [a, a+1, a+1, a+1, a];
    yIndex = [b-1, b-1, b, b+1, b+1];
    //console.log('case 1');
    stillAlive(xIndex, yIndex, a, b);
    //console.log('sorry still not working :'c');
  }
}
