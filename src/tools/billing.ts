// Billing and feedback tools

import { client } from "../client.js";
import type { ApiResponse, Bill, MealRating, Meal } from "../types.js";

export async function getBill(month?: number, year?: number): Promise<string> {
  const params: Record<string, string> = {};
  if (month !== undefined) params.month = month.toString();
  if (year !== undefined) params.year = year.toString();

  const response = await client.get<ApiResponse<Bill>>("/registrations/bill", params);
  
  const bill = response.data;
  if (!bill) {
    return "No bill information available for this month.";
  }

  const nonProjectedRupees = (bill.non_projected / 100).toFixed(2);
  const projectedRupees = (bill.projected / 100).toFixed(2);
  const totalRupees = ((bill.non_projected + bill.projected) / 100).toFixed(2);

  const monthName = month 
    ? new Date(year || new Date().getFullYear(), month - 1, 1).toLocaleString("default", { month: "long" })
    : new Date().toLocaleString("default", { month: "long" });
  const yearStr = year || new Date().getFullYear();

  const lines: string[] = [];
  lines.push(`## Mess Bill for ${monthName} ${yearStr}\n`);
  lines.push(`• **Confirmed (Availed)**: ₹${nonProjectedRupees}`);
  lines.push(`• **Projected (Upcoming)**: ₹${projectedRupees}`);
  lines.push(`• **Total**: ₹${totalRupees}`);

  return lines.join("\n");
}

export async function submitFeedback(
  mealDate: string,
  mealType: Meal,
  rating: number,
  remarks?: string
): Promise<string> {
  const body: Record<string, unknown> = {
    meal_date: mealDate,
    meal_type: mealType,
    rating,
  };
  if (remarks) {
    body.remarks = remarks;
  }

  await client.post("/registrations/feedback", body);
  
  const stars = "⭐".repeat(rating);
  return `✅ Feedback submitted for ${mealType} on ${mealDate}: ${stars} (${rating}/5)${remarks ? `\nRemarks: "${remarks}"` : ""}`;
}

export async function getMealRating(
  meal: Meal,
  date?: string,
  mess?: string
): Promise<string> {
  const params: Record<string, string> = { meal };
  if (date) params.date = date;
  if (mess) params.mess = mess;

  const response = await client.get<ApiResponse<MealRating | Record<string, MealRating>>>("/registration/rating", params);
  
  const data = response.data;
  if (!data) {
    return "No ratings available for this meal.";
  }

  const dateStr = date || new Date().toISOString().split("T")[0];

  // If mess was specified, we get a single rating
  if (mess) {
    const rating = data as MealRating;
    const stars = "⭐".repeat(Math.round(rating.rating));
    return `${meal} at ${mess} on ${dateStr}: ${stars} ${rating.rating.toFixed(1)}/5 (${rating.count} ratings)`;
  }

  // Otherwise, we get ratings per mess
  const ratings = data as Record<string, MealRating>;
  const lines: string[] = [];
  lines.push(`## ${meal.charAt(0).toUpperCase() + meal.slice(1)} Ratings for ${dateStr}\n`);

  for (const [messId, rating] of Object.entries(ratings)) {
    const stars = "⭐".repeat(Math.round(rating.rating));
    lines.push(`• ${messId}: ${stars} ${rating.rating.toFixed(1)}/5 (${rating.count} ratings)`);
  }

  return lines.join("\n");
}
