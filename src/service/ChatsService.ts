import { POCKET } from "./PocketBase";

export interface Message {
  author: string;
  message: string;
  created: number;
}

export interface Chat {
  id: string;
  first: string;
  firstName: string;
  second: string;
  secondName: string;
  messages: Message[];
}

export async function createChat(first: string, firstName: string, second: string, secondName: string): Promise<Chat> {
  return await POCKET
    .collection("chats")
    .create<Chat>({
      first,
      firstName,
      second,
      secondName,
      messages: []
    });
}

export async function updateChat(id: string, messages: Message[]) {
  return await POCKET.collection("chats").update(id, {
    messages
  });
}

export async function getUserChats(link: string): Promise<Chat[]> {
  const result = await POCKET
    .collection("chats")
    .getList<Chat>(1, 50, {
      filter: `first='${link}' || second='${link}'`
    });
  return result.items;
}

export async function getChat(id: string) {
  return await POCKET
    .collection("chats")
    .getOne(id);
}

export function getChatName(chat: Chat, link: string) {
  const name = (chat.first === link) ? chat.secondName : chat.firstName;
  return name[0].toUpperCase();
}