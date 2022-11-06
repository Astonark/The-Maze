class Maze {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private size: number;
    private rows: number;
    private columns: number;
    private grid: any = [];
    private stack: Array<number>;
    private current: Array<number>;

    constructor(size: number, rows: number, columns: number) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
    }

    public setup() {
        for(let r = 0; r < this.rows; r++) {
            let row:Cell[] = [];
            for(let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        this.current = this.grid[0][0];
    }
}

class Cell {
    private rowNum: number;
    private colNum: number;
    private parentSize: number;
    private parentGrid: number;
    private visited: false;
    private row: number;
    private walls: Object = {
        topWall: true,
        rightWall: true,
        bottomWall: true,
        leftWall: true
    };

    constructor(rowNum: number, colNum: number, parentGrid: number, parentSize: number) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
    }
}

let emaze = new Maze(500, 10, 10);
emaze.setup();