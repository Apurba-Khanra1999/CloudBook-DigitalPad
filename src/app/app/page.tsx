import { CloudBookApp } from "@/components/cloud-book-app";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

export default async function AppPage() {
  // Check Neon Auth (Stack) session first
  const stackUser = await stackServerApp.getUser({ or: "return-null" });

  // Fallback to existing JWT cookie session if Neon Auth not present
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifySession(token) : null;

  if (!stackUser && !payload) {
    redirect("/handler/sign-in");
  }
  const userJson = stackUser?.toClientJson();
  const userForCloudBook = userJson
    ? {
        displayName: userJson.display_name ?? undefined,
        primaryEmail: userJson.primary_email ?? undefined,
        profileImageUrl: userJson.profile_image_url ?? undefined,
      }
    : undefined;
  return <CloudBookApp user={userForCloudBook} />;
}