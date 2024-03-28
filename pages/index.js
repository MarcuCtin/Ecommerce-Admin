import Layout from 'components/Layout';
import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
export default function Home() {
  const { data: session } = useSession();
  if (!session) return <div>go to /products for login</div>;
  console.log(session);
  return (
    <Layout>
      <div className='flex justify-between'>
        <h1>
          Hello, <b>{session?.user?.name}</b>{' '}
        </h1>
        <div className='flex bg-gray-300 gap-1 text-black items-center rounded-full'>
          <img
            src={session?.user?.image}
            alt='avatar'
            className=' rounded-full h-8'
          />
          <span className='py-1 px-2'>{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
