function grid(pattern){
  this.currentGrid = pattern;
  this.nextGrid = [];
  this.details = {
    width : 0,
    height : 0
  };
  this.generation = 0;
}

grid.prototype.isValidLocation = function(row, col){

  var grid = this.currentGrid;

  var validLocation = true,
      rowLength = grid.length - 1,
      colLength = grid[0].length - 1;

  if( row > rowLength || col > colLength ) {
      validLocation = false;
  } else if( row < 0 || col < 0){
      validLocation = false;
  }

  if( validLocation && grid[row][col] !== 1 ){
      validLocation = false;
  }

  return validLocation;

};
