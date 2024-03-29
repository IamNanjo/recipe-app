import dotenv from "dotenv";
import axios, { type AxiosError } from "axios";

import type { Handler, HandlerResponse } from "@netlify/functions";

dotenv.config();

export interface RecipesResponse {
  results: RecipeResult[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface RecipeResult {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

const API_KEY = process.env.SPOONACULAR_API_KEY;
if (!API_KEY) throw new Error("SPOONACULAR_API_KEY not set");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler: Handler = async (request, _context) => {
  try {
    const query = request.queryStringParameters;

    if (!query) return { statusCode: 400 };

    query.apiKey = API_KEY;
    query.number = "12";

    const queryEntries = Object.entries(query).filter(
      (i) => i[1] !== undefined
    );

    const queryParamString = queryEntries
      .map(
        (qParam) =>
          `${encodeURIComponent(qParam[0])}=${encodeURIComponent(qParam[1]!)}`
      )
      .join("&");

    return axios
      .get<RecipesResponse>(
        `https://api.spoonacular.com/recipes/complexSearch?${queryParamString}`
      )
      .then((res) => {
        return {
          statusCode: res.status,
          body: JSON.stringify(res.data),
          headers: res.headers,
        };
      })
      .catch((err: AxiosError) => {
        const statusCode =
          (err.response?.data as { code: number } | undefined)?.code || 400;

        return { statusCode };
      }) as Promise<HandlerResponse>;
  } catch (err) {
    return { statusCode: 500 };
  }
};

export { handler };
