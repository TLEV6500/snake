let gridArr = [];
const gridElement = document.querySelector(".grid");

// Creates Grid in HTML
const { height, width } = initializeGrid(6, 6);

function getRandomLocation(maxHeight = height, maxWidth = width) {
	let location = {};
	location.x = Math.floor(Math.random() * maxWidth);
	location.y = Math.floor(Math.random() * maxHeight);
	return location;
}

class GameObject {
	constructor(objectType = [], startPos) {
		this.startPos = startPos;
		this.curPos = startPos;
		this.prevPos = startPos;
		this.HTMLElement = gridArr[this.startPos.y][this.startPos.x];
		this.HTMLElement.classList.add(...objectType);
		this.objectType = objectType;
	}

	hideObject() {
		this.HTMLElement.classList.remove(...this.objectType);
	}

	showObject() {
		this.HTMLElement.classList.add(...this.objectType);
	}

	updateHTMLElement(x, y) {
		this.hideObject();
		this.HTMLElement = gridArr[y][x];
		this.showObject();
	}

	isPosOccupied(pos, obj) {
		let bool = false;
		if (pos.x === obj.curPos.x && pos.y === obj.curPos.y) return true;
		if (Object.hasOwn(obj,"followingNode")) {
			if (obj.followingNode === null) return false;
			bool = this.isPosOccupied(pos, obj.followingNode);
		}
		return bool;
	}

	getRandFreeLoc(...objs) {
		if (objs.length === 0) objs.push(this);
		let randPos;
		for (const obj of objs) {
			while (randPos = getRandomLocation(),this.isPosOccupied(randPos, obj));
		}
		return randPos;
	}

	updatePos(x, y) {
		if (x < 0 || y < 0 || x >= width || y >= height) {
			console.log(`${this.objectType} tried going out of bounds: ${{ x, y }}`);
			return;
		}
		this.prevPos = this.curPos;
		this.curPos = { x, y };
		this.updateHTMLElement(x, y);
		if (Object.hasOwn(this,"followingNode") && this.followingNode)
			this.followingNode.updatePos(this.prevPos.x, this.prevPos.y);
	}
}

class Snake extends GameObject {
	constructor(startPos, typeMods = []) {
		super(["snake", ...typeMods], startPos);
		this.followingNode = null;
	}

	setFollowingNode(node) {
		this.followingNode = node;
	}
}

class SnakeBody extends Snake {
	constructor(nodeToFollow, nodeHead) {
		super(nodeToFollow.prevPos);
		this.nodeToFollow = nodeToFollow;
		this.nodeHead = nodeHead;
		this.nodeToFollow.setFollowingNode(this);
	}
	destroyThis() {
		if (this.followingNode) return;
		this.hideObject();
		this.nodeHead.lastNode = this.nodeToFollow;
		this.nodeToFollow.setFollowingNode = null;
	}
}

class SnakeHead extends Snake {
	constructor(startPos = { x: 0, y: 0 }) {
		super(startPos, ["head"]);
		this.lastNode = this;
		this.length = 1;
	}

	increaseLength(l = 1) {
		this.length += l;
		this.lastNode = new SnakeBody(this.lastNode, this);
	}

	decreaseLength(l = 1) {
		this.length -= l;
		this.lastNode.destroyThis();
	}

	eats(food) {
		food.timesEaten++;
		this.increaseLength();
		food.respawn(this.getRandFreeLoc(this));
	}

	moves(key) {
		let curX = this.curPos.x;
		let curY = this.curPos.y;
		let newX, newY;
		switch (key) {
			case "ArrowUp":
				newX = curX;
				newY = --curY;
				break;
			case "ArrowRight":
				newX = ++curX;
				newY = curY;
				break;
			case "ArrowDown":
				newX = curX;
				newY = ++curY;
				break;
			case "ArrowLeft":
				newX = --curX;
				newY = curY;
				break;
			default:
				return false;
		}
		this.updatePos(newX, newY);
		return true;
	}
}

class SnakeFood extends GameObject {
	constructor(startPos, typeMods = []) {
		super(["food", ...typeMods], startPos);
		this.timesEaten = 0;
	}

	respawn({x, y}) {
		this.updatePos(x, y);
	}
}

// Creates Snake in HTML
const snake = new SnakeHead();
// Creates Food in HTML
const food = new SnakeFood(snake.getRandFreeLoc());

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
	let moved = snake.moves(event.key);
	if (moved && snake.isPosOccupied(snake.curPos, food)) snake.eats(food);
});	

