export class User {
  id: number;
  name: string;
  email: string;
  password: string;

  constructor({ email, name, password, id }: User) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.id = id;
  }
}
