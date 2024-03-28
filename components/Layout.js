import Image from 'next/image';
import { Inter } from 'next/font/google';
import Nav from 'components/Nav';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import Logo from './Logo';
export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  if (!session) {
    return (
      <div className='bg-gray-200 w-screen h-screen flex items-center'>
        <div className='text-center w-full'>
          <button
            onClick={() => signIn('google')}
            className='text-black px-4 p-2 bg-white rounded'
          >
            Login with google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='block flex md:hidden items- p-4'>
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        </button>
        <div className='flex grow justify-center mr-6'>
          <Logo />
        </div>
      </div>
      <div className='bg-gray-100 min-h-screen flex'>
        <Nav show={showNav} setShowNav={setShowNav} />
        <div className=' flex-grow p-4'>{children}</div>
      </div>
    </div>
  );
}
