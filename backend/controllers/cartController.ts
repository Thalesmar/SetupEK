import fs from 'fs/promises';
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __filePath = path.join(__dirname, '../db/cart.json');


export const readFromCart = async() => {
  try{
    const cartData = await fs.readFile(__filePath, 'utf-8');
    return JSON.parse(cartData);
  }catch(error){
    console.log(error, 'Error reading cart.json');
  }
}

export const writeToCart = async (item: object) => {
  try{
    const cartToString = JSON.stringify(item, null, 2);
    await fs.writeFile(__filePath, cartToString, 'utf-8');
  }catch(error){
    console.log(error, 'Error writing to cart.json');
  }
}