'use client';

import Button from './Button';

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

export default function TransactionHistoryDetails({ historyItem, handleUpdatePayment, handleSendTicket }) {
    return (
        <>
            {historyItem && (
                <div>
                    <div className='flex justify-between'>
                        <h1 className='text-title-2 font-bold'>Transaction Details</h1>
                        <h1
                            className={`${historyStatusStyling(
                                historyItem?.transaction?.transaction_status
                            )} w-max rounded-rad-4 px-3 py-1 text-body-6`}>
                            {historyItem?.transaction?.transaction_status}
                        </h1>
                    </div>
                    <h2 className='text-title-3'>
                        Booking Code : <span className='font-bold text-pur-5'> {historyItem?.transaction?.transaction_code}</span>
                    </h2>
                    {historyItem?.transaction?.Flights[0] && (
                        <div className={`${historyItem?.transaction?.Flights[1] && 'mt-3'} `}>
                            {historyItem?.transaction?.Flights[1] && (
                                <h1 className='mb-2 w-max rounded-rad-2 bg-pur-4 px-4 py-2 text-body-6 text-white'>Departure</h1>
                            )}
                            <div className='flex justify-between'>
                                <div>
                                    <h1 className='text-title-2 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[0]?.departure_time)}
                                    </h1>
                                    <h1 className='text-body-6'>
                                        {reformatDate(historyItem?.transaction?.Flights[0]?.departure_date)}
                                    </h1>
                                    <h1 className='text-body-6 font-medium'>
                                        {historyItem?.transaction?.Flights[0]?.Airport_from?.airport_name}
                                    </h1>
                                </div>
                                <h1 className='text-body-3 font-bold text-pur-3'>Departure</h1>
                            </div>
                            <div className='mb-2 mt-4 w-full border text-net-3'></div>
                            <div className='flex items-center gap-2'>
                                <div className='relative h-[24px] w-[24px] '>
                                    <Image src={historyItem?.transaction?.Flights[0]?.Airline?.image} fill alt='' />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <h3 className='text-body-5 font-bold'>
                                            {historyItem?.transaction?.Flights[0]?.Airline.airline_name} -{' '}
                                            {historyItem?.transaction?.Flights[0]?.flight_class}
                                        </h3>
                                        <h3 className='text-body-5 font-bold'>
                                            {historyItem?.transaction?.Flights[0]?.Airline.airline_code}
                                        </h3>
                                    </div>
                                    <div>
                                        <h3 className='text-body-5 font-bold'>Information : </h3>
                                        <div>
                                            {historyItem?.transaction?.Passengers &&
                                                historyItem?.transaction?.Passengers?.map((passenger, index) => {
                                                    return (
                                                        <div key={index} className=''>
                                                            <h1 className='text-body-5 font-medium text-pur-5'>
                                                                Passenger {index + 1}:{' '}
                                                                <span className='ml-1'>
                                                                    {passenger.title}
                                                                    {passenger.name}
                                                                </span>
                                                            </h1>
                                                            <h2>
                                                                ID: <span className='ml-1'>{passenger.nik_paspor}</span>
                                                            </h2>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-4 mt-2 w-full border text-net-3'></div>
                            <div className='flex justify-between'>
                                <div>
                                    <h1 className='text-title-2 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[0]?.arrival_time)}
                                    </h1>
                                    <h1 className='text-body-6'>
                                        {reformatDate(historyItem?.transaction?.Flights[0]?.arrival_date)}
                                    </h1>
                                    <h1 className='text-body-6 font-medium'>
                                        {historyItem?.transaction?.Flights[0]?.Airport_to.airport_name}
                                    </h1>
                                </div>
                                <h1 className='text-body-3 font-bold text-pur-3'>Arrival</h1>
                            </div>
                        </div>
                    )}
                    <div
                        className={`${
                            historyItem?.transaction?.Flights[1] ? 'block' : 'hidden'
                        } mb-2 mt-4 w-full border text-net-3`}></div>
                    {historyItem?.transaction?.Flights[1] && (
                        <div className='mt-3'>
                            <h1 className='mb-2 w-max rounded-rad-2 bg-pur-4 px-4 py-2 text-body-6 text-white'>Return</h1>
                            <div className='flex justify-between'>
                                <div>
                                    <h1 className='text-title-2 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[1]?.departure_time)}
                                    </h1>
                                    <h1 className='text-body-6'>
                                        {reformatDate(historyItem?.transaction?.Flights[1]?.departure_date)}
                                    </h1>
                                    <h1 className='text-body-6 font-medium'>
                                        {historyItem?.transaction?.Flights[1]?.Airport_from?.airport_name}
                                    </h1>
                                </div>
                                <h1 className='text-body-3 font-bold text-pur-3'>Departure</h1>
                            </div>
                            <div className='mb-2 mt-4 w-full border text-net-3'></div>
                            <div className='flex items-center gap-2'>
                                <div className='relative h-[24px] w-[24px] '>
                                    <Image src={historyItem?.transaction?.Flights[1]?.Airline?.image} fill alt='' />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <h3 className='text-body-5 font-bold'>
                                            {historyItem?.transaction?.Flights[1]?.Airline.airline_name} -{' '}
                                            {historyItem?.transaction?.Flights[1]?.flight_class}
                                        </h3>
                                        <h3 className='text-body-5 font-bold'>
                                            {historyItem?.transaction?.Flights[1]?.Airline.airline_code}
                                        </h3>
                                    </div>
                                    <div>
                                        <h3 className='text-body-5 font-bold'>Information : </h3>
                                        <div>
                                            {historyItem?.transaction?.Passengers &&
                                                historyItem?.transaction?.Passengers?.map((passenger, index) => {
                                                    return (
                                                        <div key={index} className=''>
                                                            <h1 className='text-body-5 font-medium text-pur-5'>
                                                                Passenger {index + 1}:{' '}
                                                                <span className='ml-1'>{passenger.name}</span>
                                                            </h1>
                                                            <h2>
                                                                ID: <span className='ml-1'>{passenger.nik_paspor}</span>
                                                            </h2>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mb-4 mt-2 w-full border text-net-3'></div>
                            <div className='flex justify-between'>
                                <div>
                                    <h1 className='text-title-2 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[1]?.arrival_time)}
                                    </h1>
                                    <h1 className='text-body-6'>
                                        {reformatDate(historyItem?.transaction?.Flights[1]?.arrival_date)}
                                    </h1>
                                    <h1 className='text-body-6 font-medium'>
                                        {historyItem?.transaction?.Flights[1]?.Airport_to.airport_name}
                                    </h1>
                                </div>
                                <h1 className='text-body-3 font-bold text-pur-3'>Arrival</h1>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className='mb-2 mt-4 w-full border text-net-3'></div>
            <h1 className='mb-2 text-body-6 font-bold'>Price Details</h1>
            <div>
                {historyItem?.transaction?.Flights[0] && (
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-bold'>{historyItem?.transaction?.Flights[0].Airline.airline_name}</h1>
                        {historyItem?.type_passenger?.adult > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{historyItem?.type_passenger?.adult} Adult</h1>
                                <h1> {formatRupiah(historyItem?.type_passenger?.adult * historyItem?.price?.departure)}</h1>
                            </div>
                        )}
                        {historyItem?.type_passenger?.child > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{historyItem?.type_passenger?.child} Child</h1>
                                <h1> {formatRupiah(historyItem?.type_passenger?.child * historyItem?.price?.departure)}</h1>
                            </div>
                        )}
                        {historyItem?.type_passenger?.baby > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{historyItem?.type_passenger?.baby} Baby</h1>
                                <h1> RP 0</h1>
                            </div>
                        )}

                        <div className='mb-3 mt-2 w-full border text-net-3'></div>
                        <div
                            className={`${
                                historyItem?.transaction?.Flights[1] ? 'hidden' : 'block'
                            } flex justify-between text-body-6`}>
                            <h1>Tax</h1>
                            <h1>
                                <span>{formatRupiah(historyItem?.price?.tax)}</span>
                            </h1>
                        </div>
                        <div
                            className={`${
                                historyItem?.transaction?.Flights[1] ? 'hidden' : 'block'
                            } flex justify-between text-title-2 font-bold`}>
                            <h1>Total</h1>
                            <h1 className='text-pur-4'>
                                <span className='ml-1'>{formatRupiah(historyItem?.price?.total)}</span>
                            </h1>
                        </div>
                    </div>
                )}

                {historyItem?.transaction?.Flights[1] && (
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-bold'>{historyItem?.transaction?.Flights[1].Airline.airline_name}</h1>
                        {historyItem?.type_passenger?.adult > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{historyItem?.type_passenger?.adult} Adult</h1>
                                <h1> {formatRupiah(historyItem?.type_passenger?.adult * historyItem?.price?.arrival)}</h1>
                            </div>
                        )}
                        {historyItem?.type_passenger?.child > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{historyItem?.type_passenger?.child} Child</h1>
                                <h1> {formatRupiah(historyItem?.type_passenger?.child * historyItem?.price?.arrival)}</h1>
                            </div>
                        )}
                        {historyItem?.type_passenger?.baby > 0 && (
                            <div className='flex justify-between text-body-6'>
                                <h1>{historyItem?.type_passenger?.baby} Baby</h1>
                                <h1> RP 0</h1>
                            </div>
                        )}

                        <div className='mb-3 mt-2 w-full border text-net-3'></div>
                        <div className='flex justify-between text-body-6'>
                            <h1>Tax</h1>
                            <h1>
                                <span>{formatRupiah(historyItem?.price?.tax)}</span>
                            </h1>
                        </div>
                        <div className='flex justify-between text-title-2 font-bold'>
                            <h1>Total</h1>
                            <h1 className='text-pur-4'>
                                <span className='ml-1'>{formatRupiah(historyItem?.price?.total)}</span>
                            </h1>
                        </div>
                    </div>
                )}

                {historyItem?.transaction?.transaction_status.toLowerCase() === 'unpaid' ? (
                    <Button
                        onClick={() => handleUpdatePayment(historyItem?.transaction)}
                        className='mt-8 w-full rounded-rad-4 bg-alert-3 py-4 text-head-1 font-medium text-white hover:bg-red-500 '>
                        Continue to Pay
                    </Button>
                ) : (
                    // BUTOON
                    <Button
                        onClick={() => handleSendTicket(historyItem?.transaction?.Flights[0]?.Transaction_Flight?.transaction_id)}
                        className='mt-8 w-full rounded-rad-4 bg-pur-3 py-4 text-head-1 font-medium text-white hover:bg-pur-2 '>
                        Generate E-Ticket
                    </Button>
                )}
            </div>
        </>
    );
}
