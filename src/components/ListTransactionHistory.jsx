'use client';

import Image from 'next/image';

import { IoLocationSharp } from 'react-icons/io5';

// //Utils
import { reformatDate } from '@/utils/reformatDate';
import { reformatDuration } from '@/utils/reformatDuration';
import { fixedHour } from '@/utils/fixedHour';
import { formatRupiah } from '@/utils/formatRupiah';
import { extractWord } from '@/utils/extractWord';
import { groupingByTransactionDates } from '@/utils/reShapeData';
import { historyStatusStyling } from '@/utils/historyStatusStyling';

export default function ListTransactionHistory({ choosedHistoryItem, historyDatas, handleHistoryDetail }) {
    return (
        <>
            {historyDatas.length > 0 &&
                historyDatas?.map((history, index) => {
                    return (
                        <div key={index} className='grid grid-cols-12'>
                            <h1 className='col-span-12 text-title-2 font-bold'>{history.month}</h1>
                            <div className='col-span-12 mt-3 flex flex-col gap-4'>
                                {history?.data?.map((historyItems, index) => {
                                    // console.log('====================================');
                                    // console.log('HISTORY ITEM', historyItems);
                                    // console.log('====================================');
                                    return (
                                        <div
                                            onClick={() => handleHistoryDetail(historyItems)}
                                            key={index}
                                            className={`${
                                                historyItems?.transaction?.transaction_code ===
                                                choosedHistoryItem?.transaction?.transaction_code
                                                    ? 'border-pur-2'
                                                    : 'border-white'
                                            } flex cursor-pointer flex-col gap-4 rounded-rad-3 border   p-4 shadow-low`}>
                                            <h1
                                                className={`${historyStatusStyling(
                                                    historyItems?.transaction?.transaction_status
                                                )} w-max rounded-rad-4 px-3 py-1 text-body-6`}>
                                                {historyItems?.transaction?.transaction_status}
                                            </h1>
                                            {historyItems?.transaction?.Flights &&
                                                historyItems?.transaction?.Flights?.map((flight, index) => {
                                                    return (
                                                        <div className='flex items-center justify-between gap-4 ' key={index}>
                                                            <div className='flex gap-2'>
                                                                <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                                                                <div>
                                                                    <p className='text-body-6 font-bold'>
                                                                        {flight?.Airport_from?.airport_location}
                                                                    </p>
                                                                    <p className='text-body-3 font-medium'>
                                                                        {reformatDate(flight?.departure_date)}
                                                                    </p>
                                                                    <p className='text-body-3 font-medium'>
                                                                        {fixedHour(flight?.departure_time)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className=''>
                                                                <p className='text-center text-body-4 text-net-3'>
                                                                    {reformatDuration(flight?.duration)}
                                                                </p>
                                                                <div className='relative h-[8px] w-[233px]'>
                                                                    <Image alt='' src={'./images/arrow.svg'} fill />
                                                                </div>
                                                            </div>
                                                            <div className='flex gap-2'>
                                                                <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                                                                <div>
                                                                    <p className='text-body-6 font-bold'>
                                                                        {flight?.Airport_to?.airport_location}
                                                                    </p>
                                                                    <p className='text-body-3 font-medium'>
                                                                        {reformatDate(flight?.arrival_date)}
                                                                    </p>
                                                                    <p className='text-body-3 font-medium'>
                                                                        {fixedHour(flight?.arrival_time)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            <div className='w-full border'></div>
                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <h3 className='text-body-5 font-bold'>Booking Code:</h3>
                                                    <p className='text-body-5 font-normal'>
                                                        {historyItems?.transaction?.transaction_code}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className='text-body-5 font-bold'>Class:</h3>
                                                    <p className='text-body-5 font-normal'>
                                                        {historyItems?.transaction?.Flights[0]?.flight_class}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className='text-body-5 font-bold text-pur-5'>
                                                        {formatRupiah(historyItems?.price?.total)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
        </>
    );
}
