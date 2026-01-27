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
import { useState } from "react";
import { toast } from "sonner";

export function BusinessForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/business/addDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          contact,
          address,
        }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else if (data.success) {
        toast.success("Business added successfully");
        setName("");
        setCategory("");
        setContact("");
        setAddress("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Business Form</CardTitle>
          <CardDescription>
            Fill the form below to add a business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
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
                <FieldLabel>Category</FieldLabel>
                <Input
                  placeholder="Category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Contact</FieldLabel>
                <Input
                  type="number"
                  maxLength={10}
                  minLength={10}
                  placeholder="Contact"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  placeholder="Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
