import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export type User = {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getDbPath = () => {
  const devPath = path.resolve(__dirname, '../db/users.json');
  const prodPath = path.resolve(__dirname, '../../db/users.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

const __filePath = getDbPath();

export const readUsersData = async (): Promise<User[]> => {
  try {
    const users = await fs.readFile(__filePath, 'utf-8');
    return JSON.parse(users);
  } catch (error) {
    console.log('Error reading from users db', error);
    return [];
  }
};

export const writeUsersData = async (user: object) => {
  try {
    const toString = JSON.stringify(user, null, 2);
    await fs.writeFile(__filePath, toString, 'utf-8');
  } catch (error) {
    console.log('Error writing inside users db', error);
  }
};
