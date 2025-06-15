import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod/v4";
import { CreateEntry, GetEntries, UpdateEntry } from "tick-api/dist/api/entries";

export const GET_ENTRIES_TOOL: Tool = {
    name: "get_entries",
    description: `
        Get time entries that meet the provided parameters.
        Note: Either start_date and end_date OR updated_at must be provided.
        Examples:
        - "Get entries from 2024-01-01 to 2024-01-31"
        - "Show me all billable entries this week"
        - "Get entries for project 123 from last month"
        - "Show entries updated since 2024-01-15T10:00:00Z"
        - "Get all entries for task 456"
    `,
    inputSchema: z.toJSONSchema(GetEntries) as any,
};

const GetUserEntriesSchema = GetEntries.extend({
    userId: z.number().describe("The unique identifier of the user whose entries to retrieve"),
});

export const GET_USER_ENTRIES_TOOL: Tool = {
    name: "get_user_entries",
    description: `
        Get time entries for a specific user.
        Note: Either start_date and end_date OR updated_at must be provided.
        Examples:
        - "Get entries for user 123 from 2024-01-01 to 2024-01-31"
        - "Show me entries for user 456 this week"
        - "Get billable entries for user 789 last month"
        - "Show entries for user 123 updated since yesterday"
    `,
    inputSchema: z.toJSONSchema(GetUserEntriesSchema) as any,
};

const GetProjectEntriesSchema = GetEntries.extend({
    projectId: z.number().describe("The unique identifier of the project whose entries to retrieve"),
});

export const GET_PROJECT_ENTRIES_TOOL: Tool = {
    name: "get_project_entries",
    description: `
        Get time entries for a specific project.
        Note: Either start_date and end_date OR updated_at must be provided.
        Examples:
        - "Get entries for project 123 from 2024-01-01 to 2024-01-31"
        - "Show me all entries for project 456 this month"
        - "Get billable entries for project 789"
        - "Show project 123 entries updated this week"
    `,
    inputSchema: z.toJSONSchema(GetProjectEntriesSchema) as any,
};

const GetTaskEntriesSchema = GetEntries.extend({
    taskId: z.number().describe("The unique identifier of the task whose entries to retrieve"),
});

export const GET_TASK_ENTRIES_TOOL: Tool = {
    name: "get_task_entries",
    description: `
        Get time entries for a specific task.
        Note: Either start_date and end_date OR updated_at must be provided.
        Examples:
        - "Get entries for task 123 from 2024-01-01 to 2024-01-31"
        - "Show me all entries for task 456 this week"
        - "Get entries for task 789 that are billable"
        - "Show task 123 entries updated recently"
    `,
    inputSchema: z.toJSONSchema(GetTaskEntriesSchema) as any,
};

export const GET_ENTRY_TOOL: Tool = {
    name: "get_entry",
    description: `
        Get detailed information about a specific time entry including task details.
        Returns entry details with associated task information.
        Examples:
        - "Get details for entry with ID abc123"
        - "Show me information about entry def456"
        - "Get entry details and task info for entry xyz789"
        - "What task is entry abc123 associated with?"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The unique identifier of the entry to retrieve",
            },
        },
        required: ["id"],
    },
};

export const CREATE_ENTRY_TOOL: Tool = {
    name: "create_entry",
    description: `
        Create a new time entry.
        Note: user_id will be ignored if the user is not an administrator.
        Examples:
        - "Log 8 hours for task 123 on 2024-01-15"
        - "Create entry: 4.5 hours on project work for task 456"
        - "Add time entry: 2 hours debugging for task 789 yesterday"
        - "Log 6 hours meeting time for task 123 on 2024-01-10"
    `,
    inputSchema: z.toJSONSchema(CreateEntry) as any,
};

const UpdateEntrySchemaWithId = UpdateEntry.extend({
    id: z.string().describe("The unique identifier of the entry to update"),
});

export const UPDATE_ENTRY_TOOL: Tool = {
    name: "update_entry",
    description: `
        Update an existing time entry.
        Examples:
        - "Update entry abc123 to 6 hours"
        - "Change entry def456 notes to 'Fixed critical bug'"
        - "Mark entry xyz789 as billed"
        - "Update entry abc123 date to 2024-01-16"
        - "Reassign entry def456 to task 999"
    `,
    inputSchema: z.toJSONSchema(UpdateEntrySchemaWithId) as any,
};

export const DELETE_ENTRY_TOOL: Tool = {
    name: "delete_entry",
    description: `
        Delete a time entry permanently.
        Examples:
        - "Delete entry with ID abc123"
        - "Remove entry def456 permanently"
        - "Delete the incorrect time entry xyz789"
        - "Permanently remove entry abc123"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The unique identifier of the entry to delete",
            },
        },
        required: ["id"],
    },
};