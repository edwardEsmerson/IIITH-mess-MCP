# Quick Setup Guide

This is a quick reference for setting up the Mess MCP Server. For detailed documentation, see [README.md](README.md).

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Claude Desktop installed ([Download](https://claude.ai/download))
- [ ] Mess Portal API key ([Get one](https://mess.iiit.ac.in))

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env File

```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
MESS_API_KEY=your-actual-key-here
```

### 3. Build

```bash
npm run build
```

### 4. Configure Claude Desktop

**Windows**: Open `%APPDATA%\Claude\claude_desktop_config.json`

**macOS/Linux**: Open `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this (replace the path with your actual path):

```json
{
  "mcpServers": {
    "mess": {
      "command": "node",
      "args": ["C:/path/to/mess-mcp/dist/index.js"],
      "env": {
        "MESS_API_KEY": "your-actual-key-here",
        "MESS_API_URL": "https://mess.iiit.ac.in/api"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

Close completely and reopen.

## Quick Test

In Claude Desktop, try:
> "What's for lunch today?"

If you see menu items, it's working! 🎉

## Common Issues

**"node not found"**
- Install Node.js from nodejs.org
- Restart your terminal/Claude Desktop

**"Unauthorized"**
- Check your API key is correct
- Verify it hasn't expired

**Server not loading**
- Make sure the path in config is absolute
- Check there are no typos in the config JSON
- Restart Claude Desktop

## Get Your API Key

1. Visit https://mess.iiit.ac.in
2. Login with your credentials
3. Go to **Settings** (gear icon)
4. Click **API Keys** tab
5. Click **Create New Key**
6. Name it "MCP Server"
7. Set expiry date (e.g., 1 year from now)
8. **Copy the key immediately** - you won't see it again!

## Example Commands

Once setup:
- "What's for lunch today?"
- "Register me for dinner tomorrow at Yuktahar"
- "What's my bill this month?"
- "Cancel my breakfast for Friday"
- "Show my registrations this week"

---

Need help? Check the full [README.md](README.md) or open an issue!
