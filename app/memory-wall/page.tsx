"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { SectionHeading } from "@/components/SectionHeading";
import { Card } from "@/components/Card";
import { MemoryWallForm } from "@/components/MemoryWallForm";
import { ScrollFade } from "@/components/ScrollFade";
import { BackButton } from "@/components/BackButton";
import { MemoryWallMessage } from "@/lib/types";

export default function MemoryWallPage() {
  const [messages, setMessages] = useState<MemoryWallMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from("memory_wall")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    setMessages((data as MemoryWallMessage[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <BackButton />
      <SectionHeading subtitle="Words from those who love this class">
        Memory Wall
      </SectionHeading>

      <div className="mb-10">
        <MemoryWallForm onSubmitted={loadMessages} />
      </div>

      {loading ? (
        <p className="font-body text-muted text-center">Loading messages...</p>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <ScrollFade key={msg.id} delay={i * 60}>
              <Card className="border-l-4 border-accent">
                <p className="font-body text-ink mb-2">{msg.message}</p>
                <p className="font-body text-sm text-muted">— {msg.author_name}</p>
              </Card>
            </ScrollFade>
          ))}
        </div>
      ) : (
        <p className="font-body text-muted text-center">
          Be the first to leave a message.
        </p>
      )}
    </main>
  );
}
