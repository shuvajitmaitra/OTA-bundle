import React, { createContext, useContext, useState } from "react";

const VideoPlaybackContext = createContext({
  playingVideo: null,
  setPlayingVideo: () => {},
});

export const VideoPlaybackProvider = ({ children }) => {
  const [playingVideo, setPlayingVideo] = useState(null);

  return (
    <VideoPlaybackContext.Provider value={{ playingVideo, setPlayingVideo }}>
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => useContext(VideoPlaybackContext);
