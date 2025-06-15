import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod/v4";
import { CreateProject, UpdateProject } from "tick-api/dist/api/projects";

const GetProjectsSchema = z.object({
    page: z.number().optional().describe("Page number for pagination (up to 100 records per page)"),
});

export const GET_PROJECTS_TOOL: Tool = {
    name: "get_projects",
    description: `
        Get all opened projects with optional pagination.
        Returns up to 100 projects per page.
        Examples:
        - "Show me all open projects"
        - "Get projects on page 2"
        - "List all current projects"
        - "Show active projects"
    `,
    inputSchema: z.toJSONSchema(GetProjectsSchema) as any,
};

export const GET_CLOSED_PROJECTS_TOOL: Tool = {
    name: "get_closed_projects", 
    description: `
        Get all closed projects with optional pagination.
        Returns up to 100 projects per page.
        Examples:
        - "Show me all closed projects"
        - "Get completed projects"
        - "List archived projects on page 1"
        - "Show finished projects"
    `,
    inputSchema: z.toJSONSchema(GetProjectsSchema) as any,
};

export const GET_PROJECT_TOOL: Tool = {
    name: "get_project",
    description: `
        Get detailed information about a specific project.
        Returns project details including total hours, task summary, and client information.
        Examples:
        - "Get details for project 123"
        - "Show me information about project 456"
        - "Get project details and hours for project 789"
        - "What client is project 123 associated with?"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "number",
                description: "The unique identifier of the project to retrieve",
            },
        },
        required: ["id"],
    },
};

export const CREATE_PROJECT_TOOL: Tool = {
    name: "create_project",
    description: `
        Create a new project.
        Note: This method is restricted to administrators only.
        Note: No tasks will be created, time entries not allowed until at least one task is created.
        Examples:
        - "Create project 'Website Redesign' for client 123 with 100 hour budget"
        - "Add new project: Mobile App Development, billable, 200 hours"
        - "Create recurring project for client 456 with notifications enabled"
        - "New project: Bug Fixes, owner user 789, budget 50 hours"
    `,
    inputSchema: z.toJSONSchema(CreateProject) as any,
};

const UpdateProjectSchemaWithId = UpdateProject.extend({
    id: z.number().describe("The unique identifier of the project to update"),
});

export const UPDATE_PROJECT_TOOL: Tool = {
    name: "update_project",
    description: `
        Update an existing project.
        Note: This method is restricted to administrators only.
        Examples:
        - "Update project 123 budget to 150 hours"
        - "Change project 456 name to 'Mobile App v2'"
        - "Update project 789 to be non-billable"
        - "Reassign project 123 to client 999"
        - "Change project 456 owner to user 888"
    `,
    inputSchema: z.toJSONSchema(UpdateProjectSchemaWithId) as any,
};

export const DELETE_PROJECT_TOOL: Tool = {
    name: "delete_project",
    description: `
        Delete a project permanently.
        Note: This method is restricted to administrators only.
        WARNING: The project and ALL time entries will be immediately deleted.
        Examples:
        - "Delete project with ID 123"
        - "Remove project 456 permanently"
        - "Delete the cancelled project 789"
        - "Permanently remove project 123 and all its data"
    `,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "number",
                description: "The unique identifier of the project to delete",
            },
        },
        required: ["id"],
    },
};
