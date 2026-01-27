import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfluencerForm } from "./influencer-form";
import { BusinessForm } from "./business-form";

export function InfluencerTabs() {
  return (
    <Tabs defaultValue="influencer" className="w-1/2 mx-auto">
      <TabsList>
        <TabsTrigger value="influencer">Influencer</TabsTrigger>
        <TabsTrigger value="business">Business</TabsTrigger>
      </TabsList>
      <TabsContent value="influencer">
        <InfluencerForm />
      </TabsContent>
      <TabsContent value="business">
        <BusinessForm />
      </TabsContent>
    </Tabs>
  );
}
