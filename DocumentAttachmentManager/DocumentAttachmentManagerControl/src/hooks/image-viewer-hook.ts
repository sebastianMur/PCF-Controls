import type { IDocument } from '../types/document-manager';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useImageViewer = (documents?: IDocument[]) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prev => Math.max(1, Math.min(prev + delta, 3)));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const images = documents?.filter(doc => doc.type.startsWith('image/'));
  console.log('🚀 ~ App :');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging && scale > 1) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setPosition({ x: deltaX, y: deltaY });
      }
    },
    [isDragging, dragStart, scale],
  );

  const handleMouseUp = useCallback(() => {
    console.log('🚀 ~ handleMouseUp ~ isDragging:');
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const nextImage = useCallback(() => {
    if (!images) return;
    setCurrentImageIndex(prev => (prev + 1) % images?.length);
    resetView();
  }, [images, resetView]);

  const prevImage = useCallback(() => {
    if (!images) return;
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    resetView();
  }, [images, resetView]);

  const handleZoom = useCallback((newScale: number[]) => {
    console.log('🚀 ~ handleZoom ~ newScale:', newScale);

    setScale(newScale[0]);
    if (newScale[0] === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [scale, position],
  );

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
    setImageError(null);
  }, []);

  const handleImageError = useCallback(() => {
    setIsImageLoading(false);
    setImageError('Failed to load image');
  }, []);
  useEffect(() => {
    if (images?.[currentImageIndex]) {
      setIsImageLoading(true);
      setImageError(null);
    }
  }, [currentImageIndex, images]);

  return {
    imageRef,
    currentImageIndex,
    position,
    isDragging,
    scale,
    containerRef,
    images,
    handleMouseMove,
    handleMouseUp,
    nextImage,
    prevImage,
    handleZoom,
    resetView,
    handleMouseDown,
    isImageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
  };
};
