// import { AddOrder } from './AddOrder';
import { Excel } from './Excel';
import Info from './Info';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center pt-6'>
      <div className='flex w-full justify-between'>
        <div />
        <Info />

        <div />
      </div>

      <div className='self-start'>
        <Excel />
      </div>
    </main>
  );
}
