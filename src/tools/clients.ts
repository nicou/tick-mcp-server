import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod/v4";
import { CreateClient, UpdateClientSchema } from "tick-api/dist/api/clients";

export const GET_CLIENTS_TOOL: Tool = {
    name: "get_clients",
    description: `
        Get all clients that have opened projects.
        This returns only active clients with open projects.
        Examples:
        - "Show me all clients"
        - "List all active clients"
        - "Get clients with open projects"
        - "Who are our current clients?"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

export const GET_ALL_CLIENTS_TOOL: Tool = {
    name: "get_all_clients",
    description: `
        Get all clients including archived ones.
        This returns both active and archived clients.
        Examples:
        - "Show me all clients including archived ones"
        - "List all clients including inactive ones"
        - "Get complete client list"
        - "Show me archived clients too"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

export const GET_CLIENT_TOOL: Tool = {
    name: "get_client",
    description: `
        Get detailed information about a specific client including project summary.
        Returns client details with information about their projects.
        Examples:
        - "Get details for client with ID 123"
        - "Show me information about client 456"
        - "Get client details and project summary for client 789"
        - "What projects does client 123 have?"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "number",
                description: "The unique identifier of the client to retrieve",
            },
        },
        required: ["id"],
    },
};

export const CREATE_CLIENT_TOOL: Tool = {
    name: "create_client",
    description: `
        Create a new client in the Tick subscription.
        Note: This method is restricted to administrators only.
        Examples:
        - "Create a new client named Acme Corp"
        - "Add a client called Tech Solutions Ltd"
        - "Create an archived client for Old Company"
        - "Add a new client with name ABC Industries"
    `,
    inputSchema: z.toJSONSchema(CreateClient) as any,
};

const UpdateClientSchemaWithId = UpdateClientSchema.extend({
		id: z.number().describe("The unique identifier of the client to update"),
});

export const UPDATE_CLIENT_TOOL: Tool = {
    name: "update_client",
    description: `
        Update an existing client.
        Note: This method is restricted to administrators only.
        Examples:
        - "Update client 123 name to New Company Name"
        - "Archive client with ID 456"
        - "Change client 789 to unarchived status"
        - "Rename client 123 to Updated Corp"
    `,
    inputSchema: z.toJSONSchema(UpdateClientSchemaWithId) as any,
};

export const DELETE_CLIENT_TOOL: Tool = {
    name: "delete_client",
    description: `
        Delete a client permanently.
        Note: This method is restricted to administrators only.
        Note: Only clients without any associated projects can be deleted.
        Examples:
        - "Delete client with ID 123"
        - "Remove client 456 permanently"
        - "Delete the client with no projects"
        - "Permanently remove client 789"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "number",
                description: "The unique identifier of the client to delete",
            },
        },
        required: ["id"],
    },
};
