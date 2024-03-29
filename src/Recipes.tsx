import { useLoaderData, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AlertError from "@/components/AlertError";

import type { RecipesResponse } from "@/../netlify/functions/recipes";

export default function Recipes() {
  const location = useLocation();
  const recipesResponse = useLoaderData() as RecipesResponse | null;
  const recipes = recipesResponse?.results;
  const recipesExist = recipes && recipes.length;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))] gap-3 w-full max-w-[90rem]">
      {!!recipesExist &&
        recipes.map((recipe) => (
          <Card className="flex flex-col justify-stretch">
            <CardHeader className="flex-grow flex justify-center">
              <CardTitle className="align-middle">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-end items-center gap-3">
              <img
                className="w-full h-48 object-cover"
                src={recipe.image}
                height={192}
              />
              <Button asChild className="w-full">
                <Link to={`/recipes/${recipe.id}${location.search}`}>
                  View details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      {!recipesExist && (
        <AlertError
          className="max-w-96 mx-auto"
          description="No recipes found"
        />
      )}
    </div>
  );
}
