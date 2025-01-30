import React from "react";
import PropTypes from "prop-types";
import styles from "./VideoContainer.module.css";

const VideoContainer = ({ videoId }) => {
  return (
    <div className={styles.videoContainer}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

VideoContainer.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default VideoContainer;
