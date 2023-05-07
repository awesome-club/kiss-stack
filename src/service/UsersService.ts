import type { Record } from "pocketbase";
import { POCKET } from "./PocketBase";

export interface User {
  link: string;
  name: string;
}

export async function loginWithPass(mail: string, pass: string) {
  const resp = await POCKET.collection("users").authWithPassword(mail, pass);
  addInSorage(resp.record);
}

export async function registerWithPass(mail: string, pass: string, name: string) {
  const record =  await POCKET.collection("users").create({
    name,
    email: mail,
    emailVisibility: true,
    password: pass,
    passwordConfirm: pass,
    link: getUniqueId()
  });
  addInSorage(record);
}

export async function findUser(link: string): Promise<User | null> {
  const record =  await POCKET.collection("users").getList<User>(0, 1, {
    filter: `link='${link}'`
  });

  return (record.items.length > 0) ? record.items[0] : null;
}

export function logout() {
  window.localStorage.removeItem("uid");
}

export function isLogged() {
  return !!window.localStorage.getItem("uid");
}

function getUniqueId() {
  return "#hi" + Math.random().toString(16).slice(2)
}

export function link() {
  return window.localStorage.getItem("ulink") ?? "";
}

export function name() {
  return window.localStorage.getItem("uname") ?? "";
}

export function isLink(val: string) {
  return val.indexOf("#hi") === 0;
}

function addInSorage(user: Record) {
  window.localStorage.setItem("uid", user.id);
  window.localStorage.setItem("ulink", user.link);
  window.localStorage.setItem("uname", user.name);
}