import style from '@/app/ui/home.module.css';
import clsx from 'clsx';

export default function CssStyling() {
  let status = 'paid';
  let quoteStatus = 'booked';

  return (
    <div>
      <div className={style.shape} />

      <p className={style.paraColorCenter}>Hello World!</p>

      <div>
        <p>
          Payment Status:{' '}
          <span
            className={clsx('', {
              'bg-gray-100 text-gray-500': status === 'pending',
              'bg-green-100 text-white-500': status === 'paid',
            })}
          >
            {status}
          </span>
        </p>

        <p>
          Quote Status:{' '}
          <span
            className={clsx(
              'inline-flex items-center rounded-full px-2 py-1 text-sm',
              {
                'bg-gray-100 text-red-500': quoteStatus === 'pending',
                'bg-blue-100 text-yellow-500': quoteStatus === 'booked',
              },
            )}
          >
            {quoteStatus}
          </span>
        </p>
      </div>
    </div>
  );
}