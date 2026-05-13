# ✍️ WRITING_CODE.md
**MoonDive Software** · POC Version

---

## ORBIT Auto-Trigger
This playbook activates when the prompt includes:
`write`, `create`, `build`, `add`, `make`, `generate`, `implement`, `code`

> `🌙 ORBIT → WRITING_CODE activated`

---

## BACKEND (Node.js)

### File Placement Rules
| What you are writing         | Where it goes                   |
|------------------------------|---------------------------------|
| API endpoint                 | `backend/routes/`               |
| Reusable utility / formatter | `backend/helpers/`              |
| Constants / status codes     | `backend/enums/`                |
| Auth / request validation    | `backend/middleware/`           |
| JSON data file               | `backend/data/`                 |
| Global Response class        | `backend/helpers/Response.js`   |

---

### Response Class — ALWAYS Use This for All Responses
Never write `res.status(200).json(...)` — always use the `Response` class.

```js
// Import at top of every route file
const Response = require("../helpers/Response");

// ✅ CORRECT
return res.json(Response.success(data, "Fetched successfully"));
return res.json(Response.notFound(null, "User not found"));
return res.json(Response.badRequest(null, "ID is required"));
return res.json(Response.unauthorized(null, "Please login"));
return res.json(Response.internalServerError(null, "Server error"));

// ❌ WRONG — never hardcode
res.status(200).json({ data });
res.status(404).json({ message: "not found" });
```

---

### Route Pattern
```js
// backend/routes/users.js
const express        = require("express");                    // 1. third-party
const Response       = require("../helpers/Response");        // 2. helpers
const { formatUser } = require("../helpers/userHelper");      // 2. helpers
const { UserStatus } = require("../enums/appEnums");          // 3. enums
const users          = require("../data/users.json");         // 4. data

const router = express.Router();

/**
 * @route  GET /api/users
 * @desc   Returns all active users
 */
router.get("/", (req, res) => {
  try {
    const result = users.filter(u => u.status === UserStatus.ACTIVE);
    return res.json(Response.success(result.map(formatUser), "Users fetched successfully"));
  } catch (err) {
    console.error("[GET /users]", err.message);
    return res.json(Response.internalServerError(null, "Server error"));
  }
});

/**
 * @route  GET /api/users/:id
 * @desc   Returns single user by ID
 */
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.json(Response.badRequest(null, "User ID is required"));

    const user = users.find(u => u.id === id);
    if (!user) return res.json(Response.notFound(null, "User not found"));

    return res.json(Response.success(formatUser(user), "User fetched successfully"));
  } catch (err) {
    console.error("[GET /users/:id]", err.message);
    return res.json(Response.internalServerError(null, "Server error"));
  }
});

module.exports = router;
```

---

### Helper Function Pattern
```js
// backend/helpers/userHelper.js

/**
 * @description Removes sensitive fields before sending to client
 * @param {Object} user - raw user object from data.json
 * @returns {Object} safe user object
 */
const formatUser = (user) => {
  if (!user) throw new Error("formatUser: user is required");
  const { password, ...safe } = user;
  return safe;
};

module.exports = { formatUser };
```

**Rules:**
- One responsibility per function
- Validate inputs — throw descriptive error if invalid
- Named exports only
- JSDoc on every exported function

---

### Enum Pattern
```js
// backend/enums/appEnums.js
const UserStatus = Object.freeze({
  ACTIVE:   "active",
  INACTIVE: "inactive",
  PENDING:  "pending",
});

module.exports = { UserStatus };
```

**Rules:**
- Always `Object.freeze()` — enums are immutable
- Never hardcode `"active"` or `404` in route logic
- Import from enums, always

---

### Backend Error & Commenting Rules
```js
// ✅ Always — try/catch on every route
// ✅ Always — use Response class for every res.json()
// ✅ Always — validate req.params / req.body before using
// ✅ Always — console.error("[routeName]", err.message) in catch
// ❌ Never  — hardcode status codes like res.status(200)
// ❌ Never  — empty catch block
// ❌ Never  — send password or sensitive fields in response

// Inline comment: explain WHY not WHAT
// TODO must include owner + date: // TODO [Vishal · 2026-05-14]: add pagination
```

---

## FRONTEND (React.js)

### File Placement Rules
| What you are writing              | Where it goes                     |
|-----------------------------------|-----------------------------------|
| Reusable UI piece (button, card)  | `frontend/src/components/`        |
| Full page view                    | `frontend/src/pages/`             |
| Reusable JS utility               | `frontend/src/helpers/`           |
| Constants / route paths / API URLs| `frontend/src/enums/`             |
| Global design tokens              | `frontend/src/index.css`          |

---

### Component Pattern
```jsx
// frontend/src/components/UserCard.jsx
import React          from "react";                        // 1. React
import { UserStatus } from "../enums/appEnums";            // 2. Enums
import "./UserCard.css";                                   // 3. Styles last

/**
 * @description Displays a single user info card
 * @param {Object} props.user - { id, name, email, status }
 */
const UserCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className={`user-card user-card--${user.status}`}>
      <h3 className="user-card__name">{user.name}</h3>
      <p  className="user-card__email">{user.email}</p>
      {user.status === UserStatus.ACTIVE && (
        <span className="user-card__badge">Active</span>
      )}
    </div>
  );
};

export default UserCard;
```

**Rules:**
- Null check props before rendering
- BEM class naming: `block__element--modifier`
- No inline styles — use CSS classes
- No API calls inside components — only in pages

---

### Page Pattern (API calls live here)
```jsx
// frontend/src/pages/UsersPage.jsx
import React, { useState, useEffect } from "react";       // 1. React
import UserCard from "../components/UserCard";             // 2. Components
import { API }  from "../enums/appEnums";                  // 3. Enums
import "./UsersPage.css";                                  // 4. Styles

const UsersPage = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API.BASE + API.USERS);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const json = await res.json();
      setUsers(json.result);   // Response class sends data in .result
    } catch (err) {
      console.error("[fetchUsers]", err.message);
      setError("Could not load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error-message">{error}</p>;

  return (
    <div className="users-page">
      <h1>Users</h1>
      <div className="users-page__grid">
        {users.map(user => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  );
};

export default UsersPage;
```

---

### Frontend Enum Pattern
```js
// frontend/src/enums/appEnums.js
export const API = Object.freeze({
  BASE:  "http://localhost:5000",
  USERS: "/api/users",
});

export const UserStatus = Object.freeze({
  ACTIVE:   "active",
  INACTIVE: "inactive",
});

export const AppRoutes = Object.freeze({
  HOME:  "/",
  USERS: "/users",
});
```

---

### Global CSS Pattern
```css
/* frontend/src/index.css */
:root {
  --color-primary:  #0A1628;
  --color-accent:   #00C9A7;
  --color-danger:   #FF6B6B;
  --color-text:     #1E293B;
  --color-muted:    #64748B;
  --color-bg:       #F8FAFC;
  --color-surface:  #FFFFFF;
  --color-border:   #E2E8F0;

  --space-sm:  8px;   --space-md: 16px;  --space-lg: 24px;
  --radius-md: 8px;   --radius-lg: 16px;
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
}
/* ✅ color: var(--color-primary)  ❌ Never: color: #0A1628 */
```

---

### Frontend Error Handling Rules
```js
// ✅ Always — try/catch around every fetch
// ✅ Always — show loading state while fetching
// ✅ Always — show friendly error message on failure
// ✅ Always — read data from json.result (Response class format)
// ✅ Always — use finally to reset loading
// ❌ Never  — silent unhandled fetch
// ❌ Never  — show raw error.message to user
// ❌ Never  — API calls inside a component (use pages)
```