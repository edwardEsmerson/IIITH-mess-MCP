// Mess information tools

import { client } from "../client.js";
import type { ApiResponse, MessInfo, MealTiming } from "../types.js";

export async function getMessInfo(): Promise<string> {
  const response = await client.get<ApiResponse<MessInfo[]>>("/mess/info");
  
  const messes = response.data;
  if (!messes || messes.length === 0) {
    return "No mess information available.";
  }

  const lines = messes.map((m) => {
    const status = m.open ? "🟢 Open" : "🔴 Closed";
    return `• **${m.name}** (${m.id}) - ${status}`;
  });

  return `## Available Messes\n\n${lines.join("\n")}`;
}

export async function getMenu(date?: string): Promise<string> {
  const params: Record<string, string> = {};
  if (date) params.on = date;

  const response = await client.get<ApiResponse<any[]>>("/mess/menus", params);
  
  const menus = response.data;
  if (!menus || menus.length === 0) {
    return "No menu available for this date.";
  }

  const lines: string[] = [];
  const dateStr = date || new Date().toISOString().split("T")[0];
  lines.push(`## Menu for ${dateStr}\n`);

  // Get day name (API uses lowercase)
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayOfWeek = dayNames[new Date(dateStr).getDay()];

  for (const messMenu of menus) {
    lines.push(`### ${messMenu.mess}`);
    
    if (messMenu.days && messMenu.days[dayOfWeek]) {
      const todayMenu = messMenu.days[dayOfWeek];
      
      for (const meal of ["breakfast", "lunch", "snacks", "dinner"]) {
        if (todayMenu[meal] && Array.isArray(todayMenu[meal])) {
          // Extract item names from the array of {item, category} objects
          const items = todayMenu[meal]
            .filter((i: any) => i.item && i.item.trim() !== "")
            .map((i: any) => i.item.trim())
            .join(", ");
          
          if (items) {
            lines.push(`  **${meal.charAt(0).toUpperCase() + meal.slice(1)}**: ${items}`);
          }
        }
      }
    } else {
      lines.push("  Menu not available for this day");
    }
    lines.push("");
  }

  return lines.join("\n");
}

export async function getMealRates(meal: string, date?: string): Promise<string> {
  const params: Record<string, string> = { meal };
  if (date) params.on = date;

  const response = await client.get<ApiResponse<Record<string, any[]>>>("/mess/rates", params);
  
  const rates = response.data;
  if (!rates) {
    return "No rates available.";
  }

  const lines: string[] = [];
  lines.push(`## ${meal.charAt(0).toUpperCase() + meal.slice(1)} Rates\n`);

  for (const [category, messRates] of Object.entries(rates)) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    for (const rate of messRates) {
      const priceInRupees = (rate.rate / 100).toFixed(2);
      lines.push(`  • ${rate.mess}: ₹${priceInRupees}`);
    }
  }

  return lines.join("\n");
}

export async function getMealCapacities(meal: string, date?: string): Promise<string> {
  const params: Record<string, string> = { meal };
  if (date) params.on = date;

  const response = await client.get<ApiResponse<Record<string, any[]>>>("/mess/capacities", params);
  
  const capacities = response.data;
  if (!capacities) {
    return "No capacity information available.";
  }

  const lines: string[] = [];
  lines.push(`## ${meal.charAt(0).toUpperCase() + meal.slice(1)} Capacities\n`);

  for (const [category, messCapacities] of Object.entries(capacities)) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    for (const cap of messCapacities) {
      const percentage = Math.round((cap.available / cap.capacity) * 100);
      lines.push(`  • ${cap.mess}: ${cap.available}/${cap.capacity} available (${percentage}%)`);
    }
  }

  return lines.join("\n");
}

export async function getMealTimings(date?: string): Promise<string> {
  const params: Record<string, string> = {};
  if (date) params.on = date;

  const response = await client.get<ApiResponse<Record<string, MealTiming[]>>>("/config/meal-timings", params);
  
  const timings = response.data;
  if (!timings) {
    return "No meal timings available.";
  }

  const lines: string[] = [];
  lines.push("## Meal Timings\n");

  for (const [mess, mealTimings] of Object.entries(timings)) {
    lines.push(`### ${mess}`);
    for (const timing of mealTimings) {
      lines.push(`  • ${timing.meal}: ${timing.start_time} - ${timing.end_time}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
