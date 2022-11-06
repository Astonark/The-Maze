var Maze = /** @class */ (function () {
    function Maze(size, rows, columns) {
        this.grid = [];
        this.size = size;
        this.rows = rows;
        this.columns = columns;
    }
    Maze.prototype.setup = function () {
        for (var r = 0; r < this.rows; r++) {
            var row = [];
            for (var c = 0; c < this.columns; c++) {
                var cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        this.current = this.grid[0][0];
    };
    return Maze;
}());
var Cell = /** @class */ (function () {
    function Cell(rowNum, colNum, parentGrid, parentSize) {
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true
        };
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
    }
    return Cell;
}());
var emaze = new Maze(500, 10, 10);
emaze.setup();
