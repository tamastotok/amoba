# Manual Test Plan – Gomoku

## Main Menu

- ✅ The main menu displays all options:  
   **Local**, **Online vs Human**, **Online vs AI**, **AI Dashboard**
- ✅ Buttons are styled consistently and centered.
- ✅ Disabled state visible when backend is offline (Online buttons greyed out).
- ✅ Clicking each button navigates to the correct route.
- ✅ “Back” buttons on submenus always return to Main Menu.

## Local Game

### Setup

- ✅ Optional name inputs for both players work (can be empty).
- ✅ “Who starts?” selector works — defaults to **X**.
- ✅ Board size (8×8 / 10×10 / 12×12) changes grid properly.
- ✅ Clicking “Start Game” loads the board.

### Gameplay

- ✅ Player names are shown or "Player X vs. Player O"
- ✅ Board interaction works — X and O alternate correctly.
- ✅ Winner is detected at 5 in a row.
- ✅ “Draw!” appears when board fills with no winner.
- ✅ `EndGameActions` popup appears centered with **Play again** and **Leave**.
- ✅ **Scroll lock** works — background cannot scroll during popup.
- ✅ “Restart” resets the board cleanly.
- ✅ “Leave” returns to main menu and clears Redux + localStorage.
- ✅ Board stays the same after reloading the page

## Online vs Human

### Matchmaking

- ✅ Optional name field works.
- ✅ Player mark (`X` / `O`) selection works, default **X**.
- ✅ Who starts first selection works, default **X**.
- ✅ Board size selector works.
- ✅ Clicking “Create Game” shows **Searching for opponent...** overlay.
- ✅ Cancel search works both via **ESC** key and **Cancel** button (mobile).
- ✅ When a second player joins:
  - ✅ Both boards load instantly.
  - ✅ Socket IDs sync — same room confirmed in backend logs.

### Gameplay

- ✅ Both clients see each other’s moves in real time.
- ✅ Turn order follows “Who starts?” selection.
- ✅ Winner and “Draw” states sync on both clients.
- ✅ “Play again” redirects to '/online'.
- ✅ If one player leaves:
  - ✅ The other gets “Opponent left the game” message / popup.
- ✅ “Leave” returns both players to main menu safely.
- ✅ No ghost sockets remain on server (check console).
- ✅ Chat section:
  - ✅ Player names are shown or "Player X, Player O
  - ✅ Messages can be sent in real time.
- ✅ Board stays the same after reloading the page
- ❌ Chat stays the same after reloading the page

## Online vs AI

### Setup

- ✅ Optional player name works.
- ✅ Mark (`X` / `O`) selection radio function correctly.
- ✅ Who starts first selection works, default **X**.
- ✅ Board size options work.
- ✅ Difficulty dropdown sets AI type:
  - ✅ **Easy** → simple random AI
  - ✅ **Medium** → heuristic AI
  - ✅ **Hard** → genetic (learning) AI

### Gameplay

- ✅ If player starts, AI moves ~0.8–1.2 s later.
- ✅ AI moves alternate correctly with player.
- ❔ **Hard mode** learns over generations (confirmed by dashboard).
- ❔ “Draw” message works, consistent with local mode.
- ✅ “Leave” returns to main menu, socket session cleared.
- ✅ No server crash after match end.

## AI Dashboard

### Functionality

- ❌ Chart loads past generations via `GET /api/ai/progress`.
- ❔ Data formatted (generation, avg/best/worst fitness, winRate).
- ❔ Real-time updates received through `ai-generation-update` socket event.
- ❔ Slider filters visible range correctly.
- ❔ Manual range input fields update chart.
- ✅ “Back to Main Menu” works.
- ❔ If backend unavailable, error logged gracefully.

## Backend & Socket Tests

- ✅ `Connected to database!` appears on backend start.
- ✅ `/api/ai/progress` returns valid JSON (not HTML).
- ✅ Socket events handled correctly:
  - ✅ `search-game`
  - ✅ `cancel-search`
  - ✅ `game-end`
  - ✅ `player-left`
  - ✅ `ai-generation-update`
- ✅ Cancelling matchmaking correctly emits `cancel-search`.
- ✅ `disconnect` and `reconnect` logs behave as expected.

## Mobile Responsiveness

- ☐ Main menu buttons display stacked and centered.
- ☐ GameOverlay “Cancel Search” button visible and tappable.
- ☐ EndGame popup centered, readable on small screens.
- ☐ No horizontal scrolling on any page.
- ☐ Body scroll disabled during popups (works on touch screens).

## UI / UX Consistency

- ✅ Blue border = X’s turn; Red = O’s turn.
- ✅ “Next: You / Opponent” updates correctly.
- ✅ Popup transitions (Framer Motion) animate smoothly.
- ✅ Fonts, button styles, and spacing consistent across screens.
- ✅ No visible flicker during route transitions.

## Test Summary

| Category          | Status        | Notes |
| ----------------- | ------------- | ----- |
| Local Game        | ✅ OK / ☐ Bug |       |
| Online Human      | ✅ OK / ☐ Bug |       |
| Online AI         | ✅ OK / ☐ Bug |       |
| AI Dashboard      | ✅ OK / ☐ Bug |       |
| Backend / Sockets | ✅ OK / ☐ Bug |       |
| UI / Performance  | ✅ OK / ☐ Bug |       |
| Mobile            | ☐ OK / ☐ Bug  |       |
