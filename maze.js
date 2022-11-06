var canvas = document.getElementById('maze');
if (canvas != null) {
    var context = canvas.getContext("2d");
}
var current;
var Maze = /** @class */ (function () {
    function Maze(size, rows, columns) {
        this.grid = [];
        this.stack = [];
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
        current = this.grid[0][0];
    };
    Maze.prototype.draw = function () {
        var _this = this;
        canvas.width = this.size;
        canvas.height = this.size;
        canvas.style.background = "black";
        current.visited = true;
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {
                var grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }
        var next = current.checkNeighbours();
        if (next) {
            next.visited = true;
            this.stack.push(current);
            current.highlight(this.columns);
            current.removeWalls(current, next);
            current = next;
        }
        else if (this.stack.length > 0) {
            var cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }
        if (this.stack.length == 0) {
            return;
        }
        window.requestAnimationFrame(function () {
            _this.draw();
        });
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
    Cell.prototype.checkNeighbours = function () {
        var grid = this.parentGrid;
        var row = this.rowNum;
        var col = this.colNum;
        var neighbours = [];
        var top = row !== 0 ? grid[row - 1][col] : undefined;
        var right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        var bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        var left = col !== 0 ? grid[row][col - 1] : undefined;
        if (top && !top.visited)
            neighbours.push(top);
        if (right && !right.visited)
            neighbours.push(right);
        if (bottom && !bottom.visited)
            neighbours.push(bottom);
        if (left && !left.visited)
            neighbours.push(left);
        if (neighbours.length !== 0) {
            var random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        }
        else {
            return undefined;
        }
    };
    Cell.prototype.drawTopWall = function (x, y, size, columns, rows) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + size / columns, y);
        context.stroke();
    };
    Cell.prototype.drawRightWall = function (x, y, size, columns, rows) {
        context.beginPath();
        context.moveTo(x + size / columns, y);
        context.lineTo(x + size / columns, y + size / rows);
        context.stroke();
    };
    Cell.prototype.drawBottomWall = function (x, y, size, columns, rows) {
        context.beginPath();
        context.moveTo(x, y + size / rows);
        context.lineTo(x + size / columns, y + size / rows);
        context.stroke();
    };
    Cell.prototype.drawLeftWall = function (x, y, size, columns, rows) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + size / rows);
        context.stroke();
    };
    Cell.prototype.highlight = function (columns) {
        var x = (this.colNum * this.parentSize) / columns + 1;
        var y = (this.rowNum * this.parentSize) / columns + 1;
        context.fillStyle = "purple";
        context.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
    };
    Cell.prototype.removeWalls = function (cell1, cell2) {
        var x = cell1.colNum - cell2.colNum;
        if (x == 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        }
        else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }
        var y = cell1.rowNum - cell2.rowNum;
        if (y == 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        }
        else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    };
    Cell.prototype.show = function (size, rows, columns) {
        var x = (this.colNum * size) / columns;
        var y = (this.rowNum * size) / rows;
        context.strokeStyle = "white";
        context.fillStyle = "black";
        context.lineWidth = 2;
        if (this.walls.topWall)
            this.drawTopWall(x, y, size, columns, rows);
        if (this.walls.rightWall)
            this.drawRightWall(x, y, size, columns, rows);
        if (this.walls.bottomWall)
            this.drawBottomWall(x, y, size, columns, rows);
        if (this.walls.leftWall)
            this.drawLeftWall(x, y, size, columns, rows);
        if (this.visited) {
            context.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    };
    return Cell;
}());
var emaze = new Maze(500, 25, 25);
emaze.setup();
emaze.draw();
