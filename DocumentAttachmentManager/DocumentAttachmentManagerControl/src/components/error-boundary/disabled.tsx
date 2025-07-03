import { ArrowRight } from 'lucide-react';
import * as React from 'react';
import { Card, CardContent } from '../elements/card';

export const Disabled = () => {
  return (
    <div className='w-full'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex justify-between items-center mb-4'>
            <div className='border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors flex-grow mr-4'>
              <div className='flex items-center justify-center'>
                <ArrowRight className='h-6 w-6 text-gray-400 mr-2' />

                <p className='text-sm text-gray-600'>To enable the content create the record </p>
              </div>
            </div>
            <div className='flex items-center space-x-2' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
