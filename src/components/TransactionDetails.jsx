'use client';

import Image from 'next/image';

import { fixedHour } from '@/utils/fixedHour';
import { convertToDate, convertToTime } from '@/utils/converDateTime';
import { reformatDate, reformatDateWithHour } from '@/utils/reformatDate';
import { extractWord } from '@/utils/extractWord';
import { formatRupiah } from '@/utils/formatRupiah';
import { IoLocationSharp } from 'react-icons/io5';
import { reformatDuration } from '@/utils/reformatDuration';

export default function TransactionDetails({ data }) {
    const historyStatusStyling = (historyStatus) => {
        if (historyStatus?.toLowerCase() === 'issued') {
            return 'bg-alert-1 text-white';
        }
        if (historyStatus?.toLowerCase() === 'unpaid') {
            return 'bg-alert-3 text-white';
        }
        if (historyStatus?.toLowerCase() === 'cancelled') {
            return 'bg-net-3 text-white';
        }
    };
    return (
        <>
            <div className='flex justify-between'>
                <h1 className='text-title-3'>
                    Booking Code :<span className='font-bold text-pur-5'>{data?.transaction?.transaction_code}</span>
                </h1>
                <h1
                    className={`${historyStatusStyling(
                        data?.transaction?.transaction_status
                    )} w-max rounded-rad-4 px-3 py-1 text-body-6`}>
                    {data?.transaction?.transaction_status}
                </h1>
            </div>
            {/* depar */}
            {data?.departure && (
                <div className='flex flex-col gap-4'>
                    {data?.arrival?.transaction_type && (
                        <h1 className='w-max rounded-rad-3 bg-pur-5 px-2 py-1 text-body-6 text-white lg:rounded-rad-4 lg:font-normal'>
                            Departure - Flight 1
                        </h1>
                    )}

                    <div className='flex justify-between'>
                        <div>
                            <p className='text-title-2 font-bold'>{fixedHour(data?.departure?.Flight?.departure_time)}</p>
                            <p className='text-body-6'>{reformatDate(data?.departure?.Flight?.departure_date)}</p>
                            <p className='text-body-6 font-medium'>{data?.departure?.Flight?.Airport_from?.airport_name}</p>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Departure</h1>
                    </div>

                    <div className='w-full border'></div>

                    <div className='flex items-center gap-4 '>
                        <Image src={data?.departure?.Flight?.Airline.image} alt='' width={24} height={24} />

                        <div className='flex flex-col gap-4'>
                            <div>
                                <h1 className='text-body-6 font-bold'>
                                    {data?.departure.Flight.Airline.airline_name} - {data?.departure.Flight.flight_class}
                                </h1>
                                <h2 className='text-body-5 font-bold'>{data?.departure.Flight.Airline.airline_code}</h2>
                            </div>
                            <div>
                                <h3 className='text-body-5 font-bold'>Information :</h3>
                                <p className='text-body-5 font-normal'>{extractWord(data?.departure.Flight.description)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='w-full border'></div>

                    <div className='flex justify-between'>
                        <div>
                            <p className='text-title-2 font-bold'>{fixedHour(data?.departure?.Flight?.arrival_time)}</p>
                            <p className='text-body-6'>{reformatDate(data?.departure?.Flight?.arrival_date)}</p>
                            <p className='text-body-6 font-medium'>{data?.departure?.Flight?.Airport_to?.airport_name}</p>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Arrival</h1>
                    </div>
                </div>
            )}

            {/* divider */}
            {data?.arrival?.transaction_type && <div className='w-full border '></div>}
            {/* divider */}

            {/* return */}
            {data?.arrival?.transaction_type && (
                <div className='flex flex-col gap-4'>
                    {data?.arrival?.transaction_type && (
                        <h1 className='w-max rounded-rad-3 bg-pur-5 px-2 py-1 text-body-6 font-normal text-white lg:rounded-rad-4'>
                            Return - Flight 2
                        </h1>
                    )}

                    <div className='flex justify-between'>
                        <div>
                            <p className='text-title-2 font-bold'>{fixedHour(data?.arrival?.Flight?.departure_time)}</p>
                            <p className='text-body-6'>{reformatDate(data?.arrival?.Flight?.departure_date)}</p>
                            <p className='text-body-6 font-medium'>{data?.arrival?.Flight?.Airport_from?.airport_name}</p>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Departure</h1>
                    </div>

                    <div className='w-full border'></div>

                    <div className='flex items-center gap-4 '>
                        <Image src={data?.arrival?.Flight?.Airline.image} alt='' width={24} height={24} />

                        <div className='flex flex-col gap-4'>
                            <div>
                                <h1 className='text-body-6 font-bold'>
                                    {data?.arrival?.Flight?.Airline?.airline_name} - {data?.arrival?.Flight?.flight_class}
                                </h1>
                                <h2 className='text-body-5 font-bold'>{data?.arrival?.Flight?.Airline?.airline_code}</h2>
                            </div>
                            <div>
                                <h3 className='text-body-5 font-bold'>Information :</h3>
                                <p className='text-body-5 font-normal'>{extractWord(data?.arrival?.Flight?.description)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='w-full border'></div>

                    <div className='flex justify-between'>
                        <div>
                            <p className='text-title-2 font-bold'>{fixedHour(data?.arrival?.Flight?.arrival_time)}</p>
                            <p className='text-body-6'>{reformatDate(data?.arrival.Flight?.arrival_date)}</p>
                            <p className='text-body-6 font-medium'>{data?.arrival?.Flight?.Airport_to?.airport_name}</p>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Arrival</h1>
                    </div>
                </div>
            )}
            {/* return */}

            {/* divider */}
            <div className='mb-2 mt-4 w-full border text-net-3'></div>
            {/* divider */}

            {/* price  */}
            <h1 className='mb-2 text-title-1 font-bold'>Price Details</h1>
            <div className='flex flex-col gap-2 '>
                {data?.price?.departure && (
                    <div className='flex flex-col gap-1'>
                        {data?.price?.arrival && (
                            <p className='mb-1 w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                                {data?.departure?.Flight?.Airline?.airline_name} - Departure
                            </p>
                        )}
                        {data?.passenger?.adult > 0 && (
                            <div className='flex items-center justify-between text-body-6'>
                                <p>{data?.passenger.adult} Adult</p>
                                <p>{formatRupiah(data?.price.departure)}</p>
                            </div>
                        )}

                        {data?.passenger?.child > 0 && (
                            <div className='flex items-center justify-between text-body-6'>
                                <p>{data?.passenger?.child} Child</p>
                                <p>{formatRupiah(data?.price?.departure)}</p>
                            </div>
                        )}
                        {data?.passenger?.baby > 0 && (
                            <div className='flex items-center justify-between text-body-6'>
                                <p>{data?.passenger?.baby} Baby</p>
                                <p>{formatRupiah(0)}</p>
                            </div>
                        )}
                    </div>
                )}
                {data?.price?.arrival && <div className='w-full border '></div>}
                {data?.price?.arrival && (
                    <div className='flex flex-col gap-1'>
                        <p className='mb-1 w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                            {data?.arrival?.Flight?.Airline?.airline_name}- Return
                        </p>
                        {data?.passenger?.adult > 0 && (
                            <div className='flex items-center justify-between text-body-6'>
                                <p>{data?.passenger?.adult} Adult</p>
                                <p>{formatRupiah(data?.price?.arrival)}</p>
                            </div>
                        )}

                        {data?.passenger?.child > 0 && (
                            <div className='flex items-center justify-between text-body-6'>
                                <p>{data?.passenger?.child} Child</p>
                                <p>{formatRupiah(data?.price?.arrival)}</p>
                            </div>
                        )}
                        {data?.passenger?.baby > 0 && (
                            <div className='flex items-center justify-between text-body-6'>
                                <p>{data?.passenger?.baby} Baby</p>
                                <p>{formatRupiah(0)}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className='my-1 w-full border'></div>
                <div className='flex flex-col gap-1 '>
                    <div className='flex items-center justify-between'>
                        <p className='font-bold'>Tax</p>
                        <p className='font-bold'>{formatRupiah(data?.price?.tax)}</p>
                    </div>
                    <div className='flex justify-between'>
                        <h1 className='text-title-1 font-bold'>Total</h1>
                        <h1 className='text-head-1 font-bold text-alert-3'>{formatRupiah(data?.price?.totalPrice)}</h1>
                    </div>
                </div>
            </div>
            {/* price */}
            {/* trick */}
            <div className='invisible h-[50px]'></div>
        </>
    );
}
