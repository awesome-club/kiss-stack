import { Show, createSignal } from "solid-js";
import "./StartForm.scss";
import { loginWithPass, registerWithPass } from "../service/UsersService";

export default function StartForm() {
  const [view, setView] = createSignal<"log" | "reg">("log");
  const [name, setName] = createSignal("");
  const [mail, setMail] = createSignal("");
  const [pass, setPass] = createSignal("");
  const [err, setErr] = createSignal(false);

  async function login(ev: Event) {
    ev.preventDefault();
    setErr(false);
    try {
      await loginWithPass(mail(), pass());
      window.location.href = "/chat";
    } catch (err: any) {
      console.error(err);
      if (err.response?.code === 400) {
        setErr(err.response?.data?.password?.message ?? "Failed to login.")
      }
    }
  }

  async function register(ev: Event) {
    ev.preventDefault();
    setErr(false);
    try {
      await registerWithPass(mail(), pass(), name());
      window.location.href = "/chat";
    } catch (err: any) {
      if (err.response?.code === 400) {
        setErr(err.response?.data?.password?.message ?? "Failed to register.")
      }
    }
  }

  function toggleView() {
    setErr(false);
    setView(view() === "log" ? "reg" : "log");
  }

  return <section class="start-form">
    <form>
      <Show when={view() === "reg"}>
        <input placeholder="Your name" type="text" value={name()} onChange={ev => setName(ev.target.value)} />
      </Show>

      <input placeholder="Your email" type="email" value={mail()} onChange={ev => setMail(ev.target.value)} />
      <input placeholder="Your password" type="password" value={pass()} onChange={ev => setPass(ev.target.value)} />

      <Show when={!!err()}>
        <p class="err">{err()}</p>
      </Show>

      <footer>
        <Show when={view() === "log"}>
          <button class="btn" onClick={login}>Login</button>
          <p>New here? <a onClick={toggleView}>Register</a></p>
        </Show>
        
        <Show when={view() === "reg"}>
          <button class="btn" onClick={register}>Register</button>
          <p>Already registered? <a onClick={toggleView}>Login</a></p>
        </Show>
      </footer>
    </form>
  </section>
}