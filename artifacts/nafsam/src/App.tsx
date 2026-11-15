import { useEffect, useState } from "react";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import { fetchSession, type SessionStatus } from "@/lib/auth";
import { startSmoothScroll } from "@/lib/smoothScroll";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Noise from "@/components/reactbits/Noise";

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

  let view = null;
  if (state.phase === "anon") {
    view = <Login onAuth={() => setState({ phase: "authed", openAt: state.openAt })} />;
  } else if (state.phase === "authed") {
    view = (
      <Home
        openAt={state.openAt}
        onLogout={() => setState({ phase: "anon", openAt: state.openAt })}
      />
    );
  }

  return (
    <ClickSpark sparkColor="#b9d3e6" sparkCount={10} sparkRadius={22} duration={500}>
      <Noise opacity={0.05} fixed />
      {view}
    </ClickSpark>
  );
}
