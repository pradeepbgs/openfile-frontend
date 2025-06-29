import React from 'react';
import * as spinners from 'react-spinners';

const ClipLoader = (spinners as any).ClipLoader || spinners.ClipLoader;

function Spinner({ size = 14 }: { size: number }) {
  return (
    <div className='mt-1'>
      <ClipLoader
        color="white"
        size={size}
      />
    </div>
  );
}

export default React.memo(Spinner);