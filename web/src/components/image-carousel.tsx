interface Image {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: Image[];
  height?: string;
  width?: string;
}

export function ImageCarousel({
  images,
  height = 'h-48',
  width = 'w-64',
}: ImageCarouselProps) {
  const doubled = [...images, ...images];

  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-4 animate-scroll hover:[animation-play-state:paused]">
        {doubled.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className={`${height} ${width} flex-shrink-0 object-cover rounded-xl border-4 border-black shadow-lg`}
          />
        ))}
      </div>
    </div>
  );
}