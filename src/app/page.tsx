import Link from 'next/link';

export default function Home() {
  return (
    <main className='launch-screen'>
      <p className='launch-screen__eyebrow'>
        Vice City Intelligence Archive / 2026
      </p>
      <h1>VICE FILES</h1>
      <p>Everyone has a story. Every story leaves evidence.</p>
      <Link className='launch-screen__cta' href='/identity'>
        Create your identity
      </Link>
    </main>
  );
}
