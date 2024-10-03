/* eslint-disable react/prop-types */
import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, winnerInfo }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onSquareClick={() => onSquareClick(i)}
      highlight={winnerInfo.line && winnerInfo.line.includes(i)}
    />
  );

  const board = [];
  for (let row = 0; row < 3; row++) {
    const boardRow = [];
    for (let col = 0; col < 3; col++) {
      boardRow.push(renderSquare(row * 3 + col));
    }
    board.push(
      <div key={row} className="board-row">
        {boardRow}
      </div>
    );
  }

  return <>{board}</>;
}

export default function App() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const winnerInfo = calculateWinner(currentSquares);

  function handleSquareClick(i) {
    if (winnerInfo.winner || currentSquares[i]) return;

    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    const nextHistory = history.slice(0, currentMove + 1);
    setHistory([...nextHistory, { squares: nextSquares, location: getLocation(i) }]);
    setCurrentMove(nextHistory.length);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  function resetGame() {
    setHistory([{ squares: Array(9).fill(null), location: null }]);
    setCurrentMove(0);
    setIsAscending(true);
  }

  const sortedHistory = isAscending ? history : [...history].reverse();
  const moves = sortedHistory.map((step, moveIndex) => {
    const move = isAscending ? moveIndex : history.length - 1 - moveIndex;
    const description = move
      ? `Go to move #${move} (${step.location.row}, ${step.location.col})`
      : 'Go to game start';

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const status = winnerInfo.winner
    ? 'Winner: ' + winnerInfo.winner
    : currentSquares.every(Boolean)
    ? 'Game Draw!'
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <div className="game-container">
      <div className="game-board">
        <Board squares={currentSquares} onSquareClick={handleSquareClick} winnerInfo={winnerInfo} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Sort by Descending' : 'Sort by Ascending'}
        </button>
        <ol start="0">{moves}</ol>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}

function getLocation(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return { row, col };
}
