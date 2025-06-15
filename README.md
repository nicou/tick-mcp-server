# Tick MCP Server

MCP Server for communicating with the Tick API using [tick-api](https://github.com/nicou/tick-api). Implements all functions exposed in the Tick API as MCP Tools.

Log your hours using an LLM!

## Installation
```json
{
  "mcpServers": {
    "mcp-server-tick": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server-tick"
      ],
      "env": {
        "TICK_API_KEY": "",
        "TICK_SUBSCRIPTION_ID": "",
        "TICK_USER_AGENT": "TickMCPServer (your-email@example.com)"
      }
    }
  }
}
```
