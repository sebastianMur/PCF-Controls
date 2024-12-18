import { Document } from '../components/document-manager';
import { useEffect, useRef, useState } from 'react';

export const useImageViewer = (documents: Document[]) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const images = documents.filter(doc => doc.type.startsWith('image/'));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    resetView();
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    resetView();
  };

  const handleZoom = (newScale: number[]) => {
    setScale(newScale[0]);
    if (newScale[0] === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

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
  };
};
