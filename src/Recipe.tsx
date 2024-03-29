import { useLoaderData, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import AlertError from "@/components/AlertError";

import type { RecipeResponse } from "@/../netlify/functions/recipe";
export default function Recipe() {
  const recipe = useLoaderData() as RecipeResponse;

  if (!recipe) {
    const currentDate = new Date();
    const hoursUntilAPIReset = 24 - currentDate.getUTCHours();
    const minutesUntilAPIReset = 60 - currentDate.getUTCMinutes();

    return (
      <AlertError
        className="max-w-96 mx-auto"
        description={`Could not get recipes.
          This could be due to the daily limit being reached (150 requests).
          Please try again in ${hoursUntilAPIReset} hours and ${minutesUntilAPIReset} minutes.`}
      />
    );
  }

  const recipeSourceOrigin = new URL(recipe.sourceUrl).host;

  const diets = {
    V: {
      longName: "Vegetarian",
      color: "#4CAF50",
      hasBadge: recipe.vegetarian,
    },
    VG: { longName: "Vegan", color: "#FF4081", hasBadge: recipe.vegan },
    GF: {
      longName: "Gluten-free",
      color: "#2196F3",
      hasBadge: recipe.glutenFree,
    },
    DF: {
      longName: "Dairy-free",
      color: "#FF9800",
      hasBadge: recipe.dairyFree,
    },
    VH: {
      longName: "Very Healthy",
      color: "#8BC34A",
      hasBadge: recipe.veryHealthy,
    },
    CH: { longName: "Cheap", color: "#FFC107", hasBadge: recipe.cheap },
    S: {
      longName: "Sustainable",
      color: "#9C27B0",
      hasBadge: recipe.sustainable,
    },
    LF: {
      longName: "Low FODMAP",
      color: "#E91E63",
      hasBadge: recipe.lowFodmap,
    },
    K: { longName: "Ketogenic", color: "#795548", hasBadge: recipe.ketogenic },
    W30: { longName: "Whole30", color: "#00BCD4", hasBadge: recipe.whole30 },
  };

  const dietBadges: JSX.Element[] = [];

  for (const [key, value] of Object.entries(diets)) {
    if (!value.hasBadge) continue;

    const el = (
      <Tooltip key={`badge-${key}`} delayDuration={200}>
        <TooltipTrigger className="cursor-default">
          <Badge
            style={{
              backgroundColor: value.color,
              color: "white",
              fontWeight: 700,
              textShadow: "0 0 6px black",
            }}
          >
            {key}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{value.longName}</TooltipContent>
      </Tooltip>
    );
    dietBadges.push(el);
  }

  return (
    <main className="flex flex-col justify-center items-center gap-4 p-4">
      <Card className="w-full max-w-[40rem]">
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription className="flex flex-wrap gap-2 pt-2">
            <TooltipProvider>{dietBadges}</TooltipProvider>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img className="max-w-full mx-auto" src={recipe.image} />
          <Accordion className="my-5" type="multiple">
            {!!recipe.extendedIngredients &&
              !!recipe.extendedIngredients.length && (
                <AccordionItem value="Ingredients">
                  <AccordionTrigger>Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="w-full">
                      <Table>
                        <TableCaption className="sr-only">
                          List of ingredients
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ingredient</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Unit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recipe.extendedIngredients.map((ingredient) => (
                            <TableRow key={`ingredient-${ingredient.id}`}>
                              <TableCell className="capitalize">
                                {ingredient.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {ingredient.amount}
                              </TableCell>
                              <TableCell>
                                {ingredient.unitShort || ingredient.unit}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              )}
            {!!recipe.instructions && (
              <AccordionItem value="Instructions">
                <AccordionTrigger>Instructions</AccordionTrigger>
                <AccordionContent>
                  {recipe.instructions.replace(/<\/?[^>]+(>|$)/gi, "")}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link to={recipe.sourceUrl} target="_blank">
              Full recipe on {recipeSourceOrigin}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
