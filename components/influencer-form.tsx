import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";

export function InfluencerForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [instagramId, setInstagramId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("/api/influencer/addDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, url, category, gender, instagramId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add influencer");
      }

      toast.success("Influencer added successfully");
    } catch (error) {
      return toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Influencer Form</CardTitle>
          <CardDescription>
            Fill the form below to add an influencer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Instagram ID</FieldLabel>
                <Input
                  type="text"
                  placeholder="@instagram_id"
                  required
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Niche</FieldLabel>
                <Input
                  type="text"
                  placeholder="Traveler, Foodie, etc."
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value)}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" id="male" />
                    <FieldLabel
                      htmlFor="male"
                      className="font-normal cursor-pointer"
                    >
                      Male
                    </FieldLabel>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" id="female" />
                    <FieldLabel
                      htmlFor="female"
                      className="font-normal cursor-pointer"
                    >
                      Female
                    </FieldLabel>
                  </div>
                </RadioGroup>
              </Field>
              <Field>
                <FieldLabel>URL</FieldLabel>
                <Input
                  placeholder="https://example.com"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
