import { useRouteError } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import type { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  description?: string;
}

export default function AlertError({ title, description, ...props }: Props) {
  const error = useRouteError();

  return (
    <Alert className="max-w-96 m-auto font-bold" variant="destructive" {...props}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-bold">{title ?? "Error"}</AlertTitle>
      <AlertDescription>
        {description ?? JSON.stringify(error)}
      </AlertDescription>
    </Alert>
  );
}
