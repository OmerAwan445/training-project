export type User = { id: number; name: string; email: string; password: string };

export class UserStore {
  // starts with the one user you had
  static users: User[] = [
    { id: 1, name: "Muhammad Umer", email: "mumer.muzaffar@devsinc.com", password: "password123" }
  ];

  static findByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  static add(user: Omit<User, "id">) {
    const id = Date.now();
    const newUser: User = { id, ...user };
    this.users.push(newUser);
    return newUser;
  }
}