import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfluencerTable } from "./influencer-table";
import { BusinessTable } from "./business-table";

export function DetailTabs() {
  return (
    <Tabs defaultValue="influencer">
      <TabsList>
        <TabsTrigger value="influencer">Influencer</TabsTrigger>
        <TabsTrigger value="business">Business</TabsTrigger>
      </TabsList>
      <TabsContent value="influencer">
        <InfluencerTable />
      </TabsContent>
      <TabsContent value="business">
        <BusinessTable />
      </TabsContent>
    </Tabs>
  );
}
