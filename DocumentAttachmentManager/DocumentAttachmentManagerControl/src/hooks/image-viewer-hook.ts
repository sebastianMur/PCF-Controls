import type { IDocument } from '../types/document-manager';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useImageViewer = (documents?: IDocument[]) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const image = imageRef.current;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && scale > 1) {
        const dx = e.clientX - prevPosition.x;
        const dy = e.clientY - prevPosition.y;
        prevPosition = { x: e.clientX, y: e.clientY };
        setPosition(position => ({ x: position.x + dx, y: position.y + dy }));
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    image?.addEventListener('mousedown', handleMouseDown);
    image?.addEventListener('mousemove', handleMouseMove);
    image?.addEventListener('mouseup', handleMouseUp);

    return () => {
      image?.removeEventListener('mousedown', handleMouseDown);
      image?.removeEventListener('mousemove', handleMouseMove);
      image?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [imageRef, scale]);

  const images = documents?.filter(doc => doc.type.startsWith('image/'));
  console.log('🚀 ~ App :');

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
    scale,
    containerRef,
    images,
    nextImage,
    prevImage,
    handleZoom,
    resetView,
    isImageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
  };
};
