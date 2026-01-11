import { Check, Loader2, X } from 'lucide-react';
import Button from './button';
import { useState } from 'react';

export default function ActionCardCompact() {
  const [status, setStatus] = useState<
    'pending' | 'loading' | 'success' | 'fail'
  >('pending');

  return (
    <div className="flex flex-col gap-2 border-2 rounded-md border-gray-600 p-2 w-64 text-sm">
      <div>Name</div>
      <div className="flex flex-col border-2 border-gray-500 rounded-md text-blue-600">
        <div className="border-b-2 border-gray-500 p-1">
          <input
            className="w-full rounded-sm px-1 focus:outline-0 focus:bg-blue-100 hover:bg-blue-50"
            type="text"
            placeholder="version"
          />
        </div>
        <div className="p-1">
          <input
            className="w-full rounded-sm px-1 focus:outline-0 focus:bg-blue-100 hover:bg-blue-50"
            type="text"
            placeholder="output"
          />
        </div>
      </div>
      <Button
        className={`hover:bg-blue-600 p-1 
            ${
              status === 'pending' || status === 'loading' ? 'bg-blue-500 ' : ''
            }
            ${status === 'success' ? 'bg-green-600' : ''}
            ${status === 'fail' ? 'bg-red-600' : ''}
          `}
        // onClick={runCommand}
      >
        <div className="flex justify-center gap-1">
          {status === 'pending' && <span className="w-8" />}
          {status === 'loading' && (
            <Loader2 className="w-8 animate-spin"></Loader2>
          )}
          {status === 'success' && <Check className="w-8"></Check>}
          {status === 'fail' && <X className="w-8"></X>}

          <span>Run</span>
          <span className="w-8" />
        </div>
      </Button>
    </div>
  );
}
