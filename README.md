# Mess MCP Server

An MCP (Model Context Protocol) server for the IIIT Mess Management System. This allows AI assistants like Claude to interact with the mess portal through natural language.

## Features

- 🍽️ **View Menus** - Get menus for any date at all messes
- 📝 **Manage Registrations** - Register, cancel, or uncancel meals
- 💰 **Check Bills** - View your monthly mess bill with projections
- ⭐ **Submit Feedback** - Rate and review meals
- 🍕 **Extra Items** - View and register for extra items
- 📅 **Monthly Plans** - Manage monthly mess registrations
- ⚙️ **Preferences** - Control notification and meal settings
- 👤 **Profile** - View your user information

## Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **Claude Desktop** (Download from [claude.ai/download](https://claude.ai/download))
- **Mess Portal API Key** (Get from [mess.iiit.ac.in](https://mess.iiit.ac.in))

## Installation

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd mess-mcp
npm install
```

### 2. Get Your API Key

1. Log into https://mess.iiit.ac.in
2. Navigate to **Settings → API Keys**
3. Click **Create New Key**
4. Give it a name (e.g., "MCP Server") and set an expiry date
5. **Copy the key immediately** (it's only shown once!)

### 3. Configure Environment

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env` and replace `your-api-key-here` with your actual API key:

```env
MESS_API_KEY=your-actual-api-key-here
MESS_API_URL=https://mess.iiit.ac.in/api
```

### 4. Build the Project

```bash
npm run build
```

### 5. Configure Claude Desktop

Find your Claude Desktop config file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the MCP server configuration:

```json
{
  "mcpServers": {
    "mess": {
      "command": "node",
      "args": ["/absolute/path/to/mess-mcp/dist/index.js"],
      "env": {
        "MESS_API_KEY": "your-actual-api-key-here",
        "MESS_API_URL": "https://mess.iiit.ac.in/api"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/mess-mcp` with the actual path to your project.

**Example paths:**
- Windows: `"args": ["C:/Users/YourName/mess-mcp/dist/index.js"]`
- macOS/Linux: `"args": ["/home/yourname/mess-mcp/dist/index.js"]`

### 6. Restart Claude Desktop

Close Claude Desktop completely (check system tray/menu bar) and reopen it. The MCP server will load automatically.

## Usage

Once set up, you can interact with the mess system using natural language in Claude Desktop:

### Example Conversations

**View Today's Menu:**
> "What's for lunch today?"
> "Show me today's menu at Kadamba Veg"

**Register for Meals:**
> "Register me for dinner tomorrow at Yuktahar"
> "Sign me up for breakfast on Friday at Palash"

**Cancel/Manage Registrations:**
> "Cancel my breakfast for tomorrow"
> "Show my registrations for this week"
> "Uncancel my lunch on December 5th"

**Check Bills:**
> "What's my mess bill this month?"
> "How much have I spent so far?"

**View Capacities:**
> "Is there space at Kadamba for dinner tonight?"
> "Show me available spots for lunch tomorrow"

**Submit Feedback:**
> "Rate today's lunch 4 stars with remark 'Good food'"

**Manage Preferences:**
> "Turn off meal reminder notifications"
> "Enable unregistered meal access"

## Available Tools

The MCP server exposes 30+ tools organized into categories:

### 🏢 Mess Information
- Get mess info, menus, rates, capacities, and timings

### 📝 Registrations
- View, create, cancel, and manage meal registrations

### 💰 Billing & Feedback
- Check bills, submit feedback, view ratings

### 🍕 Extra Items
- Browse and register for extra food items

### 📅 Monthly Plans
- Manage monthly mess subscriptions

### ⚙️ Configuration
- View/update preferences, check windows and limits

### 👤 User Profile
- View profile, reset QR token

## Development

### Project Structure

```
mess-mcp/
├── src/
│   ├── index.ts           # Main MCP server entry point
│   ├── client.ts          # HTTP client for Mess API
│   ├── types.ts           # TypeScript type definitions
│   └── tools/
│       ├── auth.ts        # User authentication tools
│       ├── mess.ts        # Mess information tools
│       ├── registrations.ts # Registration management
│       ├── billing.ts     # Bills and feedback
│       ├── extras.ts      # Extra items
│       ├── monthly.ts     # Monthly registrations
│       └── config.ts      # Preferences and settings
├── dist/                  # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env                   # Your config (not in git)
├── .env.example           # Template for .env
└── README.md
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Build and run in development mode
- `npm start` - Run the compiled server

## Troubleshooting

### "Command not found" or "node not found"
- Make sure Node.js is installed and in your system PATH
- Try using the full path to `node.exe` in the Claude config

### "Unauthorized" errors
- Verify your API key is correct in `.env` and Claude config
- Check if your API key has expired in the mess portal

### MCP server not loading
- Ensure the path in `claude_desktop_config.json` is absolute and correct
- Check Claude Desktop logs for errors
- Restart Claude Desktop after config changes

### Menu not showing items
- The menu might not be updated for the current week
- Try a different date or mess

## Security

- **Never commit `.env` file** - It contains your API key
- **Never share your API key** - It provides full access to your account
- The `.gitignore` file is configured to exclude sensitive files
- Rotate your API keys periodically in the mess portal settings

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

Built for students of IIIT Hyderabad using the Mess Management System API.

## Support

For issues or questions:
- Open an issue on GitHub
- Check the [MCP Documentation](https://modelcontextprotocol.io)
- Review the [Mess Portal API docs](https://mess.iiit.ac.in)
