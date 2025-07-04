import { Eye, Upload } from 'lucide-react';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useDocumentManager } from '../../hooks/document-manager-hook';
import type { IDocument } from '../../types/document-manager';
import { Button } from '../elements/button';
import { Card, CardContent } from '../elements/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../elements/dialog';
import { Input } from '../elements/input';
import { DocumentList } from './document-list';
import { DocumentListSkeleton } from './document-list-skeleton';
import { DuplicateDialog } from './duplicateDialog';
import { ImageCarousel } from './image-carousel';

export default function DocumentManager() {
  const {
    isLoading,
    notes,
    filter,
    isDragActive,
    showDuplicateDialog,
    duplicateFiles,
    handleConfirmDuplicates,
    setShowDuplicateDialog,
    handleCancelDuplicates,
    removeDocument,
    setFilter,
    getRootProps,
    getInputProps,
    downloadDocument,
  } = useDocumentManager();

  const filteredDocuments = notes?.filter(doc => doc.name.toLowerCase().includes(filter.toLowerCase()));
  const images = notes?.filter(doc => doc.type.startsWith('image/'));
  console.log('🚀 ~ DocumentManager :');

  return (
    <div className='w-full'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex justify-between items-center mb-4'>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors flex-grow mr-4 ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              <div className='flex items-center justify-center'>
                <Upload className='h-6 w-6 text-gray-400 mr-2' />
                <p className='text-sm text-gray-600'>Drag &apos;n&apos; drop or click to upload</p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Input
                type='text'
                placeholder='Filter documents...'
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className='w-48'
              />
              {images && images?.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      <Eye className='h-4 w-4 mr-2' />
                      View All
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-[90vw] w-full max-h-[90vh] p-6'>
                    <DialogTitle className='sr-only'>Image Viewer</DialogTitle>
                    <ImageCarousel notes={notes as IDocument[]} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {!isLoading && filteredDocuments && filteredDocuments?.length > 0 && (
            <DocumentList filteredDocuments={filteredDocuments} removeDocument={removeDocument} downloadDocument={downloadDocument} />
          )}

          {filteredDocuments && filteredDocuments?.length === 0 && <p className='text-center text-gray-500'>No documents uploaded yet.</p>}

          {isLoading && (
            <div className='space-y-4'>
              {Array.from({ length: 4 }).map(_ => (
                <DocumentListSkeleton key={uuid()} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DuplicateDialog duplicates={duplicateFiles} onConfirm={handleConfirmDuplicates} onCancel={handleCancelDuplicates} />
      </Dialog>
    </div>
  );
}
