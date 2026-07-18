"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthorized(!!data.user);
      setChecked(true);
      if (!data.user) router.replace("/admin");
    });
  }, [router]);

  if (!checked) return null;
  if (!authorized) return null;

  return <>{children}</>;
}
