import React, { useEffect, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { useStreamStore } from "@/stores/useStreamStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:5000";

const Streamer = () => {
  const { isStreaming, streamId, setIsStreaming, setStreamId } = useStreamStore();
  const [peers, setPeers] = useState<Record<string, Peer.Instance>>({});

  useEffect(() => {
    if (!isStreaming || !streamId) return;

    let stream: MediaStream;
    let socket: ReturnType<typeof io>;

    const setUpStreaming = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        socket = io(SIGNALING_SERVER_URL);

        socket.emit("room:join", streamId);

        socket.on("room:listener-joined", (listenerId) => {
          const peer = new Peer({
            initiator: true,
            stream: stream,
          });

          peer.on("signal", (data) => {
            socket.emit("peer:signal", listenerId, data);
          });

          setPeers((prev) => ({ ...prev, [listenerId]: peer }));
        });

        socket.on("peer:signal", (originId, data) => {
          peers[originId]?.signal(data);
        });
      } catch (error) {
        console.error("Error setting up stream:", error);
        setIsStreaming(false);
        setStreamId(null);
      }
    };

    setUpStreaming();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (socket) socket.disconnect();
      Object.values(peers).forEach((peer) => peer.destroy());
    };
  }, [isStreaming, streamId]);

  const startStream = () => {
    const newStreamId = Math.random().toString(36).slice(2, 9);
    setStreamId(newStreamId);
    setIsStreaming(true);
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStreamId(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Live Stream</h1>

      {!isStreaming ? (
        <Button onClick={startStream}>Start Streaming</Button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              value={streamId || ""}
              readOnly
              className="max-w-xs"
            />
            <Button variant="destructive" onClick={stopStream}>
              Stop Streaming
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this Stream ID with your listeners
          </p>
        </div>
      )}
    </div>
  );
};

export default Streamer; 