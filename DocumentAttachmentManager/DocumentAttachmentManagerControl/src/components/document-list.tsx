import React from 'react';
import { ScrollArea } from '../components/elements/scroll-area';
import { X, Download, Eye } from 'lucide-react';
import { Button } from '../components/elements/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../components/elements/dialog';
import { ImageViewer } from './image-viewer';
import type { Document } from './document-manager';

interface IDocumentListProps {
  documents: Document[];
  filteredDocuments: Document[];
  removeDocument: (index: number) => void;
  downloadDocument: (doc: Document) => void;
}

export const DocumentList = ({ documents, filteredDocuments, removeDocument, downloadDocument }: IDocumentListProps) => {
  return (
    <ScrollArea className='h-[400px] w-full rounded-md border p-4'>
      {filteredDocuments.map((doc, index) => (
        <div key={index} className='flex items-center justify-between py-2 border-b last:border-b-0'>
          <span className='truncate max-w-[40%]'>{doc.name}</span>
          <div className='flex space-x-2'>
            <Button variant='outline' size='sm' onClick={() => downloadDocument(doc)}>
              <Download className='h-4 w-4 mr-1' />
              Download
            </Button>
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
                  <ImageViewer documents={documents} />
                </DialogContent>
              </Dialog>
            )}
            <Button variant='ghost' size='sm' onClick={() => removeDocument(index)}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
