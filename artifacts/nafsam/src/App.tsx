import { useEffect, useState } from "react";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { fetchSession, type SessionStatus } from "@/lib/auth";
import { startSmoothScroll } from "@/lib/smoothScroll";

type State =
  | { phase: "checking" }
  | { phase: "anon"; openAt: number }
  | { phase: "authed"; openAt: number };

export default function App() {
  const [state, setState] = useState<State>({ phase: "checking" });

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    let alive = true;
    fetchSession().then((s: SessionStatus) => {
      if (!alive) return;
      setState({ phase: s.authed ? "authed" : "anon", openAt: s.openAt });
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state.phase === "checking") return null;

  if (state.phase === "anon") {
    return <Login onAuth={() => setState({ phase: "authed", openAt: state.openAt })} />;
  }

  return (
    <Home
      openAt={state.openAt}
      onLogout={() => setState({ phase: "anon", openAt: state.openAt })}
    />
  );
}
