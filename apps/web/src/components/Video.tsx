type Props = {
  src: string;
  title?: string;
};

const Video = ({ src, title = 'Video' }: Props) => {
  return (
    <div className="video-thumb video-thumb--embed">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default Video;
