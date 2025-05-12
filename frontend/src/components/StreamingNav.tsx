import { Link } from "react-router-dom";
import { useStreamStore } from "@/stores/useStreamStore";
import { Button } from "./ui/button";
import { Radio } from "lucide-react";

const StreamingNav = () => {
  const { isStreaming } = useStreamStore();

  return (
    <Link to="/streaming">
      <Button variant="outline" className="relative">
        <Radio className="size-4 mr-2" />
        Live Stream
        {isStreaming && (
          <span className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </Button>
    </Link>
  );
};

export default StreamingNav; 