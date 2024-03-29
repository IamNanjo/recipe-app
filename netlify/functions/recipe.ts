import dotenv from "dotenv";
import axios from "axios";

import type { Handler, HandlerResponse } from "@netlify/functions";

dotenv.config();

export interface RecipeResponse {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  lowFodmap: boolean;
  ketogenic: boolean;
  whole30: boolean;
  servings: number;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  aggregateLikes: number;
  creditText: string;
  sourceName: string;
  extendedIngredients: ExtendedIngredient[];
  id: number;
  title: string;
  readyInMinutes: number;
  image: string;
  imageType: string;
  instructions: string;
}

export interface ExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  name: string;
  amount: number;
  unit: string;
  unitShort: string;
  unitLong: string;
  originalString: string;
  metaInformation: string[];
}

const API_KEY = process.env.SPOONACULAR_API_KEY;
if (!API_KEY) throw new Error("SPOONACULAR_API_KEY not set");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler: Handler = async (request, _context) => {
  try {
    const id = request.queryStringParameters?.id;

    if (!id) return { statusCode: 400 };

    const query = `id=${id}&apiKey=${API_KEY}`;

    return axios
      .get(`https://api.spoonacular.com/recipes/${id}/information?${query}`)
      .then((res) => {
        return {
          statusCode: res.status,
          body: JSON.stringify(res.data),
          headers: res.headers,
        };
      })
      .catch((err) => {
        console.error(err);
        return {
          statusCode: 400,
        };
      }) as Promise<HandlerResponse>;
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};

export { handler };
