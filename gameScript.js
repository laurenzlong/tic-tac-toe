var board = [];
var currentPlayer = "X"; 
var totalRows = 3;
var totalCols = 3;
var lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]; // all the possible lines
var winner = null;
var totalMoves = 0; //total number of moves made this game

$( document ).ready(function() {
    var boardElem = document.getElementById('board');
	boardElem.addEventListener("click", boardClicked, false);
	initBoard();
});

function initBoard(){
	var i, j;
	for (i=1; i<=totalRows; i++){
		$('tbody').append('<tr></tr>');
		for (j=1; j<=totalCols; j++){
			board[index(i,j)] = null;
			$('tbody tr:nth-child('+i+')').append('<td><div class="square"></div></td>');
		}
	}
	$('#hint-text').text('Current Turn Belongs To: '+currentPlayer);
	return 0;
}

function boardClicked(e){
	var x = e.clientX;
    var y = e.clientY;

    var elementClicked = document.elementFromPoint(x, y);
    var index = $('.square').index(elementClicked);

    //console.log('clicked on index: ', index)

    if (board[index]!= null){
    	console.log('there is already a piece there')
    }
    else{
    	makeMove(index);
    	if (winner==null){
    		var move = getComputerMove(board);
    		console.log('computer moved here:', move)
    		makeMove(move);
    	}
    }
}

function makeMove(index){

	board[index]=currentPlayer;
	updateBoardPic();
	totalMoves++;
	checkGameOver();
	if (winner==null){
		currentPlayer = getOtherPlayer(currentPlayer);
		$('#hint-text').text('Current Turn Belongs To: '+currentPlayer);
	} 
	else if (winner=="neither"){
		$('#hint-text').text('Game Over. It is a draw');
	}
	else{
		$('#hint-text').text('The Winner Is: '+winner);
	}

}

function applyMove(board, index, player){
	var boardCopy = board.slice();
	boardCopy[index] = player;
	return boardCopy;
}

var emptyBoard =  [null, null, null, null, null, null, null, null, null]
function playComputerAgainstComputer(){
	var me = 'X';
	var board = emptyBoard;
	var movesCounter = 0;
	while(getWinner(board)===null && movesCounter < 9 ){
		var move = getComputerMove(board, me);
		board = applyMove(board, move, me);
		console.log(printBoard(board))
		me = getOtherPlayer(me);
		movesCounter++;
	}
	return board;
}

function getComputerMove(board, me){
	var possibleMoves = getPossibleMoves(board);
	var maxScore = -1;
	var maxMove = null;
	for (var i=0; i<possibleMoves.length; i++){
		var score = scoreMove(board, possibleMoves[i], me, me) ;
		console.log("for", possibleMoves[i], score)
		//console.log(score)
		if (score > maxScore){
			maxScore = score;
			maxMove = possibleMoves[i];
		}
	}

	return maxMove;
	//var rand = Math.random();

	//var moveIndex = Math.floor((possibleMoves.length*rand));
	//console.log('moveIndex = ', moveIndex)
	//return possibleMoves[moveIndex];
}

function scoreMove (board, move, player, me){
	board = applyMove(board, move, player);
	var winner = getWinner(board);
	if (winner === getOtherPlayer(me)){
		return 0;
	} else if (winner === me){
		return 100;
	} else{
		var possibleMoves = getPossibleMoves(board);
		if (possibleMoves.length === 0){
			return 50;
		}
		var otherPlayer = getOtherPlayer(player);
		var scores = possibleMoves.map(function(move){
			return scoreMove(board, move, otherPlayer, me);
		});
		if (player === me)
			return Math.max.apply(null, scores);
		else
			return Math.min.apply(null, scores);
	}
}

function getPossibleMoves (board) {
	var possibleMoves = [];
	for (var i=0; i<board.length; i++){
		if (board[i]==null){
			possibleMoves.push(i);
		}
	}
	return possibleMoves;
}

function checkGameOver(){
	if (totalMoves==9)
		winner = "neither";
	winner = getWinner(board);
}

function getWinner(board){
	for (var i=0; i<lines.length; i++){
		var pos1 = (lines[i])[0];
		var pos2 = (lines[i])[1];
		var pos3 = (lines[i])[2];
		if (board[pos1]!=null){
			if ((board[pos1]==board[pos2]) && (board[pos2]==board[pos3])){
				return board[pos1];
			}
		}
	}
	return null;
}

function getOtherPlayer(currentPlayer){
	if (currentPlayer == 'X')
		return 'O';
	else 
		return 'X';
}

function index(row,col){
	// gives index of element in board array, based on row and col numbers
	if (row<1)
		return null;
	if (col<1)
		return null;
	var arrayIndex = (row-1)*totalRows+col-1;
	return arrayIndex;
}

function updateBoardPic(){
	for (var i=1; i<=totalRows; i++){
		for (var j=1; j<=totalCols; j++){
			if (board[index(i,j)]=="X"){
				$('tbody tr:nth-child('+i+') :nth-child('+j+') :nth-child(1)').html('<div class="XnO">X</div>');
			}
			if (board[index(i,j)]=="O"){
				$('tbody tr:nth-child('+i+') :nth-child('+j+') :nth-child(1)').html('<div class="XnO">O</div>');
			}
		}
	}
	return 0;
}

function printBoard(board) {
	var result = ""
	for (var i = 1; i <= 3; i++) {
		for (var j = 1; j <= 3; j++)
          result += board[index(i,j)] || " "
      result += "\n"
  }
  return result
}
