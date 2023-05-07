import { For, Show, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { findUser, isLink, isLogged, link, name } from "../service/UsersService";
import "./ChatApp.scss";
import { Chat, Message, createChat, getChatName, getUserChats, updateChat } from "../service/ChatsService";
import PaperPlane from "./PaperPlane";
import { POCKET } from "../service/PocketBase";

export default function ChatApp() {
  const [message, setMessage] = createSignal<string>("");
  const [chats, setChats] = createSignal<Chat[]>([]);
  const [active, setActive] = createSignal<Chat | null>(null);
  const [subId, setSubId] = createSignal<string>("");

  onMount(async () => {
    if (!isLogged()) {
      window.location.href = "/start";
      return;
    }
    setChats(await getUserChats(link()));
  });

  createEffect(() => {
    if (!active()) return;
    
    if (subId()) {
      POCKET.collection("chats").unsubscribe(subId());
    }
    setSubId(active()!.id);
    
    POCKET.collection("chats").subscribe<Chat>(subId(), ev => {
      setActive(ev.record);
    });
  });

  async function send() {
    if ((!active() || isLink(message())) && message() !== link()) {
      const user = await findUser(message());
      if (!!user) {
        const record = await createChat(link(), name(), user.link, user.name);
        setActive(record);
        setChats([...chats(), record]);
      }
    }
    
    if (!!active()) {
      const messages = [...active()!.messages, {
        message: message(),
        author: link(),
        created: new Date().getDate()
      }] as Message[];
      setActive({
        ...active()!,
        messages
      });
      updateChat(active()!.id, messages);
    }

    setMessage("");
  }

  function onKeyUp(ev: KeyboardEvent) {
    if (ev.key === "Enter") {
      send();
    }
  }

  return <section class="chat">
    <div>
      <aside>
        <ul>
          <For each={chats()}>{(chat, i) =>
          <li>
            <button class="bubble" onClick={() => setActive(chat)}>
              {getChatName(chat, link())}
            </button>
          </li>
        }</For>
        </ul>
      </aside>

      <main>
        <ul class="messages">
          <Show when={!!active()} fallback="No messages yet.">
            <For each={active()?.messages}>{message =>
              <li class={message.author === link() ? "from" : "to"}>
                <span>{message.message}</span>
              </li>
            }</For>
          </Show>
        </ul>
        <footer>
          <input 
            placeholder={active() ? "You message..." : "Enter a user link"} 
            value={message()}
            onChange={ev => setMessage(ev.target.value)}
            onKeyUp={onKeyUp}
            />
          <button class="btn" onClick={send}>
            <PaperPlane />
          </button>
        </footer>
      </main>
    </div>
  </section>
}