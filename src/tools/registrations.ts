// Registration tools

import { client } from "../client.js";
import type { ApiResponse, MealRegistration, Meal } from "../types.js";

export async function getRegistrations(from: string, to: string): Promise<string> {
  const response = await client.get<ApiResponse<MealRegistration[]>>("/registrations", { from, to });
  
  const registrations = response.data;
  if (!registrations || registrations.length === 0) {
    return `No registrations found between ${from} and ${to}.`;
  }

  // Group by date
  const byDate: Record<string, MealRegistration[]> = {};
  for (const reg of registrations) {
    if (!byDate[reg.meal_date]) {
      byDate[reg.meal_date] = [];
    }
    byDate[reg.meal_date].push(reg);
  }

  const lines: string[] = [];
  lines.push(`## Registrations (${from} to ${to})\n`);

  const sortedDates = Object.keys(byDate).sort();
  for (const date of sortedDates) {
    lines.push(`### ${date}`);
    for (const reg of byDate[date]) {
      let status = "✅ Registered";
      if (reg.cancelled_at) {
        status = "❌ Cancelled";
      } else if (reg.availed_at) {
        status = "🍽️ Availed";
      }
      lines.push(`  • **${reg.meal_type}** at ${reg.meal_mess} - ${status}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export async function getRegistration(meal?: string, date?: string): Promise<string> {
  const params: Record<string, string> = {};
  if (meal) params.meal = meal;
  if (date) params.date = date;

  const response = await client.get<ApiResponse<MealRegistration | Record<string, MealRegistration>>>("/registration", params);
  
  const data = response.data;
  if (!data) {
    return "No registration found.";
  }

  const dateStr = date || new Date().toISOString().split("T")[0];

  // If meal was specified, we get a single registration
  if (meal) {
    const reg = data as MealRegistration;
    let status = "✅ Registered";
    if (reg.cancelled_at) status = "❌ Cancelled";
    else if (reg.availed_at) status = "🍽️ Availed";
    
    return `**${reg.meal_type}** on ${reg.meal_date} at ${reg.meal_mess} - ${status}`;
  }

  // Otherwise, we get an object with meal types as keys
  const regs = data as Record<string, MealRegistration>;
  const lines: string[] = [];
  lines.push(`## Registrations for ${dateStr}\n`);

  for (const [mealType, reg] of Object.entries(regs)) {
    let status = "✅ Registered";
    if (reg.cancelled_at) status = "❌ Cancelled";
    else if (reg.availed_at) status = "🍽️ Availed";
    
    lines.push(`• **${mealType}** at ${reg.meal_mess} - ${status}`);
  }

  return lines.join("\n");
}

export async function registerMeal(
  mealDate: string,
  mealType: Meal,
  mealMess: string,
  guests?: number
): Promise<string> {
  const body: Record<string, unknown> = {
    meal_date: mealDate,
    meal_type: mealType,
    meal_mess: mealMess,
  };
  if (guests !== undefined) {
    body.guests = guests;
  }

  const response = await client.post<ApiResponse<MealRegistration> | {}>("/registrations", body);
  
  // 204 returns empty object
  if (!("data" in response)) {
    return `Already registered for ${mealType} on ${mealDate} at ${mealMess}.`;
  }

  const reg = (response as ApiResponse<MealRegistration>).data;
  return `✅ Successfully registered for **${mealType}** on ${mealDate} at **${mealMess}**.`;
}

export async function cancelMeal(mealDate: string, mealType: Meal): Promise<string> {
  await client.post("/registrations/cancel", {
    meal_date: mealDate,
    meal_type: mealType,
  });

  return `❌ Cancelled ${mealType} on ${mealDate}.`;
}

export async function uncancelMeal(mealDate: string, mealType: Meal): Promise<string> {
  await client.post("/registrations/uncancel", {
    meal_date: mealDate,
    meal_type: mealType,
  });

  return `✅ Uncancelled ${mealType} on ${mealDate}. You are now registered again.`;
}

export async function skipMeal(
  mealDate: string,
  mealType: Meal,
  mealMess: string,
  skipping: boolean = true
): Promise<string> {
  await client.post("/registrations/skipping", {
    meal_date: mealDate,
    meal_type: mealType,
    meal_mess: mealMess,
    skipping,
  });

  if (skipping) {
    return `⏭️ Marked ${mealType} on ${mealDate} as skipped. Note: You will still be charged.`;
  } else {
    return `✅ Unmarked ${mealType} on ${mealDate} as skipped.`;
  }
}

export async function getCancellationCount(meal: Meal, month?: number, year?: number): Promise<string> {
  const params: Record<string, string> = { meal };
  if (month !== undefined) params.month = month.toString();
  if (year !== undefined) params.year = year.toString();

  const response = await client.get<ApiResponse<number>>("/registrations/cancellations", params);
  
  const count = response.data;
  const monthName = month 
    ? new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })
    : new Date().toLocaleString("default", { month: "long" });

  return `You have used **${count}** cancellation(s) for ${meal} in ${monthName}.`;
}
