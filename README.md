## Tic-tac-toe game

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description:

Tic-tac-toe game in a 8x8, 10x10 or 12x12 grid. Players may add their names and select what mark is going to be the first ("X" by default).

Next mark (X or O) and players name are shown.

The player who succeeds in placing five of their marks in a diagonal, horizontal, or vertical row is the winner.

When the game ends, players can restart the game. They will return to the "start page" where their names and the starter mark can be changed (names will be the same if previously added).

Tested in Chrome.

## Usage:

```
git clone "repository url"
cd "repository folder"
npm i
npm start
```

## Server:

Live server deployed on heroku. If it has any error, the code can be found here: [amoba-server](https://github.com/Yhunie-the-cat/amoba-server)

## How to calculate win:

With every click on the board, the game will check every square value around the clicked position in a 9\*9 field and put their values in a 2d array (let's call it matrix). If this field is out of the board, the game fill the matrix with 'null' values.

Next, the game will check patterns in the matrix (row, column, diagonal) and put these patterns into different arrays (9 values in each array).

Finally these arrays are checked from position 0 to 4. If all this position has the same value the game will end and the winner is shown. If not, the game will change the position +1 and check again (from 0-4, to 1-5).
