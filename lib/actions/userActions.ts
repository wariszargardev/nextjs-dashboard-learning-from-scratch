// lib/actions/userActions.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server actions backing the dashboard's user forms. Mirrors the validation
// already done in lib/controllers/userController.ts, but calls the service
// directly since the dashboard renders on the server.
// ─────────────────────────────────────────────────────────────────────────────

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as userService from "@/lib/services/userService";
import { logger } from "@/lib/logger";
import { UserRole } from "@/lib/models/user";

export async function createUserAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const roleValue = String(formData.get("role") ?? "");
  const role = (roleValue as UserRole) || undefined;

  if (!name) {
    redirect(`/dashboard/users/new?error=${encodeURIComponent("Name is required")}`);
  }
  if (!email || !email.includes("@")) {
    redirect(`/dashboard/users/new?error=${encodeURIComponent("A valid email is required")}`);
  }

  try {
    const user = await userService.createUser({ name, email, role });
    logger.info("action:createUser", "User created", { id: user.id });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      logger.warn("action:createUser", "Rejected duplicate email", { email });
      redirect(`/dashboard/users/new?error=${encodeURIComponent("Email already in use")}`);
    }
    logger.error("action:createUser", "Failed to create user", error);
    redirect(`/dashboard/users/new?error=${encodeURIComponent("Something went wrong")}`);
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}
