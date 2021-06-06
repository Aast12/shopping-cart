import { DocumentType } from "@typegoose/typegoose";
import { User } from "./models/User";

export type UserToken = Pick<DocumentType<User>, 'email' | 'id' | 'role'>;