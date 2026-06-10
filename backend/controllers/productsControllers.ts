import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __filePath = path.resolve(__dirname, '../../db/products.json');

export const readFromProducts = async(): Promise<Product[]> => {
  try{
    const products = await fs.readFile(__filePath, 'utf-8');
    return JSON.parse(products);
  }catch(error){
    console.log('Error reading from products db', error);
    return [];
  }
};

export const writeToProducts = async(products: Product[]) => {
  try{
    const toString = JSON.stringify(products, null, 2);
    return await fs.writeFile(__filePath, toString, 'utf-8');
  }catch(error){
    console.log('Error writing to products db', error);
    return [];
  }
}
