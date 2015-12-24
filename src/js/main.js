var cgol = (function(){

    var publicMethods = publicMethods || {};

    publicMethods.config = {
        currentGrid : [],
        nextGrid : [],
        gridDetails : {
          width : 0,
          height : 0
        },
        stepSpeed:.5,
        gridGeneration : 1,
        deadGrid : false
    };

    publicMethods.createGrid = function(patternName, patterns){

        patternName = (patternName.length > 0) ? patternName.replace('?','') : 'random';

        return patterns[patternName];

    };

    publicMethods.validLocation = function(grid, row, col){

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

    publicMethods.growGrid = function(direction){

        var nextGrid = publicMethods.config.nextGrid;

        if(direction == 'right'){

        } else if(direction == 'down') {
            for(var i=0;i<rowLength;i++){
                nextGrid[i].push(0);
            }
        }


    };

    publicMethods.numberNeigbhors = function(grid, row, col){

        var validLocation = this.validLocation,
            count = 0;

        count = validLocation(grid, row - 1, col) ? count + 1 : count ; // N
        count = validLocation(grid, row - 1, col+1) ? count + 1 : count ; // NE
        count = validLocation(grid, row, col+1) ? count + 1 : count ; // E
        count = validLocation(grid, row+1, col+1) ? count + 1 : count ; // SE
        count = validLocation(grid, row+1, col) ? count + 1 : count ; // S
        count = validLocation(grid, row+1, col-1) ? count + 1 : count ; // SW
        count = validLocation(grid, row, col-1) ? count + 1 : count ; // W
        count = validLocation(grid, row-1, col-1) ? count + 1 : count ; // NW

        return count;

    };

    publicMethods.createNextGeneration = function(){

        var grid = this.config.currentGrid.slice(0),
            nextGrid = JSON.parse( JSON.stringify( grid )),
            numberOfNeighbors = 0,
            noChange = true,
            currentCell;

        this.config.nextGrid = nextGrid;

        for(var row = 0; row < grid.length; row++){
            for(var col = 0; col < grid[row].length; col++){

                currentCell = grid[row][col];
                numberOfNeighbors = this.numberNeigbhors(grid, row, col);

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

        this.config.deadGrid = noChange;
        this.config.currentGrid = nextGrid;
        this.config.gridGeneration++;

        this.renderCgol();

    };

    publicMethods.renderCgol = function(){

        var rawHtml = "<p>Grid Generation : "+this.config.gridGeneration+"</p>",
            grid = this.config.currentGrid,
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

        var self = this,
            grid = self.createGrid(window.location.search, patterns).slice(0);

        self.config.currentGrid = grid;
        self.config.gridDetails.height = grid.length;
        self.config.gridDetails.width = grid[0].length;

        this.renderCgol();

        var timeLine = setInterval(function(){
            self.step();
            if(self.config.deadGrid) clearInterval(timeLine);
        }, 1000 * self.config.stepSpeed);

    };

    return publicMethods;

}());

// start
cgol.init(patterns());
