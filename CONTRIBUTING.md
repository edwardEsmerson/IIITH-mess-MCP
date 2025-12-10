# Contributing to Mess MCP Server

Thank you for considering contributing to this project! 

## How to Contribute

### Reporting Bugs

If you find a bug:
1. Check if it's already reported in [Issues](https://github.com/NJP6969/IIITH-mess-mcp/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, Claude Desktop version)

### Suggesting Features

Have an idea? Open an issue with:
- Clear description of the feature
- Use case / why it would be useful
- Any implementation ideas

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/yourusername/mess-mcp.git
cd mess-mcp
npm install
cp .env.example .env
# Add your API key to .env
npm run build
```

### Code Style

- Use TypeScript
- Follow existing code patterns
- Add types for all functions
- Keep functions focused and documented
- Run `npm run build` before committing

### Testing

Before submitting:
- Build successfully (`npm run build`)
- Test with Claude Desktop
- Verify all changed tools work correctly
- Check for TypeScript errors

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the community
- Show empathy towards others

## Questions?

Open an issue or discussion - we're happy to help!

---

Thank you for contributing! 🎉
