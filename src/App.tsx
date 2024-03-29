import { useState } from "react";
import {
  Outlet,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

import { type FormEventHandler } from "react";

const allDiets = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
] as const;

const allIntolerances = [
  "Dairy",
  "Egg",
  "Gluten",
  "Grain",
  "Peanut",
  "Seafood",
  "Sesame",
  "Shellfish",
  "Soy",
  "Sulfite",
  "Tree Nut",
  "Wheat",
] as const;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const [isOpen, setIsOpen] = useState(location.pathname === "/");
  const [selectedDiets, setSelectedDiets] = useState<string[]>(
    query.get("diet")?.split(",") || []
  );
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>(
    query.get("intolerances")?.split(",") || []
  );

  const updateQuery = (
    key: "titleMatch" | "diet" | "intolerances",
    value?: string
  ) => {
    const params = new URLSearchParams(query);
    if (value === undefined) params.delete(key);
    else params.set(key, value);
    setQuery(params);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = function (e) {
    e.preventDefault();
    setIsOpen(false);
    const form = e.currentTarget;

    const action = form.getAttribute("action");
    const data = new FormData(form);
    // @ts-expect-error URLSearchParams can be created using FormData
    const queryParams = new URLSearchParams(data).toString();

    let targetURL = `${action}?${queryParams}`;

    if (selectedDiets) targetURL += `&diet=${selectedDiets}`;
    if (selectedIntolerances)
      targetURL += `&intolerances=${selectedIntolerances}`;

    navigate(targetURL);
  };

  return (
    <main className="flex flex-col items-center gap-4 p-4">
      <form
        className="w-full max-w-64"
        action="/recipes"
        method="get"
        onSubmit={handleSubmit}
      >
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex justify-between items-center w-full px-2">
            Search
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-3 py-2">
            <Input
              name="titleMatch"
              placeholder="Recipe name"
              defaultValue={query.get("titleMatch") || ""}
              onChange={(e) => updateQuery("titleMatch", e.currentTarget.value)}
            />
            <Accordion type="multiple">
              <AccordionItem value="Diets">
                <AccordionTrigger>Diets</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  {allDiets.map((diet) => {
                    const checked = selectedDiets.includes(diet);

                    return (
                      <label
                        key={`diet-${diet}`}
                        className="flex gap-3 w-max text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Checkbox
                          checked={checked}
                          onClick={() => {
                            const updatedDiets = checked
                              ? selectedDiets.filter((d) => d !== diet)
                              : [...selectedDiets, diet];

                            setSelectedDiets(updatedDiets);
                            updateQuery("diet", updatedDiets.join(","));
                          }}
                        />
                        {diet}
                      </label>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="Intolerances">
                <AccordionTrigger>Intolerances</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  {allIntolerances.map((intolerance) => {
                    const checked = selectedIntolerances.includes(intolerance);

                    return (
                      <label
                        key={`intolerance-${intolerance}`}
                        className="flex gap-3 w-max text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Checkbox
                          checked={checked}
                          onClick={() => {
                            const updatedIntolerances = checked
                              ? selectedIntolerances.filter(
                                  (i) => i !== intolerance
                                )
                              : [...selectedIntolerances, intolerance];

                            setSelectedIntolerances(updatedIntolerances);
                            updateQuery(
                              "intolerances",
                              updatedIntolerances.join(",")
                            );
                          }}
                        />
                        {intolerance}
                      </label>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button type="submit">Search</Button>
          </CollapsibleContent>
        </Collapsible>
      </form>
      <Outlet />
    </main>
  );
}
