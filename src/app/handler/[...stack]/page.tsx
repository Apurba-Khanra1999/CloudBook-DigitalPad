import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function Handler({ params, searchParams }: { params: { stack?: string[] }; searchParams: any }) {
  const user = await stackServerApp.getUser({ or: "return-null" });
  const segments = params?.stack || [];
  const first = segments[0];
  const isAuthEntry = first === "sign-in" || first === "sign-up";

  if (user && isAuthEntry) {
    redirect("/app");
  }

  const routeProps = { params, searchParams };
  return <StackHandler app={stackServerApp} routeProps={routeProps} fullPage />;
}