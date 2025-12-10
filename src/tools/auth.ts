// Authentication and user tools

import { client } from "../client.js";
import type { ApiResponse, User } from "../types.js";

export async function getUserInfo(): Promise<string> {
  const response = await client.get<ApiResponse<User>>("/auth/me");
  
  const user = response.data;
  if (!user) {
    return "Could not retrieve user information. You may not be authenticated.";
  }

  const lines: string[] = [];
  lines.push("## Your Profile\n");
  lines.push(`• **Name**: ${user.name}`);
  lines.push(`• **ID**: ${user.id}`);
  if (user.roll_number) {
    lines.push(`• **Roll Number**: ${user.roll_number}`);
  }
  lines.push(`• **Email**: ${user.email}`);
  lines.push(`• **Last Login**: ${new Date(user.last_login_at).toLocaleString()}`);

  return lines.join("\n");
}

export async function resetQRToken(): Promise<string> {
  const response = await client.post<ApiResponse<{ token: string }>>("/auth/reset-token");
  
  return `✅ Your QR token has been reset. New token starts with: ${response.data.token.substring(0, 8)}...`;
}
