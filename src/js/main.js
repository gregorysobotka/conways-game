var cgol = (function(){

    var publicMethods = publicMethods || {};

    publicMethods.config = {
        stepSpeed:.5,
        deadBoard : false,
        grid : {}
    };

    publicMethods.createGrid = function(patternName, patterns){

        patternName = (patternName.length > 0) ? patternName.replace('?','') : 'random';

        return new grid(patterns[patternName]);

    };

    publicMethods.numberNeigbhors = function(row, col){

        var count = 0, grid = this.config.grid;

        count = grid.isValidLocation(row - 1, col) ? count + 1 : count ; // N
        count = grid.isValidLocation(row - 1, col+1) ? count + 1 : count ; // NE
        count = grid.isValidLocation(row, col+1) ? count + 1 : count ; // E
        count = grid.isValidLocation(row+1, col+1) ? count + 1 : count ; // SE
        count = grid.isValidLocation(row+1, col) ? count + 1 : count ; // S
        count = grid.isValidLocation(row+1, col-1) ? count + 1 : count ; // SW
        count = grid.isValidLocation(row, col-1) ? count + 1 : count ; // W
        count = grid.isValidLocation(row-1, col-1) ? count + 1 : count ; // NW

        return count;

    };

    publicMethods.createNextGeneration = function(){

        var grid = this.config.grid.currentGrid.slice(0),
            nextGrid = JSON.parse( JSON.stringify( grid )),
            numberOfNeighbors = 0,
            noChange = true,
            currentCell;

        this.config.grid.nextGrid = nextGrid;

        for(var row = 0; row < grid.length; row++){
            for(var col = 0; col < grid[row].length; col++){

                currentCell = grid[row][col];
                numberOfNeighbors = this.numberNeigbhors(row, col);

                if(currentCell === 1){
                    if( numberOfNeighbors !== 2 && numberOfNeighbors !== 3 ) {
                        nextGrid[row][col] = 0;
                    }
                } else if(currentCell === 0){
                    if(numberOfNeighbors === 3) {
                        nextGrid[row][col] = 1;
                    }
                }

                noChange = ( noChange === false || grid[row][col] !== nextGrid[row][col] ) ? false : true ;

            }
        }

        this.config.deadBoard = noChange;
        this.config.grid.currentGrid = nextGrid;
        this.config.grid.generation++;

        this.render();

    };

    publicMethods.render = function(){

        var rawHtml = "<p>Grid Generation : "+this.config.grid.generation+"</p>",
            grid = this.config.grid.currentGrid,
            cellClass;

        for(var i = 0; i < grid.length; i++){
            rawHtml+="<div class='row'>";
            for(var j = 0; j < grid[i].length; j ++){
                cellClass = (grid[i][j] === 1) ? 'cell' : 'dead';
                rawHtml += "<div class='"+cellClass+"'></div>";
            }
            rawHtml += "</div>";
        }

        $('#cgol').html(rawHtml);

    };

    publicMethods.step = function(){
        this.createNextGeneration();
    };

    publicMethods.init = function(patterns){

        var grid = publicMethods.createGrid(window.location.search, patterns);

        grid.details.height = grid.currentGrid[0].length;
        grid.details.width = grid.currentGrid[0].length;
        publicMethods.config.grid = grid;

        publicMethods.render();

        var timeLine = setInterval(function(){
            publicMethods.step();
            if(publicMethods.config.deadBoard) clearInterval(timeLine);
        }, 1000 * publicMethods.config.stepSpeed);

    };

    return publicMethods;

}());

// start
cgol.init(patterns());
