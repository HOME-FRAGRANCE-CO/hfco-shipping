import { Excel } from './Excel';
import Info from './Info';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center'>
      <Info />
      <div className='self-start'>
        <Excel />
      </div>
    </main>
  );
}
