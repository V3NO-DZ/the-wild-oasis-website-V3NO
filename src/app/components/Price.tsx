import { getCabinPrice } from '@/app/lib/data-service';

async function Price({ cabinId }: { cabinId: number }) {
  const data = await getCabinPrice(cabinId);
  if (!data) return null;
  const { regularPrice, discount } = data;

  return (
    <p className='mt-12 text-3xl flex gap-3 items-baseline'>
      {discount > 0 ? (
        <>
          <span className='text-3xl font-[350]'>
            ${regularPrice - discount}
          </span>
          <span className='line-through font-semibold text-primary-600'>
            ${regularPrice}
          </span>
        </>
      ) : (
        <span className='text-3xl font-[350]'>${regularPrice}</span>
      )}
      <span className='text-primary-200'>/ night</span>
    </p>
  );
}

export default Price;
