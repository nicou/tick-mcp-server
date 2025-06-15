import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod/v4";
import { CreateTask, UpdateTask } from "tick-api/dist/api/tasks";

const GetProjectTasksSchema = z.object({
    projectId: z.number().describe("The unique identifier of the project whose tasks to retrieve"),
});

export const GET_PROJECT_TASKS_TOOL: Tool = {
    name: "get_project_tasks",
    description: `
        Get all opened tasks for a specific project.
        Returns tasks that are currently open (not closed) for the specified project.
        Examples:
        - "Get all tasks for project 123"
        - "Show me open tasks for project 456"
        - "List tasks in project 789"
        - "What tasks are available in project 123?"
    `,
    inputSchema: z.toJSONSchema(GetProjectTasksSchema) as any,
};

export const GET_TASKS_TOOL: Tool = {
    name: "get_tasks",
    description: `
        Get all opened tasks across all projects.
        Returns all tasks that are currently open (not closed) from all projects.
        Examples:
        - "Show me all open tasks"
        - "Get all available tasks"
        - "List all current tasks"
        - "What tasks are open across all projects?"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

const GetProjectClosedTasksSchema = z.object({
    projectId: z.number().describe("The unique identifier of the project whose closed tasks to retrieve"),
});

export const GET_PROJECT_CLOSED_TASKS_TOOL: Tool = {
    name: "get_project_closed_tasks",
    description: `
        Get all closed tasks for a specific project.
        Returns tasks that have been closed/completed for the specified project.
        Examples:
        - "Get closed tasks for project 123"
        - "Show me completed tasks for project 456"
        - "List finished tasks in project 789"
        - "What tasks were completed in project 123?"
    `,
    inputSchema: z.toJSONSchema(GetProjectClosedTasksSchema) as any,
};

export const GET_CLOSED_TASKS_TOOL: Tool = {
    name: "get_closed_tasks",
    description: `
        Get all closed tasks across all projects.
        Returns all tasks that have been closed/completed from all projects.
        Examples:
        - "Show me all closed tasks"
        - "Get all completed tasks"
        - "List all finished tasks"
        - "What tasks have been completed across all projects?"
    `,
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

export const GET_TASK_TOOL: Tool = {
    name: "get_task",
    description: `
        Get detailed information about a specific task including total hours and entry information.
        Returns task details with associated project information and time entry summary.
        Examples:
        - "Get details for task with ID abc123"
        - "Show me information about task def456"
        - "Get task details and hours for task xyz789"
        - "What project is task abc123 associated with?"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The unique identifier of the task to retrieve",
            },
        },
        required: ["id"],
    },
};

export const CREATE_TASK_TOOL: Tool = {
    name: "create_task",
    description: `
        Create a new task in a project.
        Note: This method is limited strictly to administrators on the subscription.
        Examples:
        - "Create task 'Bug Fixes' for project 123 with 20 hour budget"
        - "Add new task: Feature Development, billable, 40 hours for project 456"
        - "Create non-billable task 'Internal Review' for project 789"
        - "New task: Testing, project 123, budget 15 hours"
    `,
    inputSchema: z.toJSONSchema(CreateTask) as any,
};

const UpdateTaskSchemaWithId = UpdateTask.extend({
    id: z.string().describe("The unique identifier of the task to update"),
});

export const UPDATE_TASK_TOOL: Tool = {
    name: "update_task",
    description: `
        Update an existing task.
        Note: This method is limited strictly to administrators on the subscription.
        Examples:
        - "Update task abc123 budget to 30 hours"
        - "Change task def456 name to 'Updated Feature Work'"
        - "Update task xyz789 to be non-billable"
        - "Reassign task abc123 to project 999"
        - "Change task def456 to billable status"
    `,
    inputSchema: z.toJSONSchema(UpdateTaskSchemaWithId) as any,
};

export const DELETE_TASK_TOOL: Tool = {
    name: "delete_task",
    description: `
        Delete a task permanently.
        Note: This method is limited strictly to administrators on the subscription.
        Note: Only tasks without any time entries can be deleted.
        Examples:
        - "Delete task with ID abc123"
        - "Remove task def456 permanently"
        - "Delete the unused task xyz789"
        - "Permanently remove task abc123"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The unique identifier of the task to delete",
            },
        },
        required: ["id"],
    },
};