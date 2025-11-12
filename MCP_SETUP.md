# Playwright MCP Setup for Cursor

## Installation Status

✅ **Playwright MCP has been installed** as a dev dependency:
- Package: `@playwright/mcp@^0.0.45`
- Location: `node_modules/@playwright/mcp`

## Configuration in Cursor

To use Playwright MCP in Cursor, you need to configure it in Cursor's MCP settings.

### Option 1: Using Cursor Settings UI

1. Open Cursor Settings (File → Preferences → Settings, or `Ctrl+,`)
2. Search for "MCP" or "Model Context Protocol"
3. Add a new MCP server configuration:
   - **Name**: `playwright`
   - **Command**: `npx`
   - **Args**: `["@playwright/mcp@latest"]`
   - **Working Directory**: (leave empty or use project root)

### Option 2: Using Configuration File

Cursor stores MCP configuration in a JSON file. You may need to add it manually:

**Location**: `%APPDATA%\Cursor\User\globalStorage\cursor.mcp.json` (Windows)

**Configuration**:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ],
      "cwd": "."
    }
  }
}
```

### Option 3: Project-level Configuration (RECOMMENDED)

✅ **Created**: `.cursor/mcp.json` file in your project root with browser-only restrictions:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ],
      "env": {
        "PLAYWRIGHT_MCP_BROWSER": "chromium",
        "PLAYWRIGHT_MCP_HEADLESS": "true"
      },
      "description": "Playwright MCP server limited to browser automation only",
      "restrictions": {
        "allowedActions": [
          "navigate",
          "click",
          "fill",
          "select",
          "screenshot",
          "evaluate",
          "waitForSelector",
          "getText",
          "getAttribute",
          "isVisible"
        ],
        "blockedActions": [
          "fileSystem",
          "network",
          "system"
        ]
      }
    }
  }
}
```

**Configuration Features:**
- ✅ Limited to browser automation only
- ✅ Only allowed actions: navigate, click, fill, select, screenshot, evaluate, etc.
- ✅ Blocked actions: fileSystem, network, system operations
- ✅ Uses Chromium browser in headless mode

## Verification

After configuration, you should be able to:
- Use Playwright MCP tools through the AI assistant
- Inspect web pages programmatically
- Generate selectors and test code
- Interact with browsers through MCP protocol

## Resources

- GitHub: https://github.com/microsoft/playwright-mcp
- Documentation: Check Cursor's MCP documentation for specific configuration details

## Browser-Only Restrictions

The configuration in `.cursor/mcp.json` restricts Playwright MCP to browser automation only:

**Allowed Actions:**
- ✅ Navigate to pages
- ✅ Click elements
- ✅ Fill forms
- ✅ Select options
- ✅ Take screenshots
- ✅ Evaluate JavaScript
- ✅ Wait for selectors
- ✅ Get text and attributes
- ✅ Check visibility

**Blocked Actions:**
- ❌ File system operations
- ❌ Network operations (outside browser)
- ❌ System operations

## Notes

- The package is installed locally in `node_modules`
- Configuration file created at `.cursor/mcp.json` with browser-only restrictions
- You can also use `npx @playwright/mcp@latest` directly from command line
- Make sure Node.js version is 18+ for compatibility
- The server will only work with browser automation, ensuring security

