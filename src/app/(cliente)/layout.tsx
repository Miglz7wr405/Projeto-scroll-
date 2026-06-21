import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return <div className="flex-1">{children}</div>;
}
