const socket = io("https://real-time-chess-game-7o0n.onrender.com");

const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// const renderBoard = ()=>{
//     const board = chess.board();

//     boradElement.innerHTML=""

//     board.forEach((row, rowindex)=>{
//         row.forEach((square, squareindex)=> {
//             const squareElement = document.createElement("div");
//             squareElement.classList.add(
//                 "square", 
//                 (rowindex + squareindex) %2 === 0 ? "light": "dark"
//             );

//             squareElement.dataset.row= rowindex;
//             squareElement.dataset.col= squareindex;

//             if(square){
//                 const pieceElement = document.createElement("div");
//                 pieceElement.classList.add(
//                     "piece",
//                     square.color === "w" ? "white" : "black"
//                 );

//                 pieceElement.innerText=getPieceUnicode(square);
//                 pieceElement.draggable = playerRole === square.color;

//                 pieceElement.addEventListener("dragstart", (e)=>{
//                     if(pieceElement.draggable){
//                         draggedPiece=pieceElement;
//                         sourceSquare = {row : rowindex, col : squareindex}
//                         e.dataTransfer.setData("text/plain" , "")
//                     }
//                 });

//                 pieceElement.addEventListener("dragend", (e)=>{
//                     draggedPiece=null;
//                     sourceSquare=null;
//                 });

//                 squareElement.appendChild(pieceElement);
//             }

//             squareElement.addEventListener("dragover", (e)=>{
//                 e.preventDefault();
//             });

//             squareElement.addEventListener("drop", (e)=>{
//                 e.preventDefault();
//                 if(draggedPiece){
//                     const targetSource={
//                         row : parseInt(squareElement.dataset.row),
//                         col : parseInt(squareElement.dataset.col)
//                     };

//                     handleMove(draggedPiece, targetSource);
//                 }
//             })
//             boradElement.appendChild(squareElement)
            
//         })
        
//     })

//     if(playerRole === "b"){
//         boradElement.classList.add("flipped")
//     }else{
//         boradElement.classList.remove("flipped")
//     }
// }

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = ""; // Corrected typo

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );

                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };

                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
};

const handleMove = (source, target) => {
    console.log("Source:", source);
    console.log("Target:", target);
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };

    console.log(move);

    socket.emit("move", move);
};


const getPieceUnicode = (piece)=>{
    const unicodePiece ={
        'k': '♔', // White King
        'q': '♕', // White Queen
        'r': '♖', // White Rook
        'b': '♗', // White Bishop
        'n': '♘', // White Knight
        'p': '♙', // White Pawn
        'K': '♚', // Black King
        'Q': '♛', // Black Queen
        'R': '♜', // Black Rook
        'B': '♝', // Black Bishop
        'N': '♞', // Black Knight
        'P': '♟'  // Black Pawn
    }
    return unicodePiece[piece.type] || "";
}

socket.on("playerRole", function(role){
    playerRole= role;
    renderBoard();
})

socket.on("spectatorRole", function(){
    spectatorRole=null;
    renderBoard();
})

socket.on("boardState", function(fen){
    chess.load(fen);
    renderBoard();
})

socket.on("move", function(move){
    chess.move(move);
    renderBoard();
})


renderBoard();
