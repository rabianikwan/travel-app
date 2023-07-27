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
import Button from './Button';

export default function MobileListTransactionHistory({ historyDatas, handleHistoryDetail }) {
    return (
        <>
            {historyDatas?.length ? (
                historyDatas.map((history, index) => {
                    return (
                        <div key={index}>
                            <h1 className='text-title-1 font-bold text-white'>{history.month}</h1>
                            {history?.data?.length &&
                                history?.data.map((historyItem, indexHistoryItem) => {
                                    const type = historyItem?.transaction?.Flights[1] ? 'Round Trip' : 'One Trip';
                                    return (
                                        <div
                                            onClick={() => handleHistoryDetail(historyItem)}
                                            key={indexHistoryItem}
                                            className='mt-4 flex cursor-pointer flex-col gap-2'>
                                            <div className='flex flex-col gap-3 rounded-rad-3 bg-white p-4'>
                                                {/* label */}
                                                <div className='flex items-center justify-between '>
                                                    <p
                                                        className={`${historyStatusStyling(
                                                            historyItem?.transaction?.transaction_status
                                                        )} w-max rounded-rad-4  px-3 py-1 text-body-6 text-white`}>
                                                        {historyItem?.transaction?.transaction_status}
                                                    </p>
                                                    <p className='text-title-1 font-bold'>{type}</p>
                                                </div>
                                                {/* label */}

                                                {/* flight */}
                                                <div className='mt-6 flex flex-col gap-2'>
                                                    {/* derpature */}
                                                    {historyItem?.transaction?.Flights[0] && (
                                                        <div className='grid w-full grid-cols-12 items-center gap-3 '>
                                                            {/* departure from */}
                                                            <div className='col-span-5 flex items-start gap-2'>
                                                                <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                                                                <div className='text-body-4'>
                                                                    <p className='font-bold'>
                                                                        {historyItem?.transaction?.Flights[0]?.from}
                                                                    </p>
                                                                    <p>
                                                                        {reformatDate(
                                                                            historyItem?.transaction?.Flights[0]?.departure_date
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {fixedHour(
                                                                            historyItem?.transaction?.Flights[0]?.departure_time
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {/* departure from */}
                                                            {/* divider departure duration */}
                                                            <div className='col-span-2 flex flex-col items-center'>
                                                                <p className='text-body-2'>
                                                                    {reformatDuration(
                                                                        historyItem?.transaction.Flights[0]?.duration
                                                                    )}
                                                                </p>
                                                                <div className='w-full border'></div>
                                                            </div>
                                                            {/* divider departure duration */}

                                                            {/* departure to */}
                                                            <div className='col-span-5 flex items-start gap-2'>
                                                                <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                                                                <div className='text-body-4'>
                                                                    <p className='font-bold'>
                                                                        {historyItem?.transaction?.Flights[0]?.to}
                                                                    </p>
                                                                    <p>
                                                                        {reformatDate(
                                                                            historyItem?.transaction?.Flights[0]?.arrival_date
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {fixedHour(
                                                                            historyItem?.transaction?.Flights[0]?.arrival_time
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {/* departure to */}
                                                        </div>
                                                    )}
                                                    {/* derpature */}

                                                    {/* arrival */}
                                                    {historyItem?.transaction?.Flights[1] && (
                                                        <div className='grid w-full grid-cols-12 items-center gap-3 '>
                                                            {/* arrival from */}
                                                            <div className='col-span-5 flex items-start gap-2'>
                                                                <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                                                                <div className='text-body-4'>
                                                                    <p className='font-bold'>
                                                                        {historyItem?.transaction?.Flights[1]?.from}
                                                                    </p>
                                                                    <p>
                                                                        {reformatDate(
                                                                            historyItem?.transaction?.Flights[1]?.departure_date
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {fixedHour(
                                                                            historyItem?.transaction?.Flights[1]?.departure_time
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {/* arrival from */}

                                                            {/* divider arrival duration */}
                                                            <div className='col-span-2 flex flex-col items-center'>
                                                                <p className='text-body-2'>
                                                                    {reformatDuration(
                                                                        historyItem?.transaction.Flights[1]?.duration
                                                                    )}
                                                                </p>
                                                                <div className='w-full border'></div>
                                                            </div>
                                                            {/* divider arrival duration */}

                                                            {/* arrival to */}
                                                            <div className='col-span-5 flex items-start gap-2'>
                                                                <IoLocationSharp className='h-[24px] w-[24px] text-net-3' />
                                                                <div className='text-body-4'>
                                                                    <p className='font-bold'>
                                                                        {historyItem?.transaction?.Flights[1]?.to}
                                                                    </p>
                                                                    <p>
                                                                        {reformatDate(
                                                                            historyItem?.transaction?.Flights[1]?.arrival_date
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {fixedHour(
                                                                            historyItem?.transaction?.Flights[1]?.arrival_time
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {/* arrival to*/}
                                                        </div>
                                                    )}
                                                    {/* arrival */}
                                                </div>
                                                {/* flight */}

                                                {/* divider */}
                                                <div className='w-full border'></div>
                                                {/* divider */}

                                                {/* bottom desc */}
                                                <div className='flex items-center justify-between'>
                                                    <div className='text-body-6'>
                                                        <p className='font-bold'>Booking Code:</p>
                                                        <p>{historyItem?.transaction?.transaction_code}</p>
                                                    </div>
                                                    <div className='text-body-6'>
                                                        <p className='font-bold'>Class:</p>
                                                        <p>{historyItem?.transaction?.Flights[0].flight_class}</p>
                                                    </div>
                                                    <div className='text-body-6'>
                                                        <p className='font-bold text-pur-5'>
                                                            {historyItem?.price.total
                                                                ? formatRupiah(historyItem?.price.total)
                                                                : 'Loading...'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* bottom desc */}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    );
                })
            ) : (
                <div className='flex h-max items-center justify-center rounded-rad-2 bg-white p-3'>
                    <div className='flex flex-col justify-center gap-4'>
                        <div className='flex flex-col items-center justify-center text-center'>
                            <Image alt='' src={'/new_images/empty_list.svg'} width={160} height={160} />
                            <h1 className='mt-4 text-body-6 font-bold text-pur-3'>Oops! Empty Transaction History!</h1>
                            <h3 className='text-body-6'>You {"haven't"} taken a flight yet</h3>
                        </div>
                        <Button>Find Flights</Button>
                    </div>
                </div>
            )}
        </>
    );
}
