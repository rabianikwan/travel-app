'use client';

import Image from 'next/image';
import { formatRupiah } from '@/utils/formatRupiah';
import { fixedHour } from '@/utils/fixedHour';
import { extractWord } from '@/utils/extractWord';
import { reformatDate } from '@/utils/reformatDate';

export default function FlightDetails({ data, passengerType }) {
    return (
        <>
            <h1 className=' mb-2 mt-[64px] text-title-3 font-bold lg:mt-0'>Flight Details</h1>

            {/* label derpature */}
            {data?.pulang?.departure_date && (
                <div className='mb-2 mt-1'>
                    <h1 className='w-max rounded-rad-3 bg-pur-5 px-2 py-1 text-body-6 text-white lg:rounded-rad-4 lg:font-normal'>
                        Departure - Flight 1
                    </h1>
                </div>
            )}
            {/* label derpature */}

            {/* derpature data */}
            {data.berangkat?.departure_date && (
                <div>
                    <div className='flex justify-between'>
                        <div>
                            <h1 className='text-title-2 font-bold'>{fixedHour(data.berangkat.departure_time)}</h1>
                            <h1 className='text-body-6'>{reformatDate(data.berangkat.departure_date)}</h1>
                            <h1 className='text-body-6 font-medium'>{data.berangkat.Airport_from.airport_name}</h1>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Departure</h1>
                    </div>
                    <div className='mb-2 mt-4 w-full border text-net-3'></div>
                    <div className='flex items-center gap-2'>
                        <div className='relative h-[24px] w-[24px] '>
                            <Image src={data?.berangkat?.Airline?.image} fill alt='' />
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <h3 className='text-body-5 font-bold'>
                                    {data.berangkat.Airline.airline_name} - {data.berangkat.flight_class}
                                </h3>
                                <h3 className='text-body-5 font-bold'>{data.berangkat.Airline.airline_code}</h3>
                            </div>
                            <div>
                                <h3 className='text-body-5 font-bold'>Information : </h3>
                                <h4 className='text-body-6'>{extractWord(data.berangkat.description)} </h4>
                            </div>
                        </div>
                    </div>
                    <div className='mb-4 mt-2 w-full border text-net-3'></div>
                    <div className='flex justify-between'>
                        <div>
                            <h1 className='text-title-2 font-bold'>{fixedHour(data.berangkat.arrival_time)}</h1>
                            <h1 className='text-body-6'>{reformatDate(data.berangkat.arrival_date)}</h1>
                            <h1 className='text-body-6 font-medium'>{data.berangkat.Airport_to.airport_name}</h1>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Arrival</h1>
                    </div>
                </div>
            )}
            {/* derpature data */}

            {/* label arrival */}
            {data?.pulang?.departure_date && (
                <div className='mb-2 mt-4'>
                    <h1 className='w-max rounded-rad-3 bg-pur-5 px-2 py-1 text-body-6 font-normal text-white lg:rounded-rad-4'>
                        Return - Flight 2
                    </h1>
                </div>
            )}
            {/* label arrival */}

            {/* arrival data */}
            {data?.pulang?.departure_date && (
                <div>
                    <div className='flex justify-between'>
                        <div>
                            <h1 className='text-title-2 font-bold'>{fixedHour(data.pulang.departure_time)}</h1>
                            <h1 className='text-body-6'>{reformatDate(data.pulang.departure_date)}</h1>
                            <h1 className='text-body-6 font-medium'>{data.pulang.Airport_from.airport_name}</h1>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Departure</h1>
                    </div>
                    <div className='mb-2 mt-4 w-full border text-net-3'></div>
                    <div className='flex items-center gap-2'>
                        <div className='relative h-[24px] w-[24px] '>
                            <Image src={data?.pulang?.Airline?.image} fill alt='' />
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <h3 className='text-body-5 font-bold'>
                                    {data.pulang.Airline.airline_name} - {data.pulang.flight_class}
                                </h3>
                                <h3 className='text-body-5 font-bold'>{data.pulang.Airline.airline_code}</h3>
                            </div>
                            <div>
                                <h3 className='text-body-5 font-bold'>Information : </h3>
                                <h4 className='text-body-6'>{extractWord(data.pulang.description)} </h4>
                            </div>
                        </div>
                    </div>
                    <div className='mb-4 mt-2 w-full border text-net-3'></div>
                    <div className='flex justify-between'>
                        <div>
                            <h1 className='text-title-2 font-bold'>{fixedHour(data.pulang.arrival_time)}</h1>

                            <h1 className='text-body-6'>{reformatDate(data.pulang.arrival_date)}</h1>
                            <h1 className='text-body-6 font-medium'>{data.pulang.Airport_to.airport_name}</h1>
                        </div>
                        <h1 className='text-body-3 font-bold text-pur-3'>Arrival</h1>
                    </div>
                </div>
            )}
            {/* arrival data */}

            {/* divider */}
            <div className='mb-2 mt-4 w-full border text-net-3'></div>
            {/* divider */}

            {/* price  */}
            <h1 className='mb-2 text-title-1 font-bold'>Price Details</h1>
            <div className='flex flex-col gap-2'>
                {data?.berangkat?.departure_date && (
                    <div className='flex flex-col gap-1'>
                        {data?.pulang?.departure_date && (
                            <p className='mb-1 w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                                {data?.berangkat?.Airline?.airline_name} - Departure
                            </p>
                        )}
                        {passengerType.dewasa > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{passengerType.dewasa} Adult</h1>
                                <h1> {formatRupiah(data?.berangkat?.price)}</h1>
                            </div>
                        )}
                        {passengerType.anak > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{passengerType.anak} Child</h1>
                                <h1> {formatRupiah(data?.berangkat?.price)}</h1>
                            </div>
                        )}
                        {passengerType.bayi > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{passengerType.bayi} Baby</h1>
                                <h1> {formatRupiah(0)}</h1>
                            </div>
                        )}
                    </div>
                )}
                {data?.pulang?.departure_date && <div className='w-full border '></div>}
                {data?.pulang?.departure_date && (
                    <div className='flex flex-col gap-1'>
                        {data?.pulang?.departure_date && (
                            <p className='mb-1 w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                                {data?.pulang?.Airline?.airline_name} - Return
                            </p>
                        )}
                        {passengerType.dewasa > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{passengerType.dewasa} Adult</h1>
                                <h1> {formatRupiah(data?.pulang?.price)}</h1>
                            </div>
                        )}
                        {passengerType.anak > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{passengerType.anak} Child</h1>
                                <h1> {formatRupiah(data?.pulang?.price)}</h1>
                            </div>
                        )}
                        {passengerType.bayi > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{passengerType.bayi} Baby</h1>
                                <h1> {formatRupiah(0)}</h1>
                            </div>
                        )}
                    </div>
                )}
                <div className='mb-3 mt-2 w-full border text-net-3'></div>
                <div className='flex justify-between text-body-6'>
                    <h1>Tax</h1>
                    <h1>
                        <span>{formatRupiah(data.tax)}</span>
                    </h1>
                </div>

                <div className='flex justify-between text-title-2 font-bold'>
                    <h1>Total</h1>
                    <h1 className='text-pur-4'>
                        <span className='ml-1'>{formatRupiah(data.totalPrice)}</span>
                    </h1>
                </div>
            </div>
            {/* price  */}
            <div className='invisible h-[120px] lg:hidden'></div>
        </>
    );
}
