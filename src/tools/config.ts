// Configuration and preferences tools

import { client } from "../client.js";
import type { ApiResponse, UserPreferences, Meal } from "../types.js";

export async function getPreferences(): Promise<string> {
  const response = await client.get<ApiResponse<UserPreferences>>("/preferences");
  
  const prefs = response.data;
  if (!prefs) {
    return "Could not retrieve preferences.";
  }

  const lines: string[] = [];
  lines.push("## Your Preferences\n");
  lines.push(`• **Notify when not registered**: ${prefs.notify_not_registered ? "✅ On" : "❌ Off"}`);
  lines.push(`• **Notify on random allocation**: ${prefs.notify_malloc_happened ? "✅ On" : "❌ Off"}`);
  lines.push(`• **Auto-reset QR daily**: ${prefs.auto_reset_token_daily ? "✅ On" : "❌ Off"}`);
  lines.push(`• **Allow unregistered meals**: ${prefs.enable_unregistered ? "✅ On" : "❌ Off"}`);
  lines.push(`• **Prompt for feedback**: ${prefs.nag_for_feedback ? "✅ On" : "❌ Off"}`);

  return lines.join("\n");
}

export async function updatePreferences(preferences: Partial<UserPreferences>): Promise<string> {
  // First get current preferences
  const currentResponse = await client.get<ApiResponse<UserPreferences>>("/preferences");
  const current = currentResponse.data;

  // Merge with updates
  const updated = { ...current, ...preferences };

  await client.put("/preferences", updated);

  return `✅ Preferences updated successfully.`;
}

export async function getRegistrationWindow(): Promise<string> {
  const response = await client.get<ApiResponse<number>>("/config/registration-window");
  
  const seconds = response.data;
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `Registration window: **${days} day(s)** (${hours} hours) before the meal.`;
  }
  return `Registration window: **${hours} hour(s)** before the meal.`;
}

export async function getCancellationWindow(): Promise<string> {
  const response = await client.get<ApiResponse<number>>("/config/cancellation-window");
  
  const seconds = response.data;
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `Cancellation window: **${days} day(s)** (${hours} hours) before the meal.`;
  }
  return `Cancellation window: **${hours} hour(s)** before the meal.`;
}

export async function getMaxCancellations(meal: Meal): Promise<string> {
  const response = await client.get<ApiResponse<number>>("/config/max-cancellations", { meal });
  
  const max = response.data;
  return `Maximum cancellations for ${meal}: **${max}** per month.`;
}

export async function getRegistrationMaxDate(): Promise<string> {
  const response = await client.get<ApiResponse<string>>("/config/registration-max-date");
  
  const maxDate = response.data;
  return `You can register for meals up to **${maxDate}**.`;
}
