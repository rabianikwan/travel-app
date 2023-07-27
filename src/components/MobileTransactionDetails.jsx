'use client';

// utils
import { fixedHour } from '@/utils/fixedHour';
import { convertToDate, convertToTime } from '@/utils/converDateTime';
import { reformatDate, reformatDateWithHour } from '@/utils/reformatDate';
import { extractWord } from '@/utils/extractWord';
import { formatRupiah } from '@/utils/formatRupiah';
import { IoLocationSharp } from 'react-icons/io5';
import { reformatDuration } from '@/utils/reformatDuration';

export default function MobileTransactionDetails({ data }) {
    return (
        <>
            <h1
                className={`${
                    data?.transaction?.transaction_status.toLowerCase() === 'issued' ? 'bg-alert-1' : ' bg-alert-3'
                } mb-2 mt-[64px] w-max rounded-rad-4 px-2 py-1 text-body-6 text-white`}>
                {data?.transaction?.transaction_status}
            </h1>
            <div className=' flex flex-col gap-2 rounded-[10px] border p-4 text-net-4'>
                <h1 className='text-body-6 font-medium'>
                    Passengers :
                    {data?.passenger?.adult > 0 && (
                        <span className='ml-1 font-bold text-pur-5'>{data?.passenger?.adult} Adults</span>
                    )}
                    {data?.passenger?.child > 0 && (
                        <span className='ml-1 font-bold text-pur-5'>, {data?.passenger?.child} Childs</span>
                    )}
                    {data?.passenger?.baby > 0 && (
                        <span className='ml-1 font-bold text-pur-5'>, {data?.passenger?.baby} Babies</span>
                    )}
                </h1>

                {data?.departure && (
                    <div className='grid w-full grid-cols-12 items-center gap-3 '>
                        <div className='col-span-5 flex items-start gap-2'>
                            <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                            <div className='text-body-4'>
                                <p className='font-bold'>{data?.departure?.Flight?.from}</p>
                                <p>{reformatDate(data?.departure?.Flight?.departure_date)}</p>
                                <p>{fixedHour(data?.departure?.Flight?.departure_time)}</p>
                            </div>
                        </div>
                        <div className='col-span-2 flex flex-col items-center'>
                            <p className='text-body-4'>{reformatDuration(data?.departure?.Flight?.duration)}</p>
                            <div className='w-full border'></div>
                        </div>
                        <div className='col-span-5 flex items-start gap-2'>
                            <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                            <div className='text-body-4'>
                                <p className='font-bold'>{data?.departure?.Flight?.to}</p>
                                <p>{reformatDate(data?.departure?.Flight?.arrival_date)}</p>
                                <p>{fixedHour(data?.departure?.Flight?.arrival_time)}</p>
                            </div>
                        </div>
                    </div>
                )}
                {data?.arrival?.transaction_type && (
                    <div className='grid w-full grid-cols-12 items-center gap-3 '>
                        <div className='col-span-5 flex items-start gap-2'>
                            <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                            <div className='text-body-4'>
                                <p className='font-bold'>{data?.arrival?.Flight?.from}</p>
                                <p>{reformatDate(data?.arrival?.Flight?.departure_date)}</p>
                                <p>{fixedHour(data?.arrival?.Flight?.departure_time)}</p>
                            </div>
                        </div>
                        <div className='col-span-2 flex flex-col items-center'>
                            <p className='text-body-4'>{reformatDuration(data?.arrival?.Flight?.duration)}</p>
                            <div className='w-full border'></div>
                        </div>
                        <div className='col-span-5 flex items-start gap-2'>
                            <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                            <div className='text-body-4'>
                                <p className='font-bold'>{data?.arrival?.Flight?.to}</p>
                                <p>{reformatDate(data?.arrival?.Flight?.arrival_date)}</p>
                                <p>{fixedHour(data?.arrival?.Flight?.arrival_time)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className='w-full border'></div>

                <div className='flex items-center justify-between'>
                    <div className='text-body-6'>
                        <p className='font-bold'>Booking Code:</p>
                        <p>{data?.transaction?.transaction_code}</p>
                    </div>
                    <div className='text-body-6'>
                        <p className='font-bold'>Class:</p>
                        <p>{data?.departure?.Flight?.flight_class}</p>
                    </div>
                    <div className='text-body-6'>
                        <p className='font-bold text-pur-5'>
                            {data?.price?.totalPrice ? formatRupiah(data?.price?.totalPrice) : 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
