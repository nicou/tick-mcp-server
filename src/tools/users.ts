import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod/v4";
import { CreateUser } from "tick-api/dist/api/users";

export const GET_USERS_TOOL: Tool = {
    name: "get_users",
    description: `
        Get all users on the Tick subscription.
        Non-administrators will only see themselves, administrators will see everyone.
        Examples:
        - "Show me all users"
        - "List all team members"
        - "Who are the users in this subscription?"
        - "Get the current user"
        - "Show me my user information"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

export const GET_DELETED_USERS_TOOL: Tool = {
    name: "get_deleted_users",
    description: `
        Get deleted users who have time entries.
        Note: This method is restricted to administrators only.
        Examples:
        - "Show me deleted users"
        - "List users that have been removed"
        - "What deleted users still have time entries?"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

export const CREATE_USER_TOOL: Tool = {
    name: "create_user",
    description: `
        Create a new user in the Tick subscription.
        Note: This method is restricted to administrators only.
        Examples:
        - "Create a new user with email john@example.com"
        - "Add a new team member named Jane Doe"
        - "Create an admin user for support@company.com"
    `,
    inputSchema: z.toJSONSchema(CreateUser) as any,
};
