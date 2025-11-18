import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function getSquareCoordinate(index) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return { row, col };
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    const squareLocation = getSquareCoordinate(i);
    onPlay(nextSquares, squareLocation);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `${winner}が勝利しました！`;
  } else {
    status = `次のプレイヤー: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  function handlePlay(nextSquares, squareLocation) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location: squareLocation }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  } 
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((step, move) => {
    const locationLabel = step.location ? `(${step.location.row}, ${step.location.col})` : '';
    const description = move > 0 ? `${move}つめの手番${locationLabel ? ` ${locationLabel}` : ''}` : 'ゲームの最初';
    const isCurrent = move === currentMove;
    let content;
    if(isCurrent) {
      content = <div>{description}</div>;
    } else {
      content = <div><button onClick={() => jumpTo(move)}>{description}</button>に移動</div>;
    }
    return (
      <li key={move}>{content}</li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
