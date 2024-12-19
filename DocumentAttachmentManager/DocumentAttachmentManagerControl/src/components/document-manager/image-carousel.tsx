import { Slider } from '../elements/slider';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minimize } from 'lucide-react';
import { Button } from '../elements/button';

import React from 'react';
import { useImageViewer } from '../../hooks/image-viewer-hook';
import type { IDocument } from '../../types/document-manager';

type ImageViewerProps = {
  notes: IDocument[];
};

export const ImageCarousel = ({ notes }: ImageViewerProps) => {
  console.log('🚀 ~ ImageViewer ~ documents:', notes);
  const {
    imageRef,
    scale,
    position,
    currentImageIndex,
    images,
    containerRef,
    handleZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
    prevImage,
    nextImage,
  } = useImageViewer(notes);

  return (
    <div className='flex flex-col items-center space-y-4 h-[80vh]'>
      <div
        ref={containerRef}
        className='relative bg-gray-100 rounded-lg overflow-hidden w-full aspect-video'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          <img
            ref={imageRef}
            src={images ? images[currentImageIndex]?.url : ''}
            alt={images ? images[currentImageIndex]?.name : ''}
            className='max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out'
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              cursor: scale > 1 ? 'move' : 'default',
            }}
          />
        </div>
        <Button variant='secondary' size='icon' className='absolute top-1/2 left-2 transform -translate-y-1/2' onClick={prevImage}>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button variant='secondary' size='icon' className='absolute top-1/2 right-2 transform -translate-y-1/2' onClick={nextImage}>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
      <div className='flex items-center space-x-2 w-full max-w-md'>
        <ZoomOut className='h-4 w-4' />
        <Slider value={[scale]} onValueChange={handleZoom} min={1} max={3} step={0.1} className='flex-grow' />
        <ZoomIn className='h-4 w-4' />
        <Button variant='outline' size='icon' onClick={resetView}>
          <Minimize className='h-4 w-4' />
        </Button>
      </div>
      <p className='text-sm text-gray-500'>
        Image {currentImageIndex + 1} of {images ? images.length : 0}
      </p>
    </div>
  );
};
