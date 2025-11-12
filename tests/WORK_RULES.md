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
- **When we change rules, update existing code to comply with new rules** - if a rule changes, all existing code should be updated to follow the new rule
- **When fixing one test, check if other tests require similar fixes** - when you fix a bug or update logic in one test, review other tests to see if they have the same issue or need similar corrections
- **Avoid `waitForTimeout()` at all costs** - never use `await page.waitForTimeout(ms)` or similar fixed time waits. Instead, use proper waiting mechanisms like `waitFor()`, `toBeVisible()`, `toBeAttached()`, `waitForSelector()`, or wait for specific state changes. Fixed timeouts make tests flaky and slow.
- **Before generating locators, always start MCP server and open browser** - navigate to the page, take a snapshot, and inspect the actual DOM structure to ensure selectors are correct and unique. Never generate locators without first inspecting the real page structure.
- **Always close MCP browser when finished thinking** - when using MCP browser tools for inspection (`browser_navigate`, `browser_snapshot`, `browser_evaluate`), always close the browser after completing the inspection. Never leave MCP browser sessions open after finishing work.
- **Always close browser at the end of test** - when using MCP browser tools, ensure the browser is closed after test execution. For Playwright tests, the browser is automatically closed by the framework, but if manually opened browser sessions are used, they must be closed.

### Project Structure
- Page configuration: `tests/config/page-config.ts`
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
- We always clear `localStorage` before each test using `clearLocalStorage()`
- We use `beforeEach` to prepare a clean state
- Each test should start from a clean page
- We don't assume that the previous test left data
- Example:
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_CONFIG.url);
  await clearLocalStorage(page);
  await page.reload();
});
```

### Test Structure
```typescript
test('powinien [something]', async ({ page }) => {
  // 1. Preparation (arrange)
  await page.goto(PAGE_CONFIG.url);
  await clearLocalStorage(page);
  
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

### Using Helpers
- We always use functions from `config/helpers.ts` instead of direct DOM interactions
- Examples:
  - `fillCharacterForm()` instead of manual field filling (`page.fill()`, `page.selectOption()`)
  - `getCharacterCount()` instead of `page.locator('.character-card').count()`
  - `isPopupVisible()` instead of `page.locator('[role="dialog"]').isVisible()`
  - `clearLocalStorage()` instead of `page.evaluate(() => localStorage.clear())`
  - `addCharacter()` instead of `page.click('button:has-text("Dodaj postać")')` or `page.getByText("Dodaj postać")`

### Selectors
- **Before generating locators, always inspect the page** - start MCP server, navigate to the page, take snapshot, and use `browser_evaluate` to check actual DOM structure (IDs, classes, attributes). This ensures selectors are correct and unique.
- **Never locate elements by text** - use attributes, IDs, classes, data-testid, or other stable selectors
- **Never use `has-text()` function** - use stable selectors like `id`, `data-testid`, `aria-label`, `class`, or `label[for]` instead
- **Ensure selectors are unique** - when generating locators, verify they target only one element. If not unique, make them more specific (e.g., `h1` → `#parent-id h1`, use sibling selectors `#element ~ h2`, or parent class selectors `#parent .class-name h2`). **Never use `.first()`, `.last()`, or similar methods** - write everything in the selector itself.
- We use selectors from `PAGE_CONFIG.selectors` instead of hardcoding
- We don't write selectors directly in tests: `page.locator('button:has-text("Dodaj postać")')`, `page.locator('label:has-text("Siła:")')`, or `page.getByText("Dodaj postać")`
- We use: `page.locator(PAGE_CONFIG.selectors.addCharacterButton)` or `page.locator('[data-testid="add-character"]')` or `page.locator('label[for="strength"]')`
- If a selector doesn't work, we update `page-config.ts` instead of the test
- Selectors in `page-config.ts` can contain alternatives separated by commas
- Prefer: `data-testid`, `id`, `aria-label`, `role`, CSS classes, `label[for]` over text content
- If using tag selectors like `h1`, `h2`, ensure uniqueness by adding parent context or use `.first()` if multiple exist

## ✅ Best Practices

### Test Isolation
- Each test should be independent
- We use `beforeEach` to clean state
- We don't assume test execution order
- **Browser cleanup** - Playwright automatically closes the browser after each test. If using MCP browser tools for inspection (`browser_navigate`, `browser_snapshot`, `browser_evaluate`), **always close the browser immediately after completing the inspection** - do not leave MCP browser sessions open.

### Assertions
- We use `expect()` from Playwright for assertions
- We check both positive and negative scenarios
- We verify both UI and application state (e.g., localStorage)
- **Always use Page Object Pattern (POP)** - create Page Object classes in `tests/pages/` directory instead of step functions. Each Page Object class represents a page or component and contains locators, interaction methods, and verification methods. Use Page Objects in tests instead of step functions or direct assertions. This makes tests more maintainable, reusable, and follows best practices.
- **Initialize Page Objects in fixtures** - create custom fixtures in `tests/fixtures.ts` that automatically initialize Page Objects. Use fixtures in tests instead of manually creating Page Object instances. This ensures consistent initialization and makes tests cleaner.

### Comments
- Comments can be in Polish (for better readability in the context of user stories)
- They explain "why" not "what" (code should be self-documenting)
- We use comments to describe test sections (arrange/act/assert)
- Code (function names, variables, classes) always in English

### Timeouts
- We use timeouts from `PAGE_CONFIG.timeouts` if needed
- By default, Playwright has reasonable timeouts
- We don't set timeouts without a reason

## 📦 User Stories

### Mapping Tests to User Stories
- Each user story should have a dedicated test file or section
- File name should correspond to the main functionality of the user story
- Tests should cover all acceptance criteria

### Test File Structure
```typescript
import { test, expect } from '@playwright/test';
import {
  PAGE_CONFIG,
  clearLocalStorage,
  fillCharacterForm,
  addCharacter,
  getCharacterCount,
} from './config';

test.describe('User Story #X: [Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_CONFIG.url);
    await clearLocalStorage(page);
    await page.reload();
  });

  test('powinien [acceptance criteria 1]', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });

  test('powinien [acceptance criteria 2]', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

## 🔧 Configuration Updates

### When to Update `page-config.ts`
- When a selector doesn't work - we add alternative selectors
- When the page structure changes
- When we add new UI elements

### When to Update `helpers.ts`
- When we need a new helper function used in many tests
- When logic is repeated in many tests
- When we want to simplify UI interaction

## 🚫 What to Avoid

- ❌ **Locating elements by text** (`page.getByText()`, `page.locator('button:has-text("...")')`) - use stable selectors instead
- ❌ **Using `has-text()` function** (`page.locator('label:has-text("Siła:")')`, `page.locator('h3:has-text("Wybierz klasę:")')`) - use `id`, `data-testid`, `label[for]`, or other stable selectors instead
- ❌ **Non-unique selectors** (`page.locator('h1')` when multiple H1 exist, `page.locator('h2')` when multiple H2 exist) - make selectors unique by adding parent context (`#parent-id h1`, `#parent .class-name h2`, `#sibling ~ h3`)
- ❌ **Using `.first()`, `.last()`, or similar methods** (`page.locator('h2').first()`) - write everything in the selector itself using parent context, sibling selectors, or class selectors
- ❌ Hardcoding selectors in tests
- ❌ Repeating logic in many tests (we use helpers)
- ❌ Assuming test execution order
- ❌ Tests dependent on each other
- ❌ Tests that are too long (>100 lines) - we split into smaller ones
- ❌ Tests without a clear purpose
- ❌ Ignoring errors (`.catch()` without reason)
- ❌ Using Polish names in code (variables, functions, classes)
- ❌ Manual form filling instead of `fillCharacterForm()`
- ❌ Direct DOM interactions if a helper exists

## 📚 Additional Rules

### File and Code Language
- **All files generated in English** (file names: `character-creation.spec.ts`, not `tworzenie-postaci.spec.ts`)
- All code (variables, functions, classes, interfaces) in English
- Test names and comments can be in Polish for better readability in the context of Polish user stories
- Imports and exports in English
- Configuration and helper file names in English: `page-config.ts`, `helpers.ts`, not `konfiguracja-strony.ts`

_(You can add your own rules here as the project develops)_

---

**Last updated:** [Date will be automatically updated]

