// Make an array which has 2 of each, then randomize it
function playGameOne(difficulty, faces,canvasId,rows,cols,width) {
  console.log("in playgame");
  var canvas = document.getElementById(canvasId);
  resizeCanvas();

  var click_audio = new Audio('click.mp3');

  var ctx = canvas.getContext("2d");
  var Tile = function(x, y, face) {
      this.x = x;
      this.y = y;
      this.face = face;
      this.width = width;
      this.matched = false;
  };

  Tile.prototype.drawFaceDown = function(){
    ctx.beginPath();
    ctx.fillStyle="darkslategray";
    ctx.fillRect(this.x,this.y,this.width,this.width);
    console.log(this.width);
    //var img = new Image();
    //img.src = "memGameBackground.jpg";
     this.isFaceUp = false;
  }

  Tile.prototype.drawFaceUp= function(){
    ctx.beginPath();
    ctx.fillStyle=this.face;
    ctx.fillRect(this.x,this.y,this.width,this.width);
    this.isFaceUp = true;
  }

  var selected = [];
  for (var i = 0; i < (rows*cols)/2; i++) {
      // Randomly pick one from the array of remaining faces
      var randomInd = Math.floor(Math.random() * (faces.length -1));
      var face = faces[randomInd];
      // Push 2 copies onto array
    //  console.log(face);
      selected.push(face);
      selected.push(face);
      // Remove from array
      faces.splice(randomInd, 1);
  }

  //shuffle the array
  //taken from Stackoverflow, implements Fisher Yates shuffle
  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  shuffle(selected);

  // Create the tiles
  var tiles = [];
  for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
          var face = selected.pop()
          tiles.push(new Tile(i * (width+8) + 5, j * (width+8) + 5, face));
      }
  }

  // Start by drawing them all face down
  function faceDown() {
    for (var i = 0; i < tiles.length; i++) {
    //  console.log(tiles[i].face);
      if (!tiles[i].matched){
        tiles[i].drawFaceDown();
      }
    }
  }
  faceDown();

  Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
           y >= this.y && y <= this.y + this.width;
  }


  var tilesFlipped = [];
  var numFlips = 0;
  function flipTile(event){
    for (var i = 0; i < tiles.length; i++){
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      if(tiles[i].isUnderMouse(x, y)){
        if (!tiles[i].isFaceup && tilesFlipped.length < 2){
          click_audio.play();
          tiles[i].drawFaceUp();
          tilesFlipped.push(tiles[i]);
        }
        if (tilesFlipped.length ==2){
          numFlips++;
          console.log(tilesFlipped[1].face +"," + tilesFlipped[0].face);
          if (tilesFlipped[1].face == tilesFlipped[0].face){
            click_audio.play();
            tilesFlipped[1].matched = true;
            tilesFlipped[0].matched = true;
          }
          else {
            click_audio.play();
          }
          setTimeout(faceDown,300);
          tilesFlipped = [];
        }
      }
    }
    checkGameOver();
  }

  document.addEventListener("click", flipTile);
  var won = false;

  function checkGameOver() {
    var foundAllMatches = true;
    for (var i = 0; i < tiles.length; i++){
      foundAllMatches = foundAllMatches && tiles[i].matched;
    }

    if (foundAllMatches && won ==false){
      alert("Congratulations! You succeeded in "+ numFlips + " tries!!!");
      won = true;
    }
  }

  function resizeCanvas() {

    console.log("in resizeCanvas where difficulty = " + difficulty);
    if(difficulty === "easy"){
      console.log("in easy!!!!");
      canvas.width = "320";
      canvas.height = "320";
    }
    if(difficulty === "medium"){
      canvas.width = "410";
      canvas.height = "410";
    }
    if(difficulty === "hard"){
      canvas.width = "470";
      canvas.height = "470";
    }
    else
      console.log("difficulty didn't equal anything?????");

  }

}


// Make an array which has 2 of each, then randomize it
function playGameTwo(difficulty, faces1, faces2, canvasId,rows,cols,width){
  console.log("in playgametwo");
  var canvas = document.getElementById(canvasId);
  resizeCanvas();

  var click_audio = new Audio('click.mp3');

  var ctx = canvas.getContext("2d");
  var Colors = function (color1, color2) {
    this.c1 = color1;
    this.c2 = color2;
  }

  var Tile = function(x, y, colors) {
      this.x = x;
      this.y = y;
      this.colors = colors;
      this.width = width;
      this.matched = false;
  };


  Tile.prototype.drawFaceDown = function(){
    ctx.beginPath();
    ctx.fillStyle="darkslategray";
    ctx.fillRect(this.x,this.y,this.width,this.width);
    console.log(this.width);
    //var img = new Image();
    //img.src = "memGameBackground.jpg";
     this.isFaceUp = false;
  }

  Tile.prototype.drawFaceUp= function(){
    ctx.beginPath();
    ctx.fillStyle=this.colors.c1;
    ctx.fillRect(this.x,this.y,this.width,this.width);
    ctx.fillStyle=this.colors.c2;
    ctx.fillRect(this.x+15, this.y+15, this.width-30, this.width-30);
    this.isFaceUp = true;
  }

  var selected = [];
  for (var i = 0; i < (rows*cols)/4; i++) {
      // Randomly pick one from the array of remaining faces
      var randomInd = Math.floor(Math.random() * (faces1.length -1));
      var face1 = faces1[randomInd];
      var face2 = faces2[randomInd];
      // Push 2 copies onto array
    //  console.log(face);
      var color1 = new Colors(face1, face2);
      var color2 = new Colors(face2, face1);
      selected.push(color1);
      selected.push(color1);

      selected.push(color2);
      selected.push(color2);
      // Remove from array
      faces1.splice(randomInd, 1);
      faces2.splice(randomInd, 1);
  }

  //shuffle the array
  //taken from Stackoverflow, implements Fisher Yates shuffle
  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
  }

  shuffle(selected);


  // Create the tiles
  var tiles = [];
  for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
          var color = selected.pop();
          tiles.push(new Tile(i * (width+8) + 5, j * (width+8) + 5, color));
      }
  }

  // Start by drawing them all face down
  function faceDown() {
  for (var i = 0; i < tiles.length; i++) {
  //  console.log(tiles[i].face);
    if (!tiles[i].matched){
        tiles[i].drawFaceDown();
    }
  }
  }
  faceDown();

  Tile.prototype.isUnderMouse = function(x, y) {
      return x >= this.x && x <= this.x + this.width  &&
          y >= this.y && y <= this.y + this.width;
  }


  var tilesFlipped = [];
  var numFlips = 0;
  function flipTile(event){
    for (var i = 0; i < tiles.length; i++){
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      if(tiles[i].isUnderMouse(x, y)){
        if (!tiles[i].isFaceup && tilesFlipped.length < 2){
          click_audio.play();
          tiles[i].drawFaceUp();
          tilesFlipped.push(tiles[i]);
        }
        if (tilesFlipped.length ==2){
          numFlips++;
          console.log("outside color: "+ tilesFlipped[1].colors.c1 +"," + tilesFlipped[0].colors.c1);
          console.log("inside color: "+ tilesFlipped[1].colors.c2 +"," + tilesFlipped[0].colors.c2);
          if (tilesFlipped[1].colors.c1 == tilesFlipped[0].colors.c1 &&
          tilesFlipped[1].colors.c2 == tilesFlipped[0].colors.c2){
            click_audio.play();
            tilesFlipped[1].matched = true;
            tilesFlipped[0].matched = true;
          }
          else {
            click_audio.play();
          }
          setTimeout(faceDown,300);
          tilesFlipped = [];
        }
      }
    }

    checkGameOver();
  }

  document.addEventListener("click", flipTile);
  var won = false;
  function checkGameOver() {
    var foundAllMatches = true;
    for (var i = 0; i < tiles.length; i++){
      foundAllMatches = foundAllMatches && tiles[i].matched;
    }

    if (foundAllMatches && won ==false){
      alert("Congratulations! You succeeded in "+ numFlips + " tries!!!");
      won = true;
    }
  }

  function resizeCanvas() {
    console.log("in resizeCanvas where difficulty = " + difficulty);
    if(difficulty === "easy"){
      console.log("in easy!!!!");
      canvas.width = "320";
      canvas.height = "320";
    }
    if(difficulty === "medium"){
      canvas.width = "410";
      canvas.height = "410";
    }
    if(difficulty === "hard"){
      canvas.width = "470";
      canvas.height = "470";
    }
    else
      console.log("difficulty didn't equal anything?????");
  }
}

function toggleBtnGroup() {

  var colorpick = document.getElementById('color-picker');
  var diff = document.getElementById('difficulty-picker');
  var reset = document.getElementById('resetBtn');

  if (reset.style.display === '' && diff.style.display === '') {
      console.log("colorpick is active");
      colorpick.style.display = 'none';
      diff.style.display = 'block';
      reset.style.display = 'none';
      // return;
  }
  else if (colorpick.style.display === '' && reset.style.display === '') {
    console.log("diff is active");
    colorpick.style.display = 'none';
    diff.style.display = 'none';
    reset.style.display = 'block';
    // return;
  }
  else {
    console.log("reset " + colorpick.style.display);
    colorpick.style.display = 'none';
    diff.style.display = 'none';
    reset.style.display = 'block';
    // return;
  }
}
