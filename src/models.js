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
