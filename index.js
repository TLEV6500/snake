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

  hideObject() {
    this.HTMLElement.classList.remove(this.objectType);
  }

  showObject() {
    if (this.HTMLElement.className.includes(this.objectType)) return;
    this.HTMLElement.classList.add(this.objectType);
  }

	updateHTMLElement(x, y) {
		this.hideObject();
		this.HTMLElement = gridArr[y][x];
		this.showObject();
	}
}

class Snake extends GameObject {
	constructor(startPos) {
		super("snake", startPos);
		this.curPos = this.startPos;
		this.followingNode = null;
	}

  prevPos = this.startPos;

  setFollowingNode(node) {
    this.followingNode = node;
  }

	updatePos(x, y) {
		if (x < 0 || y < 0 || x >= width || y >= height) {
			console.log(`Snake tried going out of bounds: ${{ x, y }}`);
			return;
		}
    this.prevPos = this.curPos;
		this.curPos = { x, y };
		super.updateHTMLElement(x, y);
    if (this.followingNode) this.followingNode.updatePos(this.prevPos.x,this.prevPos.y);
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
    this.nodeHead.lastNode = this.nodeToFollow;
    this.nodeToFollow.setFollowingNode = null;
  }
}

class SnakeHead extends Snake {
  constructor(startPos = { x: 0, y: 0 }) {
    super(startPos);
    this.lastNode = this;
    this.length = 1;
  }
  
	increaseLength(l = 1) {
		this.length += l;
    this.lastNode = new SnakeBody(this.lastNode, this);
	}

  decreaseLength(l = 1) {
    this.length -= l;
    // Add more code
    this.lastNode.hideObject();
    this.lastNode = this.lastNode.nodeToFollow
    this.lastNode.setFollowingNode(null);
  }
}

// Creates Snake in HTML
const snake = new SnakeHead();

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
  let newX, newY;
	switch (event.key) {
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
    default: return;
	}
  snake.updatePos(newX, newY);
});
