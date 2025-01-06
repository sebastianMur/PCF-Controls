import React from 'react';
import { ScrollArea } from '../elements/scroll-area';
import { Trash, Download, Eye } from 'lucide-react';
import { Button } from '../elements/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../elements/dialog';
import type { IDocument } from '../../types/document-manager';
import { ImageViewer } from './image-viewer';
import ErrorBoundary from '../error-boundary';

interface IDocumentListProps {
  filteredDocuments: IDocument[];
  removeDocument: (index: string) => void;
  downloadDocument: (doc: IDocument) => void;
}

export const DocumentList = ({ filteredDocuments, removeDocument, downloadDocument }: IDocumentListProps) => {
  console.log('🚀 ~ DocumentList ~ filteredDocuments:', filteredDocuments);
  return (
    <ErrorBoundary fallback={<div>Failed to load documents</div>}>
      <ScrollArea className='h-[fit-content] w-full rounded-md border p-4'>
        {filteredDocuments.map(doc => (
          <div key={doc.url} className='flex items-center justify-between py-2 border-b last:border-b-0'>
            <span className='truncate max-w-[40%]'>{doc.name}</span>
            <div className='flex space-x-2'>
              {doc.type.startsWith('image/') && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <Eye className='h-4 w-4 mr-1' />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-[90vw] w-full max-h-[90vh] p-6'>
                    <DialogTitle className='sr-only'>Image Viewer</DialogTitle>
                    <ImageViewer imageName={doc.name} imageUrl={doc.url} />
                  </DialogContent>
                </Dialog>
              )}
              <Button variant='outline' size='sm' onClick={() => downloadDocument(doc)}>
                <Download className='h-4 w-4 mr-1' />
                Download
              </Button>

              <Button
                className='text-red-500 border-red-500 hover:text-red-700 hover:border-e-red-700'
                variant='outline'
                size='sm'
                onClick={() => removeDocument(doc.annotationid)}
              >
                <Trash className='h-4 w-4' />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </ErrorBoundary>
  );
};
