'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Finale() {
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    try {
      setComplete(
        (
          JSON.parse(
            window.localStorage.getItem('vice-files:v1:case-003') ?? 'null'
          ) as { status?: string }
        ).status === 'complete'
      );
    } catch {
      setComplete(false);
    }
  }, []);
  return (
    <main className='finale'>
      <p>Vice Files / Resolution</p>
      <h1>
        {complete
          ? 'The city has a name for you.'
          : 'The final file is sealed.'}
      </h1>
      <div className='finale__line' />
      <h2>
        {complete
          ? '3 / 3 cases resolved'
          : 'Finish Case 003 to close the investigation.'}
      </h2>
      <p className='finale__copy'>
        {complete
          ? 'The Velvet Circle has been connected to The Ghost, Solstice Pier, and the Midnight Sentinel. The route is exposed—but Vice City never stays quiet for long.'
          : 'The Organization is still hidden behind the network.'}
      </p>
      <Link href={complete ? '/database' : '/cases/003'}>
        {complete ? 'Open final intelligence database' : 'Return to Case 003'}
      </Link>
    </main>
  );
}
