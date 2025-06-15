function getEnvironmentVariable(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not set in the environment variables.`);
	}

	// Trim whitespace and remove surrounding quotes if present
	return value.trim().replace(/^"|"$/g, "");
}

export function getTickApiKey(): string {
	return getEnvironmentVariable("TICK_API_KEY");
}

export function getTickSubscriptionId(): string {
	return getEnvironmentVariable("TICK_SUBSCRIPTION_ID");
}

export function getTickUserAgent(): string {
	return getEnvironmentVariable("TICK_USER_AGENT");
}
