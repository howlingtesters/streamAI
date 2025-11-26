# 📋 Work Rules - Character Creator - Automated Tests

This document contains rules and conventions we follow when creating automated tests for the Character Creator application.

## 🎯 General Rules

### AI Collaboration
- AI should use existing helpers and configuration instead of writing everything from scratch
- **All files should be generated in English** (file names, code, variables, functions, classes, test names and comments)
- Each test should be isolated - does not depend on other tests
- Tests should be readable and easy to understand
- **After finishing thinking/processing, AI should write "Cursor out!"**
- **When generating new code, create only one example test that verifies it** - don't create multiple tests at once, focus on one working example first
- **When asked to prepare test cases for a story, generate only test file with test names but no implementation inside the tests** - create test file structure with empty test bodies containing only test names. Do not implement test logic, assertions, or interactions.
- **When we change rules, update existing code to comply with new rules** - if a rule changes, all existing code should be updated to follow the new rule
- **When fixing one test, check if other tests require similar fixes** - when you fix a bug or update logic in one test, review other tests to see if they have the same issue or need similar corrections
- **Do not repeat rules multiple times** - each rule should be stated only once in the document. If a rule needs to be mentioned in multiple contexts, reference it instead of repeating it.
- **Avoid `waitForTimeout()` at all costs** - never use `await page.waitForTimeout(ms)` or similar fixed time waits. Instead, use proper waiting mechanisms like `waitFor()`, `toBeVisible()`, `toBeAttached()`, `waitForSelector()`, or wait for specific state changes. Fixed timeouts make tests flaky and slow.
- **Don't guess where elements like popups will be - this needs to be deterministic** - always wait for elements (popups, modals, dynamic content) to appear before interacting with them. Use `waitFor()`, `waitForSelector()`, or `toBeVisible()` to ensure elements exist before clicking or reading them. Never assume elements are present without verification.
- **Test should not use `if` when not necessary - we should know when things are displayed** - structure tests to wait deterministically for elements to appear rather than using conditional logic (`if` statements) to check if elements exist. Wait for elements to be visible/hidden using `waitFor()`, `toBeVisible()`, or `toBeHidden()` instead of checking their state with `if`. Only use `if` when there are genuinely multiple possible outcomes that need different handling.
- **Assertions should match test name, don't use exceptions, promises etc. to avoid failures** - test assertions should directly verify what the test name claims. Use `expect()` assertions to verify expected outcomes. Don't use `throw new Error()`, `Promise.reject()`, or other exception-based mechanisms to handle failures - let the test fail naturally through failed assertions. Assume that tests will sometimes fail and that's expected behavior. The test name describes what should happen, and assertions should verify exactly that.
- **Use steps files to do repetitive actions like adding character to the list** - create reusable step functions in separate files (e.g., `steps/character-creation.steps.ts`) for common repetitive actions like creating characters, filling forms, etc. This avoids code duplication and makes tests more maintainable. Steps should be organized by functionality and imported into test files.
- **Use external data provider to get data for tests** - store test data in separate data provider files (e.g., `data/character-data.ts`, `data/test-data.ts`) instead of hardcoding data directly in test files. This makes tests more maintainable, allows data reuse across multiple tests, and makes it easier to update test data. Data providers should export typed data structures that match the interfaces used in steps and page objects.
- **Before generating locators, always start MCP server and open browser** - navigate to the page, take a snapshot, and inspect the actual DOM structure to ensure selectors are correct and unique. Never generate locators without first inspecting the real page structure. Always close the browser after completing the inspection.
- **Always close MCP browser when finished** - when using MCP browser tools for inspection (`browser_navigate`, `browser_snapshot`, `browser_evaluate`), always close the browser after completing the inspection. Never leave MCP browser sessions open after finishing work. For Playwright tests, the browser is automatically closed by the framework, but if manually opened browser sessions are used, they must be closed.
- **Always open MCP page in incognito mode** - when opening pages using MCP browser tools or when manually opening pages for inspection, always use incognito/private browsing mode to ensure a clean state without cookies, cache, or stored data from previous sessions.
- **Use selectors as simple and as short as possible while still being unique**

### Development Mode
- **Use only one browser type to run tests** - in development mode, configure Playwright to run tests on only one browser (e.g., chromium) to speed up test execution and reduce resource usage. Multiple browsers can be enabled for CI/production environments.

### Project Structure
- Helper functions: `tests/config/helpers.ts`
- Page Objects: `tests/pages/*.page.ts` - classes that represent pages/components with locators and methods
- Fixtures: `tests/fixtures.ts` - custom Playwright fixtures for initializing Page Objects
- Tests: `tests/*.spec.ts`
- User stories: `tests/user_stories_kreator_postaci.md`

## 📝 Naming Conventions

### Test Files
- Format: `kebab-case.spec.ts` (e.g., `character-creation.spec.ts`)
- **All file names in English**
- File name should correspond to the tested functionality

### Test Names
- Written in English
- Format: `should [something] [when/in which case]`
- Examples:
  - `should create character with full data`
  - `should display error message when class is missing`
  - `should not allow adding 5th character`

### Code Variables
- We use `camelCase` in English
- Names should be descriptive and readable
- Correct examples: `characterCount`, `remainingPoints`, `firstCard`, `characterCards`, `popupMessage`
- Incorrect examples: `count`, `pts`, `card1`, `msg` (too short/not descriptive)

## 🧪 Test Patterns

### beforeEach / afterEach
- Never clear `localStorage` before each test using `clearLocalStorage()` Playwright does it automatically
- **Always close cookie popup at the start of the test** - ensure cookie consent popup is closed before performing any test actions. This should be handled in the page object's `goto()` method or in `beforeEach` hook.
```

### Test Structure
```typescript
test('powinien [something]', async ({ page }) => {
  // 1. Preparation (arrange)
  await page.goto(PAGE_CONFIG.url);
  
  // 2. Execution (act)
  await fillCharacterForm(page, {
    name: 'CharacterName',
    race: PAGE_CONFIG.races.human,
    characterClass: PAGE_CONFIG.classes.warrior,
    stats: { strength: 5, cunning: 3, energy: 4, health: 3 }
  });
  await addCharacter(page);
  
  // 3. Verification (assert)
  const characterCount = await getCharacterCount(page);
  expect(characterCount).toBe(1);
  await expect(page.locator(PAGE_CONFIG.selectors.characterCard)).toBeVisible();
});
```

### Selectors
- **MOST IMPORTANT: Selectors must be unique** - a unique selector or locator means it should point to only one element on the current page. Always verify uniqueness when creating or updating selectors. This is the top priority when choosing selectors - simplicity and shortness are secondary to uniqueness. If a selector matches multiple elements, make it more specific (e.g., `h1` → `#parent-id h1`, use sibling selectors `#element ~ h2`, or parent class selectors `#parent .class-name h2`). **Never use `.first()`, `.last()`, or similar methods** - write everything in the selector itself.
- **Use selectors as simple and as short as possible while still being unique** - prefer CSS classes or preferably IDs. Keep selectors minimal and readable (e.g., `#element-id` or `.class-name` instead of `#parent-id > div:nth-child(2) > .class-name`). Remember: uniqueness comes first, simplicity second.
- **Never locate elements by text** - use attributes, IDs, classes, data-testid, or other stable selectors
- **Never use `has-text()` function** - use stable selectors like `id`, `data-testid`, `aria-label`, `class`, or `label[for]` instead
- We use selectors from `PAGE_CONFIG.selectors` instead of hardcoding
- We don't write selectors directly in tests
- We use page object for storing selectors
- Prefer: `id`, CSS classes, `data-testid`, `aria-label`, `role`, `label[for]` over text content
- If using tag selectors like `h1`, `h2`, ensure uniqueness by adding parent context

## ✅ Best Practices

### Test Isolation
- Each test should be independent
- We don't assume test execution order
- **Browser cleanup** - see "Always close MCP browser when finished" rule in AI Collaboration section above.
- **Always use Page Object Pattern (POP)** - create Page Object classes in `tests/pages/` directory instead of step functions. Each Page Object class represents a page or component and contains locators, interaction methods, and verification methods. Use Page Objects in tests instead of step functions. This makes tests more maintainable, reusable, and follows best practices.
- **Initialize Page Objects in fixtures** - create custom fixtures in `tests/fixtures.ts` that automatically initialize Page Objects. Use fixtures in tests instead of manually creating Page Object instances. This ensures consistent initialization and makes tests cleaner.

### Assertions
- We use `expect()` from Playwright for assertions
- We check both positive and negative scenarios
- Write assertions as steps in steep files

### Comments

- Write comments only when necessary (skip if code is self commented)
- They explain "why" not "what" (code should be self-documenting)
- We use comments to describe test sections (arrange/act/assert)


### Timeouts
- We use timeouts if needed
- By default, Playwright has reasonable timeouts
- We don't set timeouts without a reason

### Mapping User Stories to Tests
- Each user story should have a dedicated test file or section
- File name should correspond to the main functionality of the user story
- Tests should cover all acceptance criteria
- **Combine test cases from acceptance criteria when other test cases will cover previous ones** - if one test case already covers the functionality of another acceptance criterion, combine them into a single test rather than creating redundant tests. This reduces test duplication and maintenance overhead.

## 🚫 What to Avoid
- ❌ Tests that are too long (>100 lines) - we split into smaller ones
- ❌ Ignoring errors (`.catch()` without reason)
- ❌ Direct DOM interactions if a helper exists