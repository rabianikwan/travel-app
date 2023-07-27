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
import { FiArrowLeft } from 'react-icons/fi';

export default function MobileTransactionHistoryDetails({ handleOpen, historyItem, handleActionPaid, handleActionUnpaid }) {
    return (
        <div className='fixed inset-0 top-0 z-20 h-screen overflow-y-scroll bg-white font-poppins lg:hidden'>
            <div className='px-4'>
                <div
                    onClick={handleOpen}
                    className='fixed inset-x-0 top-0  flex cursor-pointer items-center gap-6 bg-pur-3  px-[16px] py-[10px] text-white '>
                    <FiArrowLeft className='h-[30px] w-[30px]' /> <h1>Flight Details</h1>
                </div>

                {/* transaction title */}
                <div className='mx-4 mt-[64px] flex flex-col gap-3 rounded-rad-3 bg-white  '>
                    <div className='flex items-center justify-between '>
                        <h1
                            className={`${historyStatusStyling(
                                historyItem?.transaction?.transaction_status
                            )} w-max rounded-rad-4  px-3 py-1 text-body-6 text-white`}>
                            {historyItem?.transaction?.transaction_status}
                        </h1>
                        <p className='text-title-1 font-bold'>
                            {historyItem?.transaction?.Flights[1] ? 'Round Trip' : 'One Trip'}
                        </p>
                    </div>
                </div>
                {/* transaction title */}

                <div className='mx-4 mt-3 flex flex-col gap-4 rounded-[10px] border border-pur-2 p-4'>
                    {/* Booking code */}
                    <h1 className='font-medium'>
                        Booking Code: <span className='font-bold text-pur-3'>{historyItem?.transaction?.transaction_code}</span>
                    </h1>
                    {/* Booking code */}

                    {/* Detail Transaction 0 */}
                    {historyItem?.transaction?.Flights[0] && (
                        <div className='flex flex-col gap-2'>
                            {historyItem?.transaction?.Flights[1] && (
                                <p className='w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                                    Departure - Flight 1
                                </p>
                            )}

                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-title-1 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[0]?.departure_time)}
                                    </p>
                                    <p className='text-body-5'>
                                        {reformatDate(historyItem?.transaction?.Flights[0]?.departure_date)}
                                    </p>
                                    <p className='text-body-5 font-medium'>
                                        {historyItem?.transaction?.Flights[0]?.Airport_from?.airport_name}
                                    </p>
                                </div>
                                <p className='text-body-5 font-bold text-pur-3'>Departure</p>
                            </div>

                            <div className='w-full border'></div>

                            <div className='flex items-center gap-4 '>
                                <Image src={historyItem?.transaction?.Flights[0]?.Airline?.image} alt='' width={24} height={24} />

                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <h1 className='text-body-6 font-bold'>
                                            {historyItem?.transaction?.Flights[0]?.Airline?.airline_name} -{' '}
                                            {historyItem?.transaction?.Flights[0]?.flight_class}
                                        </h1>
                                        <h2 className='text-body-5 font-bold'>
                                            {historyItem?.transaction?.Flights[0]?.Airline?.airline_code}
                                        </h2>
                                    </div>
                                    <div>
                                        <h3 className='text-body-5 font-bold'>Information :</h3>
                                        <p className='text-body-5 font-normal'>
                                            {extractWord(historyItem?.transaction?.Flights[0]?.description)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full border'></div>

                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-title-1 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[0]?.arrival_time)}
                                    </p>
                                    <p className='text-body-5'>
                                        {reformatDate(historyItem?.transaction?.Flights[0]?.arrival_date)}
                                    </p>
                                    <p className='text-body-5 font-medium'>
                                        {historyItem?.transaction?.Flights[0]?.Airport_to?.airport_name}
                                    </p>
                                </div>
                                <p className='text-body-5 font-bold text-pur-3'>Arrival</p>
                            </div>
                        </div>
                    )}
                    {/* Detail Transaction 0 */}

                    {historyItem?.transaction?.Flights[1] && <div className='w-full border '></div>}

                    {/* Detail Transaction 1 */}
                    {historyItem?.transaction?.Flights[1] && (
                        <div className='flex flex-col gap-2'>
                            <p className='w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>Return - Flight 2</p>

                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-title-1 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[1]?.departure_time)}
                                    </p>
                                    <p className='text-body-5'>
                                        {reformatDate(historyItem?.transaction?.Flights[1]?.departure_date)}
                                    </p>
                                    <p className='text-body-5 font-medium'>
                                        {historyItem?.transaction?.Flights[1]?.Airport_from?.airport_name}
                                    </p>
                                </div>
                                <p className='text-body-5 font-bold text-pur-3'>Departure</p>
                            </div>

                            <div className='w-full border'></div>

                            <div className='flex items-center gap-4 '>
                                <Image src={historyItem?.transaction?.Flights[1]?.Airline.image} alt='' width={24} height={24} />

                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <h1 className='text-body-6 font-bold'>
                                            {historyItem?.transaction?.Flights[1]?.Airline?.airline_name} -{' '}
                                            {historyItem?.transaction?.Flights[1]?.flight_class}
                                        </h1>
                                        <h2 className='text-body-5 font-bold'>
                                            {historyItem?.transaction?.Flights[1]?.Airline.airline_code}
                                        </h2>
                                    </div>
                                    <div>
                                        <h3 className='text-body-5 font-bold'>Information :</h3>
                                        <p className='text-body-5 font-normal'>
                                            {extractWord(historyItem?.transaction?.Flights[1]?.description)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full border'></div>

                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-title-1 font-bold'>
                                        {fixedHour(historyItem?.transaction?.Flights[1]?.arrival_time)}
                                    </p>
                                    <p className='text-body-5'>
                                        {reformatDate(historyItem?.transaction?.Flights[1]?.arrival_date)}
                                    </p>
                                    <p className='text-body-5 font-medium'>
                                        {historyItem?.transaction?.Flights[1]?.Airport_to?.airport_name}
                                    </p>
                                </div>
                                <p className='text-body-5 font-bold text-pur-3'>Arrival</p>
                            </div>
                        </div>
                    )}
                    {/* Detail Transaction 1 */}
                </div>

                {/* Rincian Harga */}
                <div className='my-3 flex flex-col gap-2 px-4'>
                    <h3 className='text-title-1 font-bold'>Price Details</h3>
                    {/* Price Departure */}
                    {historyItem?.transaction?.Flights[0] && (
                        <div>
                            {historyItem?.transaction?.Flights[1] && (
                                <p className='w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                                    {historyItem?.transaction?.Flights[0]?.Airline?.airline_name} - Departure
                                </p>
                            )}
                            {historyItem?.type_passenger?.adult > 0 && (
                                <div className='flex items-center justify-between'>
                                    <p>{historyItem?.type_passenger?.adult} Adult</p>
                                    <p>{formatRupiah(historyItem?.transaction?.Flights[0]?.price)}</p>
                                </div>
                            )}

                            {historyItem?.type_passenger?.child > 0 && (
                                <div className='flex items-center justify-between'>
                                    <p>{historyItem?.type_passenger?.child} Child</p>
                                    <p>{formatRupiah(historyItem?.transaction?.Flights[0]?.price)}</p>
                                </div>
                            )}
                            {historyItem?.type_passenger?.baby > 0 && (
                                <div className='flex items-center justify-between'>
                                    <p>{historyItem?.type_passenger?.baby} Baby</p>
                                    <p>{formatRupiah(0)}</p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Price Departure */}
                    {historyItem?.transaction?.Flights[1] && <div className='w-full border '></div>}
                    {/* Price Arrival */}
                    {historyItem?.transaction?.Flights[1] && (
                        <div>
                            <p className='w-max rounded-rad-4 bg-pur-5 px-2 py-1 text-body-6 text-white'>
                                {historyItem?.transaction?.Flights[1]?.Airline?.airline_name} - Return
                            </p>
                            {historyItem?.type_passenger?.adult > 0 && (
                                <div className='flex items-center justify-between'>
                                    <p>{historyItem?.type_passenger?.adult} Adult</p>
                                    <p>{formatRupiah(historyItem?.transaction?.Flights[1]?.price)}</p>
                                </div>
                            )}

                            {historyItem?.type_passenger?.child > 0 && (
                                <div className='flex items-center justify-between'>
                                    <p>{historyItem?.type_passenger?.child} Child</p>
                                    <p>{formatRupiah(historyItem?.transaction?.Flights[1]?.price)}</p>
                                </div>
                            )}
                            {historyItem?.type_passenger?.baby > 0 && (
                                <div className='flex items-center justify-between'>
                                    <p>{historyItem?.type_passenger?.baby} Baby</p>
                                    <p>{formatRupiah(0)}</p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Price Arrival */}

                    <div className='my-1 w-full border'></div>
                    <div className='flex flex-col gap-1 '>
                        <div className='flex items-center justify-between'>
                            <p className='font-bold'>Tax</p>
                            <p className='font-bold'>{formatRupiah(historyItem?.price?.tax)}</p>
                        </div>
                    </div>
                </div>
                {/* Rincian Harga */}

                <div className='  invisible h-[120px] '></div>

                <div className='fixed inset-x-0 bottom-0  flex  h-[120px] flex-col gap-3   bg-white px-4 py-4 shadow-low '>
                    <div className='flex justify-between'>
                        <h1 className='text-title-1 font-bold'>Total</h1>
                        <h1 className='text-head-1 font-bold text-alert-3'>{formatRupiah(historyItem?.price?.total)}</h1>
                    </div>

                    {historyItem?.transaction?.transaction_status.toLowerCase() === 'unpaid' ? (
                        <Button
                            onClick={handleActionUnpaid}
                            className='my-1 w-full rounded-rad-3 bg-alert-3 py-2 font-medium text-white hover:bg-red-500 '>
                            Continue to Pay
                        </Button>
                    ) : (
                        // BUTOON
                        <Button
                            onClick={handleActionPaid}
                            className='my-1 w-full rounded-rad-3 bg-pur-3 py-2 font-medium text-white hover:bg-pur-2 '>
                            Generate E-Ticket
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
