import { useState, type FormEvent } from "react";
import { login } from "@/lib/auth";
import SplitWords from "@/components/SplitWords";
import SpotlightCard from "@/components/SpotlightCard";
import Magnet from "@/components/reactbits/Magnet";

interface LoginProps {
  onAuth: () => void;
}

const MESSAGES: Record<string, string> = {
  wrong: "الجواب غير صحيح، حاول مرة أخرى.",
  closed: "هذا المكان ما زال مغلقاً، ينتظر وقته.",
  rate_limited: "محاولات كثيرة، انتظر قليلاً ثم أعد المحاولة.",
  network: "تعذّر الاتصال، تحقق من الشبكة.",
};

export default function Login({ onAuth }: LoginProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || busy) return;
    setBusy(true);
    setError(null);
    const result = await login(answer);
    setBusy(false);
    if (result.ok) {
      onAuth();
    } else {
      setError(MESSAGES[result.reason] ?? MESSAGES.wrong);
    }
  };

  return (
    <section className="login-stage">
      <SpotlightCard className="login-card">
        <p className="kicker">أرشيف خاص</p>
        <h1 className="login-title">
          <SplitWords text="ادخل بكلمة السر" />
        </h1>
        <form onSubmit={submit} className="login-form">
          <input
            className="login-input"
            type="password"
            autoComplete="off"
            placeholder="الجواب"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            aria-label="الجواب"
          />
          <Magnet padding={30} magnetStrength={2}>
            <button className="login-button" type="submit" disabled={busy || !answer.trim()}>
              {busy ? "..." : "دخول"}
            </button>
          </Magnet>
        </form>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
      </SpotlightCard>
    </section>
  );
}
