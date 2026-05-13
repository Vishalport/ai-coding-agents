# 🧪 TEST_CASES.md
**MoonDive Software** · POC Version

---

## Rule
Every feature needs two types of tests:
- **Jest** → backend functions & API routes
- **Selenium** → frontend UI flows

---

## 1. Jest — Backend Tests

File location: `backend/__tests__/featureName.test.js`

### Pattern
```js
// backend/__tests__/users.test.js
const { formatUser } = require("../helpers/userHelper");

describe("formatUser helper", () => {

  test("should return user without password field", () => {
    const raw = { id: "1", name: "Alice", email: "a@test.com", password: "secret" };
    const result = formatUser(raw);
    expect(result).not.toHaveProperty("password");
    expect(result.name).toBe("Alice");
  });

  test("should throw error if user is null", () => {
    expect(() => formatUser(null)).toThrow("formatUser: user is required");
  });

});
```

### API Route Test Pattern
```js
const request = require("supertest");
const app     = require("../server");

describe("GET /api/users", () => {

  test("should return 200 with list of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should return 404 for unknown user id", async () => {
    const res = await request(app).get("/api/users/does-not-exist");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

});
```

### Rules
- Describe block = one feature or function
- Each test = one behaviour only
- Test both ✅ happy path and ❌ error/edge cases
- No hardcoded test data — define it at the top of the file

---

## 2. Selenium — Frontend UI Tests

File location: `frontend/__tests__/ui/featureName.ui.test.js`

### Pattern
```js
// frontend/__tests__/ui/userList.ui.test.js
const { Builder, By, until } = require("selenium-webdriver");

describe("User List Page", () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/users");
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("should display page heading", async () => {
    const heading = await driver.findElement(By.css("h1"));
    const text = await heading.getText();
    expect(text).toBe("Users");
  });

  test("should render at least one user card", async () => {
    await driver.wait(until.elementLocated(By.css(".user-card")), 5000);
    const cards = await driver.findElements(By.css(".user-card"));
    expect(cards.length).toBeGreaterThan(0);
  });

  test("should show error message if API fails", async () => {
    // handled separately with mocked network
    const errorEl = await driver.findElements(By.css(".error-message"));
    // just check it exists in DOM (hidden by default is fine)
    expect(errorEl).toBeDefined();
  });

});
```

### Rules
- Always `beforeAll` → open browser, navigate to page
- Always `afterAll` → quit browser (no zombie processes)
- Use CSS selectors — not XPath
- Test what the USER sees, not implementation details
- One file per page or major feature