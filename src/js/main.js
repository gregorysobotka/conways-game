var cgol = (function(){

    var publicMethods = publicMethods || {};

    publicMethods.config = {
        stepSpeed:.5,
        deadBoard : false
    };

    publicMethods.grid = publicMethods.grid || {};

    publicMethods.createGrid = function(patternName, patterns){
        return new grid(
          patterns[(patternName.length > 0)
            ? patternName.replace('?','')
            : 'random']);
    };

    publicMethods.numberNeigbhors = function(row, col){

        var count = 0, grid = publicMethods.grid;

        count = grid.isValidLocation(row - 1, col) ? count + 1 : count ;        // N
        count = grid.isValidLocation(row - 1, col+1) ? count + 1 : count ;      // NE
        count = grid.isValidLocation(row, col+1) ? count + 1 : count ;          // E
        count = grid.isValidLocation(row+1, col+1) ? count + 1 : count ;        // SE
        count = grid.isValidLocation(row+1, col) ? count + 1 : count ;          // S
        count = grid.isValidLocation(row+1, col-1) ? count + 1 : count ;        // SW
        count = grid.isValidLocation(row, col-1) ? count + 1 : count ;          // W
        count = grid.isValidLocation(row-1, col-1) ? count + 1 : count ;        // NW

        return count;

    };

    publicMethods.createNextGeneration = function(){

        var currentGrid = publicMethods.grid.currentGrid,
            nextGrid = JSON.parse( JSON.stringify( currentGrid )),
            numberOfNeighbors = 0,
            noChange = true,
            currentCell;

        for(var row = 0; row < currentGrid.length; row++){

            for(var col = 0; col < currentGrid[row].length; col++){

                currentCell = currentGrid[row][col];
                numberOfNeighbors = this.numberNeigbhors(row, col);

                if(currentCell === 1 && numberOfNeighbors !== 2 && numberOfNeighbors !== 3){
                  nextGrid[row][col] = 0;
                } else if(currentCell === 0 && numberOfNeighbors === 3){
                  nextGrid[row][col] = 1;
                }

                noChange = ( noChange === false || currentGrid[row][col] !== nextGrid[row][col] ) ? false : true ;

            }

        }

        publicMethods.config.deadBoard = noChange;

        // Grid update
        publicMethods.grid.nextGrid = nextGrid;
        publicMethods.grid.currentGrid = nextGrid;
        publicMethods.grid.generation++;

    };

    publicMethods.render = function(){

        var currentGrid = publicMethods.grid.currentGrid,
        rawHtml = "<p>Grid Generation : "+publicMethods.grid.generation+"</p>";

        for(var i = 0; i < currentGrid.length; i++){
            rawHtml += "<div class='row'>" + function(){
              var rowHtml = '';
              for(var j = 0; j < currentGrid[i].length; j ++){
                  var cellClass = (currentGrid[i][j] === 1) ? 'cell' : 'dead';
                  rowHtml += "<div class='"+cellClass+"'></div>";
              }
              return rowHtml;
            }() + "</div>";
        }

        $('#cgol').html(rawHtml);

    };

    publicMethods.init = function(patterns){

        var grid = publicMethods.grid = publicMethods.createGrid(window.location.search, patterns);

        var timeLine = setInterval(function(){
            publicMethods.render();
            publicMethods.createNextGeneration();
            if(publicMethods.config.deadBoard) clearInterval(timeLine);
        }, 1000 * publicMethods.config.stepSpeed);

    };

    return publicMethods;

}());

// start
cgol.init(patterns());
