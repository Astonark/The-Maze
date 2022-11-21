const canvas = <HTMLCanvasElement> document.getElementById('maze');
if (canvas != null) {
    var context: CanvasRenderingContext2D = canvas.getContext("2d")!;
}
var current

class Maze {
    private size: number;
    private rows: number;
    private columns: number;
    private grid: Array<Cell[]> = [];
    private stack: Array<number> = [];

    constructor(size: number, rows: number, columns: number) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
    }

    setup() {
        for(let r = 0; r < this.rows; r++) {
            let row:Cell[] = [];
            for(let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw() {
        canvas.width = this.size;
        canvas.height = this.size;
        canvas.style.background = "black";
        current.visited = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid = this.grid;
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
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }

        if (this.stack.length == 0) {
            return;
        }

        window.requestAnimationFrame(() => {
            this.draw();
        });
    }
}

class Cell {
    private rowNum: number;
    private colNum: number;
    private parentSize: number;
    private parentGrid: number;
    public visited: false;
    private row: number;
    private walls: any = {
        topWall: true,
        rightWall: true,
        bottomWall: true,
        leftWall: true
    };

    constructor(rowNum: number, colNum: number, parentGrid, parentSize: number) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
    }

    checkNeighbours() {
        let grid: any = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours: any = [];

        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid [row][col - 1] : undefined;

        if (top && !top.visited) neighbours.push(top);
        if (right && !right.visited) neighbours.push(right);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);

        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length)
            return neighbours[random]; 
        } else {
            return undefined;
        }
    }

    drawTopWall(x: number, y: number, size: number, columns: number, rows: number) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + size / columns, y);
        context.stroke();
    }

    drawRightWall(x: number, y: number, size: number, columns: number, rows: number) {
        context.beginPath();
        context.moveTo(x + size / columns, y);
        context.lineTo(x + size / columns, y + size / rows);
        context.stroke();
    }

    drawBottomWall(x: number, y: number, size: number, columns: number, rows: number) {
        context.beginPath();
        context.moveTo(x, y + size / rows);
        context.lineTo(x + size / columns, y + size / rows);
        context.stroke();
    }

    drawLeftWall(x: number, y: number, size: number, columns: number, rows: number) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + size / rows);
        context.stroke();
    }

    highlight(columns) {
        let x =  (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;
     
        context.fillStyle = "purple";
        context.fillRect(
            x, 
            y, 
            this.parentSize / columns - 3, 
            this.parentSize / columns - 3
        );
    }

    removeWalls(cell1, cell2) {
        let x = cell1.colNum - cell2.colNum;

        if (x == 1 ) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        let y = cell1.rowNum - cell2.rowNum;

        if (y == 1 ) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    show(size: number, rows: number, columns: number) {
        let x  = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;

        context.strokeStyle = "white";
        context.fillStyle = "black";
        context.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows); 
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows); 
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows); 
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows); 

        if (this.visited) {
            context.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    }
}

let emaze = new Maze(1000, 55, 55);
emaze.setup();
emaze.draw();