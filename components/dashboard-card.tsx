import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ReactElement, cloneElement, isValidElement, useRef } from "react";

interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  const iconRef = useRef<IconHandle>(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      iconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (iconRef.current) {
      iconRef.current.stopAnimation();
    }
  };

  return (
    <Card
      className="w-full transition-colors hover:bg-muted/50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {isValidElement(icon)
            ? cloneElement(
                icon as ReactElement,
                {
                  ref: iconRef,
                } as any,
              )
            : icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
