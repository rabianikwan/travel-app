'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

import Navbar from '@/components/Navbar';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AlertTop from '@/components/AlertTop';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function PaymentMethod({
    gopayInput,
    creditCardInput,
    virtualAccInput,
    handleChangeGopay,
    handleChangeVirtualAcc,
    handleChangeCreditCard,
    payments,
    selectedPayment,
    handleOpen,
}) {
    const paymentMenu = {
        1: (
            <div className='mx-3 flex flex-col gap-5 font-poppins lg:mx-16'>
                <div className='mt-3 flex gap-8 lg:mt-5'>
                    <div>
                        <Label htmlFor={'gopayName'} className='text-body-6 font-medium'>
                            First Name
                        </Label>
                        <Input
                            id={'gopayName'}
                            className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                            placeholder='Arief Rachman'
                            type='text'
                            name={`first_name`}
                            value={gopayInput.first_name}
                            onChange={handleChangeGopay}
                        />
                    </div>
                    <div>
                        <Label className='text-body-6 font-medium'>Last Name</Label>
                        <Input
                            className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                            placeholder='Hakim'
                            type='text'
                            name={`last_name`}
                            value={gopayInput.last_name}
                            onChange={handleChangeGopay}
                        />
                    </div>
                </div>
                <div className='mb-3 lg:mb-5'>
                    <Label className='text-body-6 font-medium'>Gopay Number</Label>
                    <Input
                        className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                        placeholder='+62/0'
                        type='number'
                        name={`gopay_number`}
                        value={gopayInput.gopay_number}
                        onChange={handleChangeGopay}
                    />
                </div>
            </div>
        ),
        2: (
            <div className='mx-3 flex flex-col gap-3 font-poppins lg:mx-16 lg:gap-5'>
                <div className='mt-5 flex gap-8'>
                    <div>
                        <Label className='text-body-6 font-medium'>First Name</Label>
                        <Input
                            className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                            placeholder='Arief Rachman'
                            type='text'
                            name={`first_name`}
                            value={virtualAccInput.first_name}
                            onChange={handleChangeVirtualAcc}
                        />
                    </div>
                    <div>
                        <Label className='text-body-6 font-medium'>Last Name</Label>
                        <Input
                            className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                            placeholder='Hakim'
                            type='text'
                            name={`last_name`}
                            value={virtualAccInput.last_name}
                            onChange={handleChangeVirtualAcc}
                        />
                    </div>
                </div>
                <div className='mb-3 lg:mb-5'>
                    <Label className='text-body-6 font-medium'>Email Address</Label>
                    <Input
                        className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                        placeholder='your@gmail.com'
                        type='text'
                        name={`email`}
                        value={virtualAccInput.email}
                        onChange={handleChangeVirtualAcc}
                    />
                </div>
            </div>
        ),
        3: (
            <div className='mx-3 flex flex-col gap-3 font-poppins lg:mx-16 lg:gap-5'>
                <div className='mt-5 hidden justify-center gap-4 lg:flex'>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/mastercard_logo.svg'} fill alt='' />
                    </div>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/visa_logo.svg'} fill alt='' />
                    </div>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/amex_logo.svg'} fill alt='' />
                    </div>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/paypal_logo.svg'} fill alt='' />
                    </div>
                </div>
                <div className='mt-3 lg:mt-0'>
                    <Label className='text-body-6 font-medium'>Card number</Label>
                    <Input
                        className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                        placeholder='4480 0000 0000 0000'
                        type='number'
                        value={creditCardInput.card_number}
                        name={'card_number'}
                        onChange={handleChangeCreditCard}
                    />
                </div>
                <div>
                    <Label className='text-body-6 font-medium'>Card holder name</Label>
                    <Input
                        placeholder='John Doe'
                        className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                        name={`card_holder_name`}
                        value={creditCardInput.card_holder_name}
                        onChange={handleChangeCreditCard}
                    />
                </div>
                <div className='flex gap-8 lg:mb-5'>
                    <div>
                        <Label className='text-body-6 font-medium'>CVV</Label>
                        <Input
                            className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                            placeholder='000'
                            type='number'
                            name={`cvv`}
                            value={creditCardInput.cvv}
                            onChange={handleChangeCreditCard}
                        />
                    </div>
                    <div>
                        <Label className='text-body-6 font-medium'>Expiry date</Label>
                        <Input
                            className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
                            placeholder='07/24'
                            type='text'
                            name={`expiry_date`}
                            value={creditCardInput.expiry_date}
                            onChange={handleChangeCreditCard}
                        />
                    </div>
                </div>

                <div className='flex justify-center gap-4 lg:hidden'>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/mastercard_logo.svg'} fill alt='' />
                    </div>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/visa_logo.svg'} fill alt='' />
                    </div>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/amex_logo.svg'} fill alt='' />
                    </div>
                    <div className='relative h-[30px] w-[30px]'>
                        <Image src={'/images/paypal_logo.svg'} fill alt='' />
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <>
            {payments &&
                payments.map((payment, index) => (
                    <div key={index}>
                        <div
                            className={`${
                                selectedPayment.id === payment.id ? 'bg-pur-3' : 'bg-net-5'
                            } flex w-full cursor-pointer items-center justify-between rounded-rad-1  px-4 py-2 text-body-6 lg:py-[14px] lg:text-title-1`}
                            onClick={() => handleOpen(payment)}>
                            <p className='text-white'>{payment.name}</p>
                            {selectedPayment.id === payment.id ? (
                                <FiChevronUp style={{ color: 'white', width: '20px', height: '20px' }} />
                            ) : (
                                <FiChevronDown style={{ color: 'white', width: '20px', height: '20px' }} />
                            )}
                        </div>

                        {selectedPayment.id === payment.id && paymentMenu[payment.id]}
                    </div>
                ))}
        </>
    );
}
