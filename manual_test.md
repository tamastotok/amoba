# 🎮 Manual Test Plan – AI Tic-Tac-Toe Game

---

## 🏠 Main Menu

- [ ] The main menu displays all options:  
      **Local**, **Online vs Human**, **Online vs AI**, **AI Dashboard**
- [ ] Clicking each button navigates to the correct menu.
- [ ] The “Back” button on each submenu returns to the main menu.

---

## 👥 Local Game Menu

- [ ] Player X and Player O name inputs accept any string (optional fields).
  - [ ] Leaving both empty still starts a valid game.
- [ ] “Who starts?” radio buttons work correctly (`X` or `O`).
  - [ ] Default is `X`.
- [ ] Board size radio buttons set 8×8, 10×10, 12×12 correctly.
  - [ ] Default is 8×8.
- [ ] Pressing “Start Game” loads the board with the selected size.

### Gameplay checks

- [ ] The starting player’s board is active.
- [ ] Turns alternate correctly between X and O.
- [ ] The winner is displayed when 5 in a row is reached.
- [ ] “Draw” message appears if the board fills up.
- [ ] “Restart” button resets the board to empty.
- [ ] “Leave” button returns to main menu and clears game state.

---

## 🌐 Online vs Human Menu

- [ ] The “Your name” field is optional.
- [ ] Player mark selection (`X` or `O`) works correctly. Default is `X`.
- [ ] “Who starts?” radio buttons correctly define starting player.
- [ ] Board size (8×8 / 10×10 / 12×12) selection works.
- [ ] Clicking “Create Game”:
  - [ ] Creates or joins a room with matching settings.
  - [ ] Displays “Searching for opponent…” message.

### Gameplay checks

- [ ] Once opponent found:
  - [ ] The game board loads for both players.
  - [ ] Each player can see the other’s moves in real time.
  - [ ] The correct player starts (based on menu selection).
- [ ] Winner is displayed on both screens.
- [ ] “Restart” starts a new round in the same room.
- [ ] If one player leaves:
  - [ ] The other sees an “Opponent left the game” message.
- [ ] “Leave” returns to main menu and resets state.

---

## 🤖 Online vs AI Menu

- [ ] The “Your name” field is optional.
- [ ] Player mark selection (`X` or `O`) works correctly.
- [ ] “Who starts?” radio buttons correctly determine who moves first.
- [ ] Board size (8×8 / 10×10 / 12×12) selection works.
- [ ] Difficulty dropdown:
  - [ ] **Easy** → uses random/simple AI
  - [ ] **Medium** → uses heuristic AI
  - [ ] **Hard** → uses learning AI
- [ ] “Start Game” creates an AI match.

### Gameplay checks

- [ ] If player starts, AI responds 0.8–1.3s delay after move.
- [ ] AI moves alternate with player correctly.
- [ ] Restart button resets the board and alternates the starting player (loser starts next).
- [ ] “Leave” returns to main menu and clears room data.
- [ ] No server crash or hang after AI match ends.

---

## 🧠 AI Dashboard

- [ ] When clicking “AI Dashboard” from main menu:
  - [ ] A password input popup appears.
  - [ ] Correct password allows access; wrong one shows an error message.
- [ ] Once inside:
  - [ ] Current AI generation number is displayed.
  - [ ] Average win rate statistic visible.
  - [ ] Chart updates in real time when new generations evolve.
  - [ ] The “Last updated” timestamp changes on new data.
- [ ] If connection to server drops:
  - [ ] The dashboard shows a reconnection or error message.

---

## ⚙️ Global Checks

- [ ] “Leave” button works in every game mode (returns to main menu, clears Redux).
- [ ] “Restart” button resets board without reloading the page.
- [ ] No console errors appear during normal gameplay.
- [ ] All socket events log properly in server console.
- [ ] Database clears old rooms automatically after timeout (TTL works).

---

## 🧩 Optional Visual/UI

- [ ] Blue border when it’s X’s turn, red border when it’s O’s.
- [ ] The “Next: You / Opponent” text updates correctly.
- [ ] When game ends, buttons (“Restart”, “Leave”) appear visibly centered.

---

## ✅ Test Outcome Summary

| Category       | Status       | Notes |
| -------------- | ------------ | ----- |
| Local Game     | ☐ OK / ☐ Bug |       |
| Online Human   | ☐ OK / ☐ Bug |       |
| Online AI      | ☐ OK / ☐ Bug |       |
| AI Dashboard   | ☐ OK / ☐ Bug |       |
| UI/Performance | ☐ OK / ☐ Bug |       |

---

### 💡 Testing Recommendations

- Test **online modes** in two separate browser tabs (or Chrome + Edge).
- Keep the browser **Console** and **Network** tabs open.
- For each bug found, record the console log and note it in the table above.
