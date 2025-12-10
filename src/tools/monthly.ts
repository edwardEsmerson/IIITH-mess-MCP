// Monthly registration tools

import { client } from "../client.js";
import type { ApiResponse, MonthlyRegistration } from "../types.js";

export async function getMonthlyRegistration(month?: number, year?: number): Promise<string> {
  const params: Record<string, string> = {};
  if (month !== undefined) params.month = month.toString();
  if (year !== undefined) params.year = year.toString();

  const response = await client.get<ApiResponse<{ registration: MonthlyRegistration; snack_availments: any[] }>>("/registrations/monthly", params);
  
  const data = response.data;
  if (!data || !data.registration) {
    const monthName = month 
      ? new Date(year || new Date().getFullYear(), month - 1, 1).toLocaleString("default", { month: "long" })
      : new Date().toLocaleString("default", { month: "long" });
    return `No monthly registration found for ${monthName}.`;
  }

  const reg = data.registration;
  const monthName = new Date(reg.year, reg.month - 1, 1).toLocaleString("default", { month: "long" });

  const lines: string[] = [];
  lines.push(`## Monthly Registration for ${monthName} ${reg.year}\n`);
  lines.push(`• **Mess**: ${reg.meal_mess}`);
  lines.push(`• **ID**: ${reg.id}`);
  
  if (data.snack_availments && data.snack_availments.length > 0) {
    lines.push(`\n### Snack Availments: ${data.snack_availments.length}`);
  }

  return lines.join("\n");
}

export async function createMonthlyRegistration(
  month: number,
  year: number,
  mess: string
): Promise<string> {
  const response = await client.post<ApiResponse<MonthlyRegistration>>("/registrations/monthly", {
    month,
    year,
    mess,
  });

  const reg = response.data;
  const monthName = new Date(year, month - 1, 1).toLocaleString("default", { month: "long" });

  return `✅ Created monthly registration for **${monthName} ${year}** at **${mess}**.`;
}

export async function deleteMonthlyRegistration(month: number, year: number): Promise<string> {
  await client.delete("/registrations/monthly", {
    month: month.toString(),
    year: year.toString(),
  });

  const monthName = new Date(year, month - 1, 1).toLocaleString("default", { month: "long" });

  return `✅ Deleted monthly registration for ${monthName} ${year}.`;
}
