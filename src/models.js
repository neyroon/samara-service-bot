import { DB } from "./db.js";
import { DataTypes } from "sequelize";

export const UserModel = DB.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  chatId: { type: DataTypes.STRING, unique: true },
});

export const ClientModel = DB.define("client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  phone: { type: DataTypes.STRING, unique: true },
  type: { type: DataTypes.STRING, unique: true },
  fault: { type: DataTypes.STRING, unique: true },
  city: { type: DataTypes.STRING, unique: true },
});
