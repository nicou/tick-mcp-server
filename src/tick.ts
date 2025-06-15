import { TickClient } from "tick-api";
import { getTickApiKey, getTickSubscriptionId, getTickUserAgent } from "./env";

export const tick = new TickClient({
	apiToken: getTickApiKey(),
	subscriptionId: getTickSubscriptionId(),
	userAgent: getTickUserAgent(),
});
