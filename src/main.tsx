import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  type LoaderFunction,
} from "react-router-dom";
import axios from "axios";

import ThemeProvider from "@/components/ThemeProvider";

import Layout from "@/Layout.tsx";
import App from "@/App.tsx";

import Recipes from "@/Recipes";
import Recipe from "@/Recipe";

import AlertError from "@/components/AlertError";

import "@/global.css";

const recipesLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  return axios
    .get(`/.netlify/functions/recipes${url.search}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

const recipeLoader: LoaderFunction = async ({ params }) => {
  return axios
    .get(`/.netlify/functions/recipe?id=${params.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<App />}>
        <Route
          path="/recipes"
          element={<Recipes />}
          loader={recipesLoader}
          errorElement={<AlertError description="Recipe loading failed" />}
        />
      </Route>
      <Route
        path="/recipes/:id"
        element={<Recipe />}
        loader={recipeLoader}
        errorElement={
          <main className="flex flex-col justify-center items-center p-4">
            <AlertError description="Recipe loading failed" />
          </main>
        }
      />
      <Route
        path="*"
        element={
          <main className="flex flex-col justify-center items-center p-4">
            <AlertError description="This route does not exist" />
          </main>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
