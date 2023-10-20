let gridArr = [];
const gridElement = document.querySelector(".grid");

// Creates Grid in HTML
const { height, width } = initializeGrid(6, 6);

class GameObject {
	constructor(objectType = "", startPos = { x: width - 1, y: height - 1 }) {
		this.startPos = startPos;
		this.HTMLElement = gridArr[this.startPos.y][this.startPos.x];
		this.HTMLElement.classList.add(objectType);
		this.objectType = objectType;
		// console.log(`GameObject ${this.objectType} Created at (${this.startPos.x}, ${this.startPos.y})`);
	}

	updateHTMLElement(x, y) {
		this.HTMLElement.classList.remove(this.objectType);
		this.HTMLElement = gridArr[y][x];
		this.HTMLElement.classList.add(this.objectType);
	}
}

class Snake extends GameObject {
	constructor(startPos = { x: 0, y: 0 }) {
		super("snake", startPos);
		this.curPos = this.startPos;
		this.length = 1;
		// console.log(this);
	}

	increaseLength(l = 1) {
		this.length += l;
		// Add more code
	}

	updatePos(x, y) {
		if (x < 0 || y < 0 || x >= width || y >= height) {
			console.log(`Snake tried going out of bounds: ${{ x, y }}`);
			return;
		}
		this.curPos = { x, y };
		super.updateHTMLElement(x, y);
	}
}

// Creates Snake in HTML
const snake = new Snake();

function initializeGrid(height, width) {
	let cell;
	let area = height * width;
	let gridRow = [];
	for (let i = 0; i < area; ++i) {
		cell = document.createElement("div");
		cell.className = "grid-cell";
		gridElement.appendChild(cell);
		gridRow.push(cell);
		if ((i + 1) % width === 0) {
			gridArr.push(gridRow);
			gridRow = [];
		}
	}
	return { height, width };
}

gridElement.addEventListener("keydown", (event) => {
	// console.log(event.key);
	let curX = snake.curPos.x;
	let curY = snake.curPos.y;
	switch (event.key) {
		case "ArrowUp":
			snake.updatePos(curX, --curY);
			break;
		case "ArrowRight":
			snake.updatePos(++curX, curY);
			break;
		case "ArrowDown":
			snake.updatePos(curX, ++curY);
			break;
		case "ArrowLeft":
			snake.updatePos(--curX, curY);
			break;
	}
});
