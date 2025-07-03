import { Slider } from '../elements/slider';
import { ZoomIn, ZoomOut, Minimize } from 'lucide-react';
import { Button } from '../elements/button';

import React from 'react';
import { useImageViewer } from '../../hooks/image-viewer-hook';
import ErrorBoundary from '../error-boundary';

export const ImageViewer = ({ imageUrl, imageName }: { imageUrl: string; imageName: string }) => {
  const { imageRef, scale, position, containerRef, handleZoom, resetView, isImageLoading, imageError, handleImageLoad, handleImageError } =
    useImageViewer();
  console.log('🚀 ~ ImageViewer :');

  return (
    <ErrorBoundary fallback={<div>Failed to load image</div>}>
      <div className='flex flex-col items-center space-y-4 h-[80vh]'>
        <div ref={containerRef} className='relative bg-gray-100 rounded-lg overflow-hidden w-full aspect-video'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <img
              ref={imageRef}
              src={imageUrl}
              alt={imageName}
              className='max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out'
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: scale > 1 ? 'move' : 'default',
              }}
              draggable={false}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className='z-50 absolute bottom-3 font-extrabold text-gray-900'>{imageName}</div>
          </div>

          {isImageLoading && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <span>Loading...</span>
            </div>
          )}

          {imageError && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-red-500'>{imageError}</span>
            </div>
          )}
        </div>
        <div className='flex items-center space-x-2 w-full max-w-md'>
          <ZoomOut className='h-4 w-4' />
          <Slider value={[scale]} onValueChange={handleZoom} min={1} max={3} step={0.1} className='flex-grow' />
          <ZoomIn className='h-4 w-4' />
          <Button variant='outline' size='icon' onClick={resetView}>
            <Minimize className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
};
