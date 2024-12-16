import type { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { useGetNotesQuery, useGetNotesWithIdQuery } from '../../../store/api-states/notes-api-slice';

import type * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import type { ThemeProvider, PartialTheme, Stack, IStackTokens } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';
import { List } from '@fluentui/react/lib/List';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { Icon } from '@fluentui/react/lib/Icon';
import { Slider } from '@fluentui/react/lib/Slider';
import { useBoolean } from '@fluentui/react-hooks';

initializeIcons();

interface Document {
  name: string;
  type: string;
  url: string;
}

const theme: PartialTheme = {
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
};

const stackTokens: IStackTokens = { childrenGap: 15 };

export interface IFluentDocumentManagerProps {
  context: ComponentFramework.Context<any>;
  notifyOutputChanged: () => void;
  state: ComponentFramework.Dictionary;
  container: HTMLDivElement;
}

export const Overview: React.FC<IFluentDocumentManagerProps> = props => {
  const context = useSelector((state: RootState) => state.pcfApi.context);
  const baseURL = useSelector((state: RootState) => state.pcfApi.baseUrl);
  const { data: Notes, isLoading: isNotesLoading } = useGetNotesQuery();
  const { data: NotesWithId, isLoading: isNotesWithIdLoading } = useGetNotesWithIdQuery({ id: '0316e829-2ca1-ef11-8a69-6045bddbf5c3' });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState('');
  const [currentImage, setCurrentImage] = useState<Document | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCarouselOpen, { setTrue: openCarousel, setFalse: closeCarousel }] = useBoolean(false);
  const [isImageViewerOpen, { setTrue: openImageViewer, setFalse: closeImageViewer }] = useBoolean(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
  }, []);

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const downloadDocument = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDocuments = documents.filter(doc => doc.name.toLowerCase().includes(filter.toLowerCase()));

  const images = documents.filter(doc => doc.type.startsWith('image/'));

  const handleZoom = (value: number) => {
    setScale(value);
    if (value === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  const renderDocument = (doc: Document, index: number) => (
    <Stack horizontal verticalAlign='center' tokens={stackTokens}>
      <span style={{ maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
      <Stack horizontal tokens={stackTokens}>
        <DefaultButton iconProps={{ iconName: 'Download' }} text='Download' onClick={() => downloadDocument(doc)} />
        {doc.type.startsWith('image/') && (
          <DefaultButton
            iconProps={{ iconName: 'Photo2' }}
            text='View'
            onClick={() => {
              setCurrentImage(doc);
              openImageViewer();
            }}
          />
        )}
        <DefaultButton iconProps={{ iconName: 'Delete' }} text='Remove' onClick={() => removeDocument(index)} />
      </Stack>
    </Stack>
  );

  const ImageViewer = ({ imageUrl, imageName }: { imageUrl: string; imageName: string }) => (
    <Stack tokens={stackTokens}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          backgroundColor: '#f3f2f1',
          borderRadius: '4px',
          overflow: 'hidden',
          width: '100%',
          aspectRatio: '16/9',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            ref={imageRef}
            src={imageUrl}
            alt={imageName}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transition: 'transform 200ms ease-in-out',
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              cursor: scale > 1 ? 'move' : 'default',
            }}
          />
        </div>
      </div>
      <Stack horizontal tokens={stackTokens} verticalAlign='center'>
        <Icon iconName='ZoomOut' />
        <Slider min={1} max={3} step={0.1} value={scale} onChange={handleZoom} showValue={false} styles={{ root: { flexGrow: 1 } }} />
        <Icon iconName='ZoomIn' />
        <DefaultButton iconProps={{ iconName: 'Refresh' }} onClick={resetView} />
      </Stack>
    </Stack>
  );

  if (isNotesLoading || isNotesWithIdLoading) {
    return <div>Loading...</div>;
  }

  console.log('🚀 ~ Overview ~ NotesWithId:', NotesWithId);
  console.log('🚀 ~ Overview ~ Notes:', Notes);

  console.log('🚀 ~ Overview ~ baseURL:', baseURL);
  console.log('🚀 ~ Overview ~ context:', context);

  return (
    <ThemeProvider theme={theme}>
      <Stack tokens={stackTokens}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Document Management System</h1>

        <Stack horizontal tokens={stackTokens} verticalAlign='center'>
          <Stack.Item grow>
            <DefaultButton
              iconProps={{ iconName: 'Upload' }}
              text='Upload Documents'
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = (e: Event) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    onDrop(Array.from(files));
                  }
                };
                input.click();
              }}
            />
          </Stack.Item>
          <TextField
            placeholder='Filter documents...'
            value={filter}
            onChange={(_, newValue) => setFilter(newValue || '')}
            styles={{ root: { width: '200px' } }}
          />
          <PrimaryButton iconProps={{ iconName: 'Photo2' }} text='View All Images' onClick={openCarousel} />
        </Stack>

        <ScrollablePane style={{ height: '400px' }}>
          <List items={filteredDocuments} onRenderCell={renderDocument} />
        </ScrollablePane>

        <Dialog
          hidden={!isCarouselOpen}
          onDismiss={closeCarousel}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Image Carousel',
          }}
          modalProps={{
            isBlocking: false,
            styles: { main: { maxWidth: '90vw !important', width: '90vw !important', height: '90vh !important' } },
          }}
        >
          <Stack tokens={stackTokens}>
            {images.map((image, index) => (
              <Image key={index} src={image.url} alt={image.name} width='100%' height={400} imageFit={ImageFit.contain} />
            ))}
          </Stack>
        </Dialog>

        <Dialog
          hidden={!isImageViewerOpen}
          onDismiss={closeImageViewer}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Image Viewer',
          }}
          modalProps={{
            isBlocking: false,
            styles: { main: { maxWidth: '90vw !important', width: '90vw !important', height: '90vh !important' } },
          }}
        >
          {currentImage && <ImageViewer imageUrl={currentImage.url} imageName={currentImage.name} />}
        </Dialog>
      </Stack>
    </ThemeProvider>
  );
};
