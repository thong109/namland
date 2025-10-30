export const YouTubeComponent = ({ videoUrl }) => {
  // Chuyển link thành dạng embed
  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];

    if (typeof videoId === 'string') {
      const ampersandPosition = videoId.indexOf('&');
      return `https://www.youtube.com/embed/${
        ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId
      }`;
    }
  };

  return (
    <>
      <div className="mb-2">
        <a className="text-[#31383C] underline">{videoUrl}</a>
      </div>
      <div
        style={{
          width: '910px',
          height: '420px',
          border: '2px solid #000',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={getEmbedUrl(videoUrl)}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};
