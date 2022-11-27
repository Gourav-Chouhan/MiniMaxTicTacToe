// let board = [];
if ("serviceWorker" in navigator) {
	window.addEventListener("load", function () {
		navigator.serviceWorker
			.register("/serviceWorker.js")
			.then((res) => console.log("service worker registered"))
			.catch((err) => console.log("service worker not registered", err));
	});
}
let board = [
	["X", " ", " "],
	[" ", " ", " "],
	[" ", "O", " "],
];
let xTurn = true;
let gameOver = false;
let w;
let statusMessage = "X's turn";
class TTTGame {
	constructor() {
		for (let i = 0; i < 3; i++) {
			board[i] = [];
			for (let j = 0; j < 3; j++) {
				board[i][j] = " ";
			}
		}
		if (Math.random() < 0.5) {
			this.aiMove();
		}
	}

	drawXO(val, x, y) {
		stroke(233);
		let r = w / 4;
		strokeWeight(20);
		if (val == "O") {
			noFill();
			circle(x, y, r);
		} else if (val == "X") {
			r = r / 2.2;
			line(x - r, y - r, x + r, y + r);
			line(x + r, y - r, x - r, y + r);
		}
	}

	drawBoard() {
		stroke(0);
		fill(255);
		for (let i = 0; i < 3; i++) {
			let y = (w / 3) * i + w / 6;
			for (let j = 0; j < 3; j++) {
				let x = (w / 3) * j + w / 6;
				this.drawXO(board[i][j], x, y);
			}
		}
		strokeWeight(2);
		line(0, w / 3, w, w / 3);
		line(0, (2 * w) / 3, w, (2 * w) / 3);
		line(w / 3, 0, w / 3, w);
		line((2 * w) / 3, 0, (2 * w) / 3, w);

		if (!gameOver) {
			if (xTurn) {
				statusMessage = "X's Turn";
			} else {
				statusMessage = "O's Turn";
			}
		}

		document.getElementById("turnInfo").textContent = statusMessage;
	}

	checkWin() {
		for (let j = 0; j < 3; j++) {
			let res = "";
			for (let i = 0; i < 3; i++) {
				res += board[j][i];
			}
			if (res == "XXX") return 1;
			else if (res == "OOO") return -1;
			res = "";
			for (let i = 0; i < 3; i++) {
				res += board[i][j];
			}
			if (res == "XXX") return 1;
			else if (res == "OOO") return -1;
		}
		let s1 = "",
			s2 = "";
		for (let i = 0; i < 3; i++) {
			s1 += board[i][i];
			s2 += board[2 - i][i];
			if (s1 == "XXX" || s2 == "XXX") return 1;
			if (s1 == "OOO" || s2 == "OOO") return -1;
		}
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == " ") return Infinity;
			}
		}
		return 0;
	}

	miniMax(isMaximaizing, depth) {
		if (this.checkWin() != Infinity) return this.checkWin();
		let availableMoves = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == " ") availableMoves.push({ x: j, y: i });
			}
		}
		let toPut = isMaximaizing ? "X" : "O";
		let ret = isMaximaizing ? -Infinity : Infinity;
		for (let { x, y } of availableMoves) {
			board[y][x] = toPut;
			let optimalScore = this.miniMax(!isMaximaizing, depth + 1);
			if (isMaximaizing) ret = max(ret, optimalScore);
			else ret = min(ret, optimalScore);
			board[y][x] = " ";
		}
		// return Infinity;

		return ret == Infinity ? ret : ret / depth;
	}

	aiMove() {
		let availableMoves = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == " ") availableMoves.push({ x: j, y: i });
			}
		}
		if (availableMoves.length == 0) {
			return;
		}
		let minScore = xTurn ? -Infinity : Infinity;
		let toPut = xTurn ? "X" : "O";
		let bestMove = availableMoves[0];
		for (let { x, y } of availableMoves) {
			board[y][x] = toPut;
			let getScore = this.miniMax(!xTurn, 1);
			if (xTurn) {
				if (getScore > minScore) {
					minScore = getScore;
					bestMove = { x, y };
				}
			} else {
				if (getScore < minScore) {
					minScore = getScore;
					bestMove = { x, y };
				}
			}
			board[y][x] = " ";
		}

		board[bestMove.y][bestMove.x] = toPut;
		xTurn = !xTurn;
	}

	markPath() {
		strokeWeight(30);
		stroke("rgba(255, 10, 0, 0.9)");
		for (let j = 0; j < 3; j++) {
			let res = "";
			for (let i = 0; i < 3; i++) {
				res += board[j][i];
			}
			if (res == "XXX" || res == "OOO") {
				line(w / 8, j * (w / 3) + w / 6, w - w / 8, (j * w) / 3 + w / 6);
				return;
			}
			res = "";
			for (let i = 0; i < 3; i++) {
				res += board[i][j];
			}
			if (res == "XXX" || res == "OOO") {
				line((j * w) / 3 + w / 6, w / 8, (j * w) / 3 + w / 6, w - w / 8);
				return;
			}
		}
		let s1 = "",
			s2 = "";
		for (let i = 0; i < 3; i++) {
			s1 += board[i][i];
			s2 += board[2 - i][i];
			if (s1 == "XXX" || s1 == "OOO") {
				line(w / 8, w / 8, w - w / 8, w - w / 8);
				return;
			}
			if (s2 == "OOO" || s2 == "XXX") {
				line(w - w / 8, w / 8, w / 8, w - w / 8);
				return;
			}
		}
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == " ") return Infinity;
			}
		}
		return 0;
	}
}

let game, canvas;

function setup() {
	let tempWidth = 700;
	if (detectMob()) {
		tempWidth = window.innerWidth;
	}
	canvas = createCanvas(tempWidth, tempWidth);
	w = width;
	game = new TTTGame();
	// game.aiMove();
}

function mousePressed(e) {
	if (e.target.className != "p5Canvas") return;
	if (gameOver) return;
	let x = parseInt(mouseX / (w / 3));
	let y = parseInt(mouseY / (w / 3));
	let toPut = xTurn ? "X" : "O";

	if (board[y][x] == " ") {
		xTurn = !xTurn;
		board[y][x] = toPut;
		game.aiMove();
	}
}

function draw() {
	clear();
	game.drawBoard();
	let gameScore = game.checkWin();
	if (gameScore != Infinity) {
		if (gameScore == 0) {
			statusMessage = "Draw";
		} else if (gameScore < 0) {
			statusMessage = "O won!";
		} else {
			statusMessage = "X won!";
		}
		gameOver = true;
		game.markPath();
	}
}

let newGame = () => {
	xTurn = true;
	game = new TTTGame();
	gameOver = false;
};

function detectMob() {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i,
	];

	return toMatch.some((toMatchItem) => {
		return navigator.userAgent.match(toMatchItem);
	});
}

// if (detectMob()) {
// 	alert("you are on mobile");
// }
