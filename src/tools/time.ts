import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const GET_CURRENT_DATE_TOOL: Tool = {
    name: "get_current_date",
    description: `
        Get the current date and time information including weekday.
        Returns the current date in various formats and weekday information.
        This is useful for determining relative dates like "this week", "today", etc.
        Examples:
        - "What's today's date?"
        - "Get current date to log time for this week"
        - "What day of the week is today?"
        - "Show me the current date and weekday"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

export const FORMAT_DATE_RANGE_TOOL: Tool = {
    name: "format_date_range",
    description: `
        Format date ranges for Tick API operations.
        Converts relative date descriptions into YYYY-MM-DD format dates.
        Supports various date range formats like weekdays, weeks, months, etc.
        Examples:
        - "Format dates for Monday to Friday this week"
        - "Get date range for last week"
        - "Format dates for this month"
        - "Convert 'yesterday' to Tick API date format"
        - "Get dates for next Monday through Wednesday"
    `,
    inputSchema: {
        type: "object",
        properties: {
            range_type: {
                type: "string",
                enum: [
                    "this_week",
                    "last_week", 
                    "next_week",
                    "this_month",
                    "last_month",
                    "today",
                    "yesterday",
                    "tomorrow",
                    "weekdays_this_week",
                    "weekdays_last_week",
                    "weekdays_next_week",
                    "custom_week",
                    "custom_range"
                ],
                description: "The type of date range to format"
            },
            start_date: {
                type: "string",
                description: "Custom start date in YYYY-MM-DD format (only for custom_range)",
            },
            end_date: {
                type: "string", 
                description: "Custom end date in YYYY-MM-DD format (only for custom_range)",
            },
            week_start_date: {
                type: "string",
                description: "Start date of a specific week in YYYY-MM-DD format (only for custom_week)",
            },
            days_of_week: {
                type: "array",
                items: {
                    type: "string",
                    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                },
                description: "Specific days of the week to include (optional, defaults to all days for the range)"
            }
        },
        required: ["range_type"],
    },
};

export const PARSE_RELATIVE_DATE_TOOL: Tool = {
    name: "parse_relative_date",
    description: `
        Parse natural language date expressions into specific dates.
        Converts human-readable date descriptions into structured date information.
        Useful for interpreting user requests with relative dates.
        Examples:
        - "Parse 'last Monday' into a specific date"
        - "Convert 'two weeks ago' to date range"
        - "Interpret 'end of this month'"
        - "Parse 'next Friday' into YYYY-MM-DD format"
        - "Convert 'beginning of last week' to dates"
    `,
    inputSchema: {
        type: "object",
        properties: {
            date_expression: {
                type: "string",
                description: "Natural language date expression to parse (e.g., 'last Monday', 'this week', 'two days ago')"
            },
            reference_date: {
                type: "string",
                description: "Optional reference date in YYYY-MM-DD format (defaults to current date)"
            }
        },
        required: ["date_expression"],
    },
};