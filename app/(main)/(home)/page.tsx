import { AddOrder } from './AddOrder';
import { Excel } from './Excel';
import Info from './Info';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center'>
      <div className='flex w-full justify-between'>
        <div />
        <Info />
        {/* <AddOrder /> */}
        <div />
      </div>

      <div className='self-start'>
        <Excel />
      </div>
    </main>
  );
}
