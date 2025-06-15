#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	ListToolsRequestSchema,
	CallToolRequestSchema,
	type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { tick } from "./tick";
import {
	GET_CLIENTS_TOOL,
	GET_ALL_CLIENTS_TOOL,
	GET_CLIENT_TOOL,
	CREATE_CLIENT_TOOL,
	UPDATE_CLIENT_TOOL,
	DELETE_CLIENT_TOOL,
} from "./tools/clients";
import {
	GET_ENTRIES_TOOL,
	GET_USER_ENTRIES_TOOL,
	GET_PROJECT_ENTRIES_TOOL,
	GET_TASK_ENTRIES_TOOL,
	GET_ENTRY_TOOL,
	CREATE_ENTRY_TOOL,
	UPDATE_ENTRY_TOOL,
	DELETE_ENTRY_TOOL,
} from "./tools/entries";
import {
	GET_PROJECTS_TOOL,
	GET_CLOSED_PROJECTS_TOOL,
	GET_PROJECT_TOOL,
	CREATE_PROJECT_TOOL,
	UPDATE_PROJECT_TOOL,
	DELETE_PROJECT_TOOL,
} from "./tools/projects";
import {
	GET_PROJECT_TASKS_TOOL,
	GET_TASKS_TOOL,
	GET_PROJECT_CLOSED_TASKS_TOOL,
	GET_CLOSED_TASKS_TOOL,
	GET_TASK_TOOL,
	CREATE_TASK_TOOL,
	UPDATE_TASK_TOOL,
	DELETE_TASK_TOOL,
} from "./tools/tasks";
import {
	GET_USERS_TOOL,
	GET_DELETED_USERS_TOOL,
	CREATE_USER_TOOL,
} from "./tools/users";
import {
	GET_CURRENT_DATE_TOOL,
	FORMAT_DATE_RANGE_TOOL,
	PARSE_RELATIVE_DATE_TOOL,
} from "./tools/time";

const server = new Server({
	name: "tick-api-mcp-server",
	version: "0.1.0",
}, {
	capabilities: {
		tools: {},
	},
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			// Tick API - Clients
			GET_CLIENTS_TOOL,
			GET_ALL_CLIENTS_TOOL,
			GET_CLIENT_TOOL,
			CREATE_CLIENT_TOOL,
			UPDATE_CLIENT_TOOL,
			DELETE_CLIENT_TOOL,

			// Tick API - Projects
			GET_PROJECTS_TOOL,
			GET_CLOSED_PROJECTS_TOOL,
			GET_PROJECT_TOOL,
			CREATE_PROJECT_TOOL,
			UPDATE_PROJECT_TOOL,
			DELETE_PROJECT_TOOL,

			// Tick API - Tasks
			GET_PROJECT_TASKS_TOOL,
			GET_TASKS_TOOL,
			GET_PROJECT_CLOSED_TASKS_TOOL,
			GET_CLOSED_TASKS_TOOL,
			GET_TASK_TOOL,
			CREATE_TASK_TOOL,
			UPDATE_TASK_TOOL,
			DELETE_TASK_TOOL,

			// Tick API - Entries
			GET_ENTRIES_TOOL,
			GET_USER_ENTRIES_TOOL,
			GET_PROJECT_ENTRIES_TOOL,
			GET_TASK_ENTRIES_TOOL,
			GET_ENTRY_TOOL,
			CREATE_ENTRY_TOOL,
			UPDATE_ENTRY_TOOL,
			DELETE_ENTRY_TOOL,

			// Tick API - Users
			GET_USERS_TOOL,
			GET_DELETED_USERS_TOOL,
			CREATE_USER_TOOL,

			// Time Helper Tools
			GET_CURRENT_DATE_TOOL,
			FORMAT_DATE_RANGE_TOOL,
			PARSE_RELATIVE_DATE_TOOL,
		],
	};
});

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
	const { name, arguments: args } = request.params;

	try {
		switch (name) {
			// Time Helper Tools
			case GET_CURRENT_DATE_TOOL.name: {
				const now = new Date();
				const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				const months = ['January', 'February', 'March', 'April', 'May', 'June', 
							  'July', 'August', 'September', 'October', 'November', 'December'];
				
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								current_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
								current_datetime: now.toISOString(),
								weekday: weekdays[now.getDay()],
								weekday_number: now.getDay(), // 0 = Sunday, 6 = Saturday
								day: now.getDate(),
								month: now.getMonth() + 1,
								month_name: months[now.getMonth()],
								year: now.getFullYear(),
								formatted_date: now.toLocaleDateString('en-US', { 
									weekday: 'long', 
									year: 'numeric', 
									month: 'long', 
									day: 'numeric' 
								})
							}, null, 2)
						}
					]
				};
			}

			case FORMAT_DATE_RANGE_TOOL.name: {
				const { range_type, start_date, end_date, week_start_date, days_of_week } = args as any;
				const now = new Date();
				const result: any = {};

				switch (range_type) {
					case "today": {
						result.start_date = now.toISOString().split('T')[0];
						result.end_date = now.toISOString().split('T')[0];
						break;
					}
					
					case "yesterday": {
						const yesterday = new Date(now);
						yesterday.setDate(yesterday.getDate() - 1);
						result.start_date = yesterday.toISOString().split('T')[0];
						result.end_date = yesterday.toISOString().split('T')[0];
						break;
					}
					
					case "tomorrow": {
						const tomorrow = new Date(now);
						tomorrow.setDate(tomorrow.getDate() + 1);
						result.start_date = tomorrow.toISOString().split('T')[0];
						result.end_date = tomorrow.toISOString().split('T')[0];
						break;
					}
					
					case "this_week": {
						const startOfWeek = new Date(now);
						const day = startOfWeek.getDay();
						const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
						startOfWeek.setDate(diff);
						
						const endOfWeek = new Date(startOfWeek);
						endOfWeek.setDate(startOfWeek.getDate() + 6);
						
						result.start_date = startOfWeek.toISOString().split('T')[0];
						result.end_date = endOfWeek.toISOString().split('T')[0];
						break;
					}
					
					case "last_week": {
						const startOfWeek = new Date(now);
						const day = startOfWeek.getDay();
						const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) - 7; // Previous week
						startOfWeek.setDate(diff);
						
						const endOfWeek = new Date(startOfWeek);
						endOfWeek.setDate(startOfWeek.getDate() + 6);
						
						result.start_date = startOfWeek.toISOString().split('T')[0];
						result.end_date = endOfWeek.toISOString().split('T')[0];
						break;
					}
					
					case "next_week": {
						const startOfWeek = new Date(now);
						const day = startOfWeek.getDay();
						const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) + 7; // Next week
						startOfWeek.setDate(diff);
						
						const endOfWeek = new Date(startOfWeek);
						endOfWeek.setDate(startOfWeek.getDate() + 6);
						
						result.start_date = startOfWeek.toISOString().split('T')[0];
						result.end_date = endOfWeek.toISOString().split('T')[0];
						break;
					}
					
					case "weekdays_this_week":
					case "weekdays_last_week":
					case "weekdays_next_week": {
						// Get the week first
						const weekOffset = range_type === "weekdays_last_week" ? -7 : 
										  range_type === "weekdays_next_week" ? 7 : 0;
						
						const startOfWeek = new Date(now);
						const day = startOfWeek.getDay();
						const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) + weekOffset;
						startOfWeek.setDate(diff);
						
						// Generate weekdays (Monday to Friday)
						const weekdays = [];
						for (let i = 0; i < 5; i++) {
							const weekday = new Date(startOfWeek);
							weekday.setDate(startOfWeek.getDate() + i);
							weekdays.push(weekday.toISOString().split('T')[0]);
						}
						
						result.dates = weekdays;
						result.start_date = weekdays[0];
						result.end_date = weekdays[weekdays.length - 1];
						break;
					}
					
					case "this_month": {
						const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
						const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
						
						result.start_date = startOfMonth.toISOString().split('T')[0];
						result.end_date = endOfMonth.toISOString().split('T')[0];
						break;
					}
					
					case "last_month": {
						const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
						const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
						
						result.start_date = startOfMonth.toISOString().split('T')[0];
						result.end_date = endOfMonth.toISOString().split('T')[0];
						break;
					}
					
					case "custom_range":
						if (!start_date || !end_date) {
							throw new Error("start_date and end_date are required for custom_range");
						}
						result.start_date = start_date;
						result.end_date = end_date;
						break;
					
					case "custom_week": {
						if (!week_start_date) {
							throw new Error("week_start_date is required for custom_week");
						}
						
						const startDate = new Date(week_start_date);
						const endDate = new Date(startDate);
						endDate.setDate(startDate.getDate() + 6);
						
						result.start_date = week_start_date;
						result.end_date = endDate.toISOString().split('T')[0];
						
						// If specific days are requested
						if (days_of_week && days_of_week.length > 0) {
							const dayMap: { [key: string]: number } = {
								'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
								'friday': 4, 'saturday': 5, 'sunday': 6
							};
							
							const specificDates = days_of_week.map((day: string) => {
								const targetDate = new Date(startDate);
								const dayIndex = dayMap[day.toLowerCase()];
								if (dayIndex !== undefined) {
									targetDate.setDate(startDate.getDate() + dayIndex);
								}
								return targetDate.toISOString().split('T')[0];
							}).sort();
							
							result.dates = specificDates;
						}
						break;
					}
					
					default:
						throw new Error(`Unsupported range_type: ${range_type}`);
				}

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result, null, 2)
						}
					]
				};
			}

			case PARSE_RELATIVE_DATE_TOOL.name: {
				const { date_expression, reference_date } = args as any;
				const ref = reference_date ? new Date(reference_date) : new Date();
				const expression = date_expression.toLowerCase().trim();
				
				const result: any = {};
				
				// Parse common relative date expressions
				if (expression.includes('today')) {
					result.parsed_date = ref.toISOString().split('T')[0];
					result.type = 'single_date';
				} else if (expression.includes('yesterday')) {
					const yesterday = new Date(ref);
					yesterday.setDate(yesterday.getDate() - 1);
					result.parsed_date = yesterday.toISOString().split('T')[0];
					result.type = 'single_date';
				} else if (expression.includes('tomorrow')) {
					const tomorrow = new Date(ref);
					tomorrow.setDate(tomorrow.getDate() + 1);
					result.parsed_date = tomorrow.toISOString().split('T')[0];
					result.type = 'single_date';
				} else if (expression.includes('last monday') || expression.includes('previous monday')) {
					const lastMonday = new Date(ref);
					const daysToSubtract = (ref.getDay() + 6) % 7 + 7; // Days to last Monday
					lastMonday.setDate(ref.getDate() - daysToSubtract);
					result.parsed_date = lastMonday.toISOString().split('T')[0];
					result.type = 'single_date';
				} else if (expression.includes('next monday')) {
					const nextMonday = new Date(ref);
					const daysToAdd = (8 - ref.getDay()) % 7 || 7; // Days to next Monday
					nextMonday.setDate(ref.getDate() + daysToAdd);
					result.parsed_date = nextMonday.toISOString().split('T')[0];
					result.type = 'single_date';
				} else if (expression.includes('this week')) {
					// Use the format_date_range logic
					const startOfWeek = new Date(ref);
					const day = startOfWeek.getDay();
					const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
					startOfWeek.setDate(diff);
					
					const endOfWeek = new Date(startOfWeek);
					endOfWeek.setDate(startOfWeek.getDate() + 6);
					
					result.start_date = startOfWeek.toISOString().split('T')[0];
					result.end_date = endOfWeek.toISOString().split('T')[0];
					result.type = 'date_range';
				} else {
					// For more complex expressions, provide a suggestion
					result.error = `Could not parse "${date_expression}". Try using more specific expressions like "today", "yesterday", "this week", "last Monday", etc.`;
					result.suggestions = [
						"today", "yesterday", "tomorrow",
						"this week", "last week", "next week",
						"last Monday", "next Friday",
						"this month", "last month"
					];
				}
				
				result.original_expression = date_expression;
				result.reference_date = reference_date || ref.toISOString().split('T')[0];
				
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result, null, 2)
						}
					]
				};
			}

			// Tick API - Clients
			case GET_CLIENTS_TOOL.name: {
				const clients = await tick.getClients();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(clients, null, 2)
						}
					]
				};
			}

			case GET_ALL_CLIENTS_TOOL.name: {
				const clients = await tick.getAllClients();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(clients, null, 2)
						}
					]
				};
			}

			case GET_CLIENT_TOOL.name: {
				const { id } = args as any;
				const client = await tick.getClient(id);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(client, null, 2)
						}
					]
				};
			}

			case CREATE_CLIENT_TOOL.name: {
				const params = args as any;
				const client = await tick.createClient(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(client, null, 2)
						}
					]
				};
			}

			case UPDATE_CLIENT_TOOL.name: {
				const { id, ...params } = args as any;
				const client = await tick.updateClient(id, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(client, null, 2)
						}
					]
				};
			}

			case DELETE_CLIENT_TOOL.name: {
				const { id } = args as any;
				await tick.deleteClient(id);
				return {
					content: [
						{
							type: "text",
							text: `Client with ID ${id} has been successfully deleted.`
						}
					]
				};
			}

			// Tick API - Entries
			case GET_ENTRIES_TOOL.name: {
				const params = args as any;
				const entries = await tick.getEntries(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entries, null, 2)
						}
					]
				};
			}

			case GET_USER_ENTRIES_TOOL.name: {
				const { userId, ...params } = args as any;
				const entries = await tick.getUserEntries(userId, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entries, null, 2)
						}
					]
				};
			}

			case GET_PROJECT_ENTRIES_TOOL.name: {
				const { projectId, ...params } = args as any;
				const entries = await tick.getProjectEntries(projectId, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entries, null, 2)
						}
					]
				};
			}

			case GET_TASK_ENTRIES_TOOL.name: {
				const { taskId, ...params } = args as any;
				const entries = await tick.getTaskEntries(taskId, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entries, null, 2)
						}
					]
				};
			}

			case GET_ENTRY_TOOL.name: {
				const { id } = args as any;
				const entry = await tick.getEntry(id);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entry, null, 2)
						}
					]
				};
			}

			case CREATE_ENTRY_TOOL.name: {
				const params = args as any;
				const entry = await tick.createEntry(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entry, null, 2)
						}
					]
				};
			}

			case UPDATE_ENTRY_TOOL.name: {
				const { id, ...params } = args as any;
				const entry = await tick.updateEntry(id, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(entry, null, 2)
						}
					]
				};
			}

			case DELETE_ENTRY_TOOL.name: {
				const { id } = args as any;
				await tick.deleteEntry(id);
				return {
					content: [
						{
							type: "text",
							text: `Entry with ID ${id} has been successfully deleted.`
						}
					]
				};
			}

			// Tick API - Projects
			case GET_PROJECTS_TOOL.name: {
				const params = args as any;
				const projects = await tick.getProjects(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(projects, null, 2)
						}
					]
				};
			}

			case GET_CLOSED_PROJECTS_TOOL.name: {
				const params = args as any;
				const projects = await tick.getClosedProjects(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(projects, null, 2)
						}
					]
				};
			}

			case GET_PROJECT_TOOL.name: {
				const { id } = args as any;
				const project = await tick.getProject(id);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(project, null, 2)
						}
					]
				};
			}

			case CREATE_PROJECT_TOOL.name: {
				const params = args as any;
				const project = await tick.createProject(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(project, null, 2)
						}
					]
				};
			}

			case UPDATE_PROJECT_TOOL.name: {
				const { id, ...params } = args as any;
				const project = await tick.updateProject(id, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(project, null, 2)
						}
					]
				};
			}

			case DELETE_PROJECT_TOOL.name: {
				const { id } = args as any;
				await tick.deleteProject(id);
				return {
					content: [
						{
							type: "text",
							text: `Project with ID ${id} has been successfully deleted.`
						}
					]
				};
			}

			// Tick API - Tasks
			case GET_PROJECT_TASKS_TOOL.name: {
				const { projectId } = args as any;
				const tasks = await tick.getProjectTasks(projectId);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(tasks, null, 2)
						}
					]
				};
			}

			case GET_TASKS_TOOL.name: {
				const tasks = await tick.getTasks();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(tasks, null, 2)
						}
					]
				};
			}

			case GET_PROJECT_CLOSED_TASKS_TOOL.name: {
				const { projectId } = args as any;
				const tasks = await tick.getProjectClosedTasks(projectId);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(tasks, null, 2)
						}
					]
				};
			}

			case GET_CLOSED_TASKS_TOOL.name: {
				const tasks = await tick.getClosedTasks();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(tasks, null, 2)
						}
					]
				};
			}

			case GET_TASK_TOOL.name: {
				const { id } = args as any;
				const task = await tick.getTask(id);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(task, null, 2)
						}
					]
				};
			}

			case CREATE_TASK_TOOL.name: {
				const params = args as any;
				const task = await tick.createTask(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(task, null, 2)
						}
					]
				};
			}

			case UPDATE_TASK_TOOL.name: {
				const { id, ...params } = args as any;
				const task = await tick.updateTask(id, params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(task, null, 2)
						}
					]
				};
			}

			case DELETE_TASK_TOOL.name: {
				const { id } = args as any;
				await tick.deleteTask(id);
				return {
					content: [
						{
							type: "text",
							text: `Task with ID ${id} has been successfully deleted.`
						}
					]
				};
			}

			// Tick API - Users
			case GET_USERS_TOOL.name: {
				const users = await tick.getUsers();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(users, null, 2)
						}
					]
				};
			}

			case GET_DELETED_USERS_TOOL.name: {
				const users = await tick.getDeletedUsers();
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(users, null, 2)
						}
					]
				};
			}

			case CREATE_USER_TOOL.name: {
				const params = args as any;
				const user = await tick.createUser(params);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(user, null, 2)
						}
					]
				};
			}

			default:
				throw new Error(`Unknown tool: ${name}`);
		}
	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error: ${error instanceof Error ? error.message : String(error)}`
				}
			],
			isError: true
		};
	}
});

async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Tick API MCP Server running on stdio");
}

runServer().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
