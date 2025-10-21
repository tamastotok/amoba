# 🎮 Manual Test Plan – Gomoku (AI & Online)

---

## 🏠 Main Menu

- [ ] The main menu displays all options:  
       **Local**, **Online vs Human**, **Online vs AI**, **AI Dashboard**
- [ ] Buttons are styled consistently and centered.
- [ ] Disabled state visible when backend is offline (Online buttons greyed out).
- [ ] Clicking each button navigates to the correct route.
- [ ] “Back” buttons on submenus always return to Main Menu.

---

## 👥 Local Game

### Setup

- [ ] Optional name inputs for both players work (can be empty).
- [ ] “Who starts?” selector works — defaults to **X**.
- [ ] Board size (8×8 / 10×10 / 12×12) changes grid properly.
- [ ] Clicking “Start Game” loads the board.

### Gameplay

- [ ] Board interaction works — X and O alternate correctly.
- [ ] Winner is detected at 5 in a row.
- [ ] “Draw!” appears when board fills with no winner.
- [ ] `EndGameActions` popup appears centered with **Restart** and **Leave**.
- [ ] **Scroll lock** works — background cannot scroll during popup.
- [ ] “Restart” resets the board cleanly.
- [ ] “Leave” returns to main menu and clears Redux + localStorage.

---

## 🌐 Online vs Human

### Matchmaking

- [ ] Optional name field works.
- [ ] Player mark (`X` / `O`) selection works, default **X**.
- [ ] Board size selector works.
- [ ] Clicking “Create Game” shows **Searching for opponent...** overlay.
- [ ] Cancel search works both via **ESC** key and **Cancel** button (mobile).
- [ ] When a second player joins:
  - [ ] Both boards load instantly.
  - [ ] Socket IDs sync — same room confirmed in backend logs.

### Gameplay

- [ ] Both clients see each other’s moves in real time.
- [ ] Turn order follows “Who starts?” selection.
- [ ] Winner and “Draw” states sync on both clients.
- [ ] “Restart” restarts game in same room.
- [ ] If one player leaves:
  - [ ] The other gets “Opponent left the game” message / popup.
- [ ] “Leave” returns both players to main menu safely.
- [ ] No ghost sockets remain on server (check console).

---

## 🤖 Online vs AI

### Setup

- [ ] Optional player name works.
- [ ] Mark (`X` / `O`) selection and “Who starts?” radio function correctly.
- [ ] Board size options work.
- [ ] Difficulty dropdown sets AI type:
  - [ ] **Easy** → simple random AI
  - [ ] **Medium** → heuristic AI
  - [ ] **Hard** → genetic (learning) AI

### Gameplay

- [ ] If player starts, AI moves ~0.8–1.2 s later.
- [ ] AI moves alternate correctly with player.
- [ ] **Hard mode** learns over generations (confirmed by dashboard).
- [ ] “Draw” message works, consistent with local mode.
- [ ] “Leave” returns to main menu, socket session cleared.
- [ ] No server crash after match end.

---

## 🧠 AI Dashboard (Admin Mode)

### Access Control

- [ ] Clicking “AI Dashboard” opens password popup.
- [ ] Wrong password → “Invalid admin password”.
- [ ] Correct password → navigates to `/ai-dashboard`.
- [ ] Direct navigation to `/ai-dashboard` without auth → redirected to `/admin-login`.

### Functionality

- [ ] Chart loads past generations via `GET /api/ai/progress`.
- [ ] Data formatted (generation, avg/best/worst fitness, winRate).
- [ ] Real-time updates received through `ai-generation-update` socket event.
- [ ] Slider filters visible range correctly.
- [ ] Manual range input fields update chart.
- [ ] “Back to Main Menu” works.
- [ ] If backend unavailable, error logged gracefully.

---

## ⚙️ Backend & Socket Tests

- [ ] `Connected to database!` appears on backend start.
- [ ] `/api/ai/progress` returns valid JSON (not HTML).
- [ ] No `Unexpected token '<'` errors in frontend console.
- [ ] Socket events handled correctly:
  - [ ] `search-game`
  - [ ] `cancel-search`
  - [ ] `game-end`
  - [ ] `player-left`
  - [ ] `ai-generation-update`
- [ ] Cancelling matchmaking correctly emits `cancel-search`.
- [ ] `disconnect` and `reconnect` logs behave as expected.

---

## 🔒 Admin & Security

- [ ] `.env` file contains:  
      `VITE_API_URL`, `ADMIN_PASSWORD`, `ORIGIN`, `URI`
- [ ] Backend reads `ADMIN_PASSWORD` from `.env`.
- [ ] CORS config allows frontend origin only.
- [ ] SessionStorage key `ai_dashboard_auth` set to `"true"` after login.
- [ ] No unauthorized dashboard access possible.

---

## 📱 Mobile Responsiveness

- [ ] Main menu buttons display stacked and centered.
- [ ] SearchOverlay “Cancel Search” button visible and tappable.
- [ ] EndGame popup centered, readable on small screens.
- [ ] No horizontal scrolling on any page.
- [ ] Body scroll disabled during popups (works on touch screens).

---

## 🧩 UI / UX Consistency

- [ ] Blue border = X’s turn; Red = O’s turn.
- [ ] “Next: You / Opponent” updates correctly.
- [ ] Popup transitions (Framer Motion) animate smoothly.
- [ ] Fonts, button styles, and spacing consistent across screens.
- [ ] No visible flicker during route transitions.

---

## 🧼 Stability & Cleanup

- [ ] No unhandled promise rejections in console.
- [ ] No `console.log` left in production build.
- [ ] AI Dashboard handles empty DB gracefully.
- [ ] Game reset removes any stale socket rooms.
- [ ] Build passes (`npm run build` successful).
- [ ] Backend start (`node index.js`) without errors.

---

## ✅ Test Outcome Summary

| Category          | Status       | Notes |
| ----------------- | ------------ | ----- |
| Local Game        | ☐ OK / ☐ Bug |       |
| Online Human      | ☐ OK / ☐ Bug |       |
| Online AI         | ☐ OK / ☐ Bug |       |
| AI Dashboard      | ☐ OK / ☐ Bug |       |
| Backend / Sockets | ☐ OK / ☐ Bug |       |
| UI / Performance  | ☐ OK / ☐ Bug |       |
| Mobile            | ☐ OK / ☐ Bug |       |

---

### 💡 Testing Tips

- For **online modes**, use two separate browsers or incognito windows.
- Keep **Console** and **Network** tabs open during testing.
- For each bug, record:
  - Expected vs actual behavior
  - Console / network log
  - Reproduction steps

---

**Last updated:** October 2025  
**Project stack:** React + Redux + MUI + Socket.io + Node/Express + MongoDB + Recharts
