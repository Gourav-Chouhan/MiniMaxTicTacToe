// let board = [];
let board = [
	[" ", " ", " "],
	[" ", " ", " "],
	[" ", " ", " "],
];
let xTurn = true;
let w;


function setup() {
	createCanvas(700, 700);
	background(200);
	w = width;
}

function drawXO(val, x, y) {
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
function drawBoard() {
	for (let i = 0; i < 3; i++) {
		let y = (w / 3) * i + w / 6;
		for (let j = 0; j < 3; j++) {
			let x = (w / 3) * j + w / 6;
			drawXO(board[i][j], x, y);
		}
	}
	strokeWeight(2);
	line(0, w / 3, w, w / 3);
	line(0, (2 * w) / 3, w, (2 * w) / 3);
	line(w / 3, 0, w / 3, w);
	line((2 * w) / 3, 0, (2 * w) / 3, w);

	if (xTurn) {
		document.getElementById("turnInfo").textContent = "X's Turn";
	} else {
		document.getElementById("turnInfo").textContent = "O's Turn";
	}
	let res = checkWin(board);
	if (res == 1) console.log("X wins");
	else if (res == -1) console.log("O wins");
	else if (res == 0) console.log("Its a draw");
}

function clearCanvas() {
	background(255);
}

function mousePressed(e) {
	if (e.target.className != "p5Canvas") return;
	let x = parseInt(mouseX / (w / 3));
	let y = parseInt(mouseY / (w / 3));
	if (board[y][x] == " ") {
		board[y][x] = "X";
		xTurn = false;
		aiMove();
	}
}

function draw() {
	clearCanvas();
	drawBoard();
	if (false && !xTurn) {
		let availableMoves = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] == " ") availableMoves.push({ x: j, y: i });
			}
		}
		if (availableMoves.length == 0) {
			return;
		}
		let minScore = xTurn ? -2 : 2;
		let toPut = xTurn ? "X" : "O";
		let bestMove = availableMoves[0];
		for (let { x, y } of availableMoves) {
			board[y][x] = toPut;
			let getScore = miniMax(!xTurn);
			if (xTurn) {
				if (getScore >= minScore) {
					minScore = getScore;
					bestMove = { x, y };
				}
			} else {
				if (getScore <= minScore) {
					minScore = getScore;
					bestMove = { x, y };
				}
			}
			board[y][x] = " ";
		}
		console.log(minScore);
		board[bestMove.y][bestMove.x] = toPut;
		xTurn = !xTurn;
	}
}

function aiMove() {
	let availableMoves = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] == " ") availableMoves.push({ x: j, y: i });
		}
	}
	if (availableMoves.length == 0) {
		return;
	}
	let minScore = xTurn ? -2 : 2;
	let toPut = xTurn ? "X" : "O";
	let bestMove = availableMoves[0];
	for (let { x, y } of availableMoves) {
		board[y][x] = toPut;
		let getScore = miniMax(!xTurn);
		if (xTurn) {
			if (getScore >= minScore) {
				minScore = getScore;
				bestMove = { x, y };
			}
		} else {
			if (getScore <= minScore) {
				minScore = getScore;
				bestMove = { x, y };
			}
		}
		board[y][x] = " ";
	}
	board[bestMove.y][bestMove.x] = toPut;
	xTurn = !xTurn;
}

function miniMax(isMaximaizing) {
	if (checkWin() != 10) return checkWin();
	let availableMoves = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] == " ") availableMoves.push({ x: j, y: i });
		}
	}
	let toPut = isMaximaizing ? "X" : "O";
	let ret = isMaximaizing ? -10 : 10;
	for (let { x, y } of availableMoves) {
		board[y][x] = toPut;
		let optimalScore = miniMax(!isMaximaizing);
		if (isMaximaizing) ret = max(ret, optimalScore);
		else ret = min(ret, optimalScore);
		board[y][x] = " ";
	}
	return ret;
}

function checkWin() {
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
			if (board[i][j] == " ") return 10;
		}
	}
	return 0;
}
