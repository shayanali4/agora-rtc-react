import { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useRTCClient } from "./useRTCClient";

export function useChannel(client?: IAgoraRTCClient): {
  channelAttributes: Record<string, any>;
  setChannelAttributes: (attributes: Record<string, any>) => void;
} {
  const resolvedClient = useRTCClient(client);
  const [channelAttributes, setChannelAttributes] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!resolvedClient) return;

    // Subscribe to channel attributes
    const handleChannelAttributes = (attributes: Record<string, any>) => {
      setChannelAttributes(attributes);
    };
    resolvedClient.on("channel-attr-updated", handleChannelAttributes);

    // Unsubscribe from channel attributes when component unmounts
    return () => {
      resolvedClient.off("channel-attr-updated", handleChannelAttributes);
    };
  }, [resolvedClient]);

  // Function to set channel attributes
  const updateChannelAttributes = (attributes: Record<string, any>) => {
    if (!resolvedClient) return;
    AgoraRTC.setChannelAttributes(attributes);
  };

  return { channelAttributes, setChannelAttributes: updateChannelAttributes };
}
