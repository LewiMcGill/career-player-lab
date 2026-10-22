
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const KEY = "career-player-lab-online-v1";
const ROW = "career-player-lab-main";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Menghubungkan database...");
  const [cloud, setCloud] = useState(false);

  const client = useRef<SupabaseClient | null>(null);
  const last = useRef("");
  const busy = useRef(false);

  const local = useCallback(() => {
    try {
      return localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  }, []);

  // Sambungkan database dan muat data awal satu kali.
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      setStatus("Database belum dikonfigurasi");
      setReady(true);
      return;
    }

    const db = createClient(url, key);
    client.current = db;
    let live = true;

    async function initialize() {
      try {
        const { data, error } = await db
          .from("career_player_lab_state")
          .select("id, state, updated_at")
          .eq("id", ROW)
          .maybeSingle();

        if (error) throw error;

        if (data?.state) {
          const remote = JSON.stringify(data.state);

          // Gunakan data cloud saat halaman pertama kali dibuka.
          localStorage.setItem(KEY, remote);
          last.current = remote;
        } else {
          const current = local();

          if (current) {
            const { error: insertError } = await db
              .from("career_player_lab_state")
              .upsert(
                {
                  id: ROW,
                  state: JSON.parse(current),
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "id" }
              );

            if (insertError) throw insertError;
            last.current = current;
          }
        }

        if (live) {
          setCloud(true);
          setStatus("Database online tersambung");
          setReady(true);
        }
      } catch (error) {
        console.error("Inisialisasi Supabase gagal:", error);

        if (live) {
          setStatus("Gagal terhubung. Periksa konfigurasi Supabase.");
          setReady(true);
        }
      }
    }

    void initialize();

    return () => {
      live = false;
    };
  }, [local]);

  // Kirim perubahan lokal ke cloud tanpa reload halaman.
  useEffect(() => {
    if (!ready || !cloud || !client.current) return;

    const db = client.current;

    const timer = window.setInterval(async () => {
      if (busy.current) return;

      const current = local();

      // Tidak ada perubahan, tidak perlu menulis ke database.
      if (!current || current === last.current) return;

      busy.current = true;

      try {
        const { error } = await db
          .from("career_player_lab_state")
          .upsert(
            {
              id: ROW,
              state: JSON.parse(current),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (error) throw error;

        last.current = current;
        setStatus(
          "Tersimpan online · " +
            new Date().toLocaleTimeString("id-ID")
        );
      } catch (error) {
        console.error("Sinkronisasi Supabase gagal:", error);
        setStatus("Sinkronisasi gagal");
      } finally {
        busy.current = false;
      }
    }, 2500);

    return () => window.clearInterval(timer);
  }, [ready, cloud, local]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "9px 16px",
          background: "#111720",
          borderBottom: "1px solid #293343",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          fontSize: 12,
        }}
      >
        <strong style={{ color: "#b8f45c" }}>
          CAREER PLAYER LAB
        </strong>

        <span style={{ color: "#93a1b5", textAlign: "right" }}>
          {status}
        </span>
      </div>

      {!ready ? (
        <p style={{ padding: 24 }}>Menyiapkan Career Save...</p>
      ) : (
        <iframe
          title="Career Player Lab"
          src="/career.html"
          style={{
            border: 0,
            width: "100%",
            height: "calc(100vh - 39px)",
            minHeight: 700,
            flex: 1,
          }}
        />
      )}
    </main>
  );
}
