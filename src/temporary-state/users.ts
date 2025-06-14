import { User } from "@/types";

export const users: User[] = [
  {
    id: "u-001",
    name: "Harshith",
    email: "harshith@example.com",
    role: "manager",
    isCurrentUser: true,
  },
  {
    id: "u-002",
    name: "Alice",
    email: "alice@example.com",
    role: "developer",
    isCurrentUser: false,
  },
  {
    id: "u-003",
    name: "Bob",
    email: "bob@example.com",
    role: "developer",
    isCurrentUser: false,
  },
];