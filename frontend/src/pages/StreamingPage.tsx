import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Streamer from "@/components/Streamer";
import Listener from "@/components/Listener";

const StreamingPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Live Streaming</h1>
      
      <Tabs defaultValue="streamer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="streamer">Start Streaming</TabsTrigger>
          <TabsTrigger value="listener">Listen to Stream</TabsTrigger>
        </TabsList>
        
        <TabsContent value="streamer">
          <Streamer />
        </TabsContent>
        
        <TabsContent value="listener">
          <Listener />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamingPage; 