# 📐 CODING_STANDARD.md
**MoonDive Software** · POC Version

---

## 1. Variable Naming
```js
const userId = "abc";          // camelCase → variables & functions
const MAX_RETRIES = 3;         // SCREAMING_SNAKE → constants
const UserStatus = {...}       // PascalCase → enums & classes
```

---

## 2. Helper Functions
- One job per function. If it's used more than once → move it to `helpers/`
- Always validate input at the top
- Always use JSDoc comment

```js
// backend/helpers/userHelper.js

/**
 * @description Strips sensitive fields from user object
 * @param {Object} user - raw user from data.json
 * @returns {Object} safe user for API response
 */
const formatUser = (user) => {
  if (!user) throw new Error("formatUser: user is required");
  const { password, ...safe } = user;
  return safe;
};

module.exports = { formatUser };
```

---

## 3. Enums
- No hardcoded strings or numbers in logic — ever
- Always use `Object.freeze()`

```js
// backend/enums/appEnums.js
const UserStatus = Object.freeze({
  ACTIVE: "active", INACTIVE: "inactive",
});

module.exports = { UserStatus };
```

```js
// frontend/src/enums/appEnums.js
export const API = Object.freeze({
  BASE: "http://localhost:5000",
  USERS: "/api/users",
});
```

---

## 4. Global Error Handling — Response Class

MoonDive uses a **global `Response` class** for ALL backend responses.
Never use `res.status(200).json(...)` directly — always use `Response`.

### The Response Class (lives in `backend/helpers/Response.js`)
```js
// backend/helpers/Response.js
class Response {
  constructor(result = {}, responseMessage = 'Operation completed successfully', newResponseCode) {
    this.responseMessage = responseMessage;
    this.responseCode = newResponseCode;
    if (newResponseCode == 200) {
      this.result = result || {};
    }
  }
  static success(res, msg)             { return new Response(res, msg, 200); }
  static unauthorized(res, msg)        { return new Response(res, msg, 401); }
  static badRequest(res, msg)          { return new Response(res, msg, 400); }
  static internal(res, msg)            { return new Response(res, msg, 500); }
  static notFound(res, msg)            { return new Response(res, msg, 404); }
  static internalServerError(res, msg) { return new Response(res, msg, 500); }
  static conflict(res, msg)            { return new Response(res, msg, 409); }
  static forbidden(res, msg)           { return new Response(res, msg, 403); }
  static invalid(res, msg)             { return new Response(res, msg, 402); }
  static alreadyExist(res, msg)        { return new Response(res, msg, 409); }
}
module.exports = Response;
```

### How to Use in Routes
```js
// ✅ CORRECT — always use Response class
const Response = require("../helpers/Response");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)   return res.json(Response.badRequest(null, "User ID is required"));

    const user = data.find(u => u.id === id);
    if (!user) return res.json(Response.notFound(null, "User not found"));

    return res.json(Response.success(formatUser(user), "User fetched successfully"));
  } catch (err) {
    console.error("[getUser]", err.message);
    return res.json(Response.internalServerError(null, "Server error"));
  }
};

// ❌ WRONG — never hardcode status codes
res.status(200).json({ success: true, data: user });
res.status(404).json({ message: "Not found" });
```

### Quick Reference
| Situation                  | Use                                         |
|----------------------------|---------------------------------------------|
| Success                    | `Response.success(data, msg)`               |
| Not found                  | `Response.notFound(null, msg)`              |
| Bad input / missing field  | `Response.badRequest(null, msg)`            |
| Not logged in              | `Response.unauthorized(null, msg)`          |
| No permission              | `Response.forbidden(null, msg)`             |
| Already exists             | `Response.alreadyExist(null, msg)`          |
| Server crash               | `Response.internalServerError(null, msg)`   |

---

## 5. Frontend Error Handling

```js
// ✅ Frontend — always wrap fetch in try/catch
const loadUsers = async () => {
  try {
    setLoading(true);
    const res = await fetch(API.BASE + API.USERS);
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    setUsers(json.result);
  } catch (err) {
    console.error("[loadUsers]", err.message);
    setError("Could not load users.");
  } finally {
    setLoading(false);
  }
};
```

---

## 6. Global CSS
- All tokens (colors, spacing, fonts) → `:root` in `index.css`
- Never use hex codes or px values directly in component CSS

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

  --space-sm: 8px;   --space-md: 16px;  --space-lg: 24px;
  --radius-md: 8px;  --radius-lg: 16px;
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
}
/* ✅ Use: color: var(--color-primary)  ❌ Never: color: #0A1628 */
```

---

## 7. Import Order (always follow this sequence)
```js
// Backend
const express    = require("express");                      // 1. Third-party
const Response   = require("../helpers/Response");          // 2. Helpers
const { formatUser } = require("../helpers/userHelper");    // 2. Helpers
const { UserStatus } = require("../enums/appEnums");        // 3. Enums
const data       = require("../data/users.json");           // 4. Data

// Frontend
import React, { useState } from "react";                   // 1. React
import { useNavigate } from "react-router-dom";             // 2. Third-party
import UserCard from "../components/UserCard";              // 3. Components
import { API } from "../enums/appEnums";                    // 4. Enums
import "./PageName.css";                                    // 5. Styles (last)
```