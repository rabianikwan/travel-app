'use client';

//core
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

//third parties
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import { FiChevronUp, FiChevronDown, FiArrowLeft } from 'react-icons/fi';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { getPassengerTypeTotal } from '@/store/flight';

//component
import Navbar from '@/components/Navbar';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AlertTop from '@/components/AlertTop';
import TransactionDetails from '@/components/TransactionDetails';
import MobileTransactionDetails from '@/components/MobileTransactionDetails';
import PaymentMethod from '@/components/PaymentMethod';
import FixedAlert from '@/components/FixedAlert';

// utils
import { fixedHour } from '@/utils/fixedHour';
import { convertToDate, convertToTime } from '@/utils/converDateTime';
import { reformatDate, reformatDateWithHour } from '@/utils/reformatDate';
import { extractWord } from '@/utils/extractWord';
import { formatRupiah } from '@/utils/formatRupiah';
import { IoLocationSharp } from 'react-icons/io5';
import { reformatDuration } from '@/utils/reformatDuration';

export default function OrderPaymentId() {
    /*=== core ===*/
    const { id } = useParams();
    const router = useRouter();

    /*=== next auth ===*/
    const { data: session, status } = useSession();
    const token = session?.user?.token;

    /*=== redux ===*/
    const passengerType = useSelector(getPassengerTypeTotal); // Get passenger type total

    /*=== state ===*/
    const [isLoading, setIsLoading] = useState(true);
    const [fetchDataUser, setFetchDataUser] = useState(true);
    const [transactionHistory, setTransactionHistory] = useState(null);
    const [fetchDataHistory, setFetchDataHistory] = useState(true);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    // const [isReadyToPay, setIsReadyToPay] = useState(false);
    const [formGopayInputStatus, setFormGopayInputStatus] = useState(false);
    const [formVirtualAccInputStatus, setFormVirtualAccInputStatus] = useState(false);
    const [formCreditCardStatus, setFormCreditCardStatus] = useState(false);
    const [creditCardInput, setCreditCardInput] = useState({
        card_number: '',
        card_holder_name: '',
        cvv: '',
        expiry_date: '',
    });
    const [gopayInput, setGopayInput] = useState({
        first_name: '',
        last_name: '',
        gopay_number: '',
    });
    const [virtualAccInput, setVirtualAccInput] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    const [open, setOpen] = useState({
        id: 0,
    });

    const datas = [
        {
            id: 1,
            name: 'Gopay',
        },
        {
            id: 2,
            name: 'Virtual Account',
        },
        {
            id: 3,
            name: 'Credit Card',
        },
    ];

    /*=== function ===*/

    const handleChangeVirtualAcc = (event) => {
        setVirtualAccInput({ ...virtualAccInput, [event.target.name]: event.target.value });
        if (!virtualAccInput.email || !virtualAccInput.first_name || !virtualAccInput.last_name) {
            setFormVirtualAccInputStatus(false);

            return;
        }
        setFormVirtualAccInputStatus(true);
    };

    const handleChangeCreditCard = (event) => {
        setCreditCardInput({ ...creditCardInput, [event.target.name]: event.target.value });
        if (
            !creditCardInput.card_number ||
            !creditCardInput.card_holder_name ||
            !creditCardInput.cvv ||
            !creditCardInput.expiry_date
        ) {
            setFormCreditCardStatus(false);

            return;
        }
        setFormCreditCardStatus(true);

        // setIsReadyToPay(true);
    };

    const handleChangeGopay = (event) => {
        setGopayInput({ ...gopayInput, [event.target.name]: event.target.value });
        if (!gopayInput.first_name || !gopayInput.last_name || !gopayInput.gopay_number) {
            setFormGopayInputStatus(false);

            return;
        }
        setFormGopayInputStatus(true);
    };

    //     1: (
    //         <div className='mx-16 flex flex-col gap-5 font-poppins'>
    //             <div className='mt-5 flex gap-8'>
    //                 <div>
    //                     <Label htmlFor={'gopayName'} className='text-body-6 font-medium'>
    //                         First Name
    //                     </Label>
    //                     <Input
    //                         id={'gopayName'}
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Arief Rachman'
    //                         type='text'
    //                         name={`first_name`}
    //                         value={gopayInput.first_name}
    //                         onChange={handleChangeGopay}
    //                     />
    //                 </div>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>Last Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Hakim'
    //                         type='text'
    //                         name={`last_name`}
    //                         value={gopayInput.last_name}
    //                         onChange={handleChangeGopay}
    //                     />
    //                 </div>
    //             </div>
    //             <div className='mb-5'>
    //                 <Label className='text-body-6 font-medium'>Gopay Number</Label>
    //                 <Input
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     placeholder='+62'
    //                     type='number'
    //                     name={`gopay_number`}
    //                     value={gopayInput.gopay_number}
    //                     onChange={handleChangeGopay}
    //                 />
    //             </div>
    //         </div>
    //     ),
    //     2: (
    //         <div className='mx-16 flex flex-col gap-5 font-poppins'>
    //             <div className='mt-5 flex gap-8'>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>First Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Arief Rachman'
    //                         type='text'
    //                         name={`first_name`}
    //                         value={virtualAccInput.first_name}
    //                         onChange={handleChangeVirtualAcc}
    //                     />
    //                 </div>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>Last Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Hakim'
    //                         type='text'
    //                         name={`last_name`}
    //                         value={virtualAccInput.last_name}
    //                         onChange={handleChangeVirtualAcc}
    //                     />
    //                 </div>
    //             </div>
    //             <div className='mb-5'>
    //                 <Label className='text-body-6 font-medium'>Email Address</Label>
    //                 <Input
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     placeholder='your@gmail.com'
    //                     type='text'
    //                     name={`email`}
    //                     value={virtualAccInput.email}
    //                     onChange={handleChangeVirtualAcc}
    //                 />
    //             </div>
    //         </div>
    //     ),
    //     3: (
    //         <div className='mx-16 flex flex-col gap-5 font-poppins'>
    //             <div className='mt-5 flex justify-center gap-4'>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/mastercard_logo.svg'} fill alt='' />
    //                 </div>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/visa_logo.svg'} fill alt='' />
    //                 </div>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/amex_logo.svg'} fill alt='' />
    //                 </div>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/paypal_logo.svg'} fill alt='' />
    //                 </div>
    //             </div>
    //             <div>
    //                 <Label className='text-body-6 font-medium'>Card number</Label>
    //                 <Input
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     placeholder='4480 0000 0000 0000'
    //                     type='number'
    //                     value={creditCardInput.card_number}
    //                     name={'card_number'}
    //                     onChange={handleChangeCreditCard}
    //                 />
    //             </div>
    //             <div>
    //                 <Label className='text-body-6 font-medium'>Card holder name</Label>
    //                 <Input
    //                     placeholder='John Doe'
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     name={`card_holder_name`}
    //                     value={creditCardInput.card_holder_name}
    //                     onChange={handleChangeCreditCard}
    //                 />
    //             </div>

    //             <div className='mb-5 flex gap-8'>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>CVV</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='000'
    //                         type='number'
    //                         name={`cvv`}
    //                         value={creditCardInput.cvv}
    //                         onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>Expiry date</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='07/24'
    //                         type='text'
    //                         name={`expiry_date`}
    //                         value={creditCardInput.expiry_date}
    //                         onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //             </div>
    //         </div>
    //     ),
    // };

    // const paymentMenuMobile = {
    //     1: (
    //         <div className='mx-3 flex flex-col gap-3 font-poppins'>
    //             <div className='mt-3 flex gap-8'>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>First Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Arief Rachman'
    //                         type='text'
    //                         // name={`cvv`}
    //                         // value={creditCardInput.cvv}
    //                         // onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>Last Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Hakim'
    //                         type='text'
    //                         // name={`expiry_date`}
    //                         // value={creditCardInput.expiry_date}
    //                         // onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //             </div>
    //             <div className='mb-3'>
    //                 <Label className='text-body-6 font-medium'>Gopay Number</Label>
    //                 <Input
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     placeholder='+62'
    //                     type='number'
    //                     // value={creditCardInput.card_number}
    //                     // name={'card_number'}
    //                     // onChange={handleChangeCreditCard}
    //                 />
    //             </div>
    //         </div>
    //     ),
    //     2: (
    //         <div className='mx-3 flex flex-col gap-3 font-poppins'>
    //             <div className='mt-3 flex gap-8'>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>First Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Arief Rachman'
    //                         type='text'
    //                         // name={`cvv`}
    //                         // value={creditCardInput.cvv}
    //                         // onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>Last Name</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='Hakim'
    //                         type='text'
    //                         // name={`expiry_date`}
    //                         // value={creditCardInput.expiry_date}
    //                         // onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //             </div>
    //             <div className='mb-3'>
    //                 <Label className='text-body-6 font-medium'>Email Address</Label>
    //                 <Input
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     placeholder='your@gmail.com'
    //                     type='text'
    //                     // value={creditCardInput.card_number}
    //                     // name={'card_number'}
    //                     // onChange={handleChangeCreditCard}
    //                 />
    //             </div>
    //         </div>
    //     ),
    //     3: (
    //         <div className='mx-3 flex flex-col gap-3 font-poppins'>
    //             <div className='mt-3 '>
    //                 <Label className='text-body-6 font-medium'>Card number</Label>
    //                 <Input
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     placeholder='4480 0000 0000 0000'
    //                     type='number'
    //                     value={creditCardInput.card_number}
    //                     name={'card_number'}
    //                     onChange={handleChangeCreditCard}
    //                 />
    //             </div>
    //             <div>
    //                 <Label className='text-body-6 font-medium'>Card holder name</Label>
    //                 <Input
    //                     placeholder='John Doe'
    //                     className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                     name={`card_holder_name`}
    //                     value={creditCardInput.card_holder_name}
    //                     onChange={handleChangeCreditCard}
    //                 />
    //             </div>

    //             <div className='flex gap-8'>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>CVV</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='000'
    //                         type='number'
    //                         name={`cvv`}
    //                         value={creditCardInput.cvv}
    //                         onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //                 <div>
    //                     <Label className='text-body-6 font-medium'>Expiry date</Label>
    //                     <Input
    //                         className='cursor-pointer border-[1px] border-l-0 border-r-0 border-t-0  border-b-net-2 py-1 font-poppins text-body-6 font-medium'
    //                         placeholder='07/24'
    //                         type='text'
    //                         name={`expiry_date`}
    //                         value={creditCardInput.expiry_date}
    //                         onChange={handleChangeCreditCard}
    //                     />
    //                 </div>
    //             </div>
    //             <div className='flex justify-center gap-4'>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/mastercard_logo.svg'} fill alt='' />
    //                 </div>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/visa_logo.svg'} fill alt='' />
    //                 </div>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/amex_logo.svg'} fill alt='' />
    //                 </div>
    //                 <div className='relative h-[30px] w-[30px]'>
    //                     <Image src={'/images/paypal_logo.svg'} fill alt='' />
    //                 </div>
    //             </div>
    //         </div>
    //     ),
    // };

    const handleVisibleAlert = (text, alertType) => {
        setAlertText(text);
        setAlertType(alertType);
        setVisibleAlert(!visibleAlert);
    };

    const handleOpen = (value) => {
        if (value.id === datas[0].id) {
            setVirtualAccInput({
                first_name: '',
                last_name: '',
                email: '',
            });
            setCreditCardInput({
                card_number: '',
                card_holder_name: '',
                cvv: '',
                expiry_date: '',
            });
        } else if (value.id === datas[1].id) {
            setGopayInput({
                first_name: '',
                last_name: '',
                gopay_number: '',
            });
            setCreditCardInput({
                card_number: '',
                card_holder_name: '',
                cvv: '',
                expiry_date: '',
            });
        } else {
            setGopayInput({
                first_name: '',
                last_name: '',
                gopay_number: '',
            });
            setVirtualAccInput({
                first_name: '',
                last_name: '',
                email: '',
            });
        }
        setOpen((prev) =>
            prev.id === value.id
                ? {
                      id: 0,
                  }
                : {
                      id: value.id,
                  }
        );
    };

    const handleCheckAll = () => {
        if (formGopayInputStatus && gopayInput.first_name && gopayInput.last_name && gopayInput.gopay_number) {
            return true;
        }
        if (formVirtualAccInputStatus && virtualAccInput.email && virtualAccInput.first_name && virtualAccInput.last_name) {
            return true;
        }
        if (
            formCreditCardStatus &&
            creditCardInput.card_number &&
            creditCardInput.card_holder_name &&
            creditCardInput.cvv &&
            creditCardInput.expiry_date
        ) {
            return true;
        }
        return false;
    };

    const handleUpdatePayment = async (transaction_code) => {
        try {
            const URL_UPDATE_PAYMENT = 'https://kel1airplaneapi-production.up.railway.app/api/v1/transaction/update';

            if (handleCheckAll()) {
                const res = await axios.put(
                    URL_UPDATE_PAYMENT,
                    {
                        transaction_code,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // console.log('PESAN UPDATE_PAYMENT:', res);

                router.replace(`/order/payment/${id}/payment-success`);
            }
        } catch (error) {
            // console.log(error.message);
        }
    };

    /*=== effects ===*/
    useEffect(() => {
        if (token) {
            if (fetchDataUser) {
                async function fetchUserData() {
                    try {
                        const URL = 'https://kel1airplaneapi-production.up.railway.app/api/v1/user/getProfile';
                        const res = await axios.get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        setUserData({
                            name: res.data.data.nama,
                            email: res.data.data.email,
                            phone: res.data.data.phone,
                        });

                        // console.log('CURRENT USER:', res.data);
                    } catch (error) {
                        handleVisibleAlert('Session Expired!', 'failed');
                        setTimeout(() => {
                            signOut();
                        }, 2500);
                    }
                }
                fetchUserData();
            }
            setFetchDataUser(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchDataUser, session, token]);

    useEffect(() => {
        if (token) {
            if (fetchDataHistory) {
                async function fetchUserData() {
                    try {
                        const URL = 'https://kel1airplaneapi-production.up.railway.app/api/v1/transaction/getById';
                        const res = await axios.post(
                            URL,
                            {
                                transaction_id: id,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        setTransactionHistory(res.data.data);

                        //Notif
                        if (res?.data?.data?.transaction?.transaction_status?.toLowerCase() === 'unpaid') {
                            handleVisibleAlert(`Please complete your order!`, 'failed');
                        }
                    } catch (error) {
                        // console.log('ERROR detail transasction', error);
                    } finally {
                        setIsLoading(false);
                    }
                }
                fetchUserData();
            }
            setFetchDataHistory(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchDataHistory, session, token, id]);

    // console.log('====================================');
    // console.log('TESTTTTTTTT', transactionHistory);
    // console.log('Payment input', formGopayInputStatus);
    // console.log('gopay input', gopayInput);

    // console.log('====================================');

    if (isLoading) {
        return (
            <div className='overflow-x-hidden'>
                <Navbar className={'hidden lg:block'} />
                {/* header */}
                <div className='mt-[80px] hidden w-screen border border-b-net-2 pb-[74px] pt-[47px] lg:block'>
                    <div className='mx-auto hidden max-w-screen-lg grid-cols-12 font-poppins lg:grid'>
                        <div className='col-span-12 flex gap-3 text-head-1 font-bold'>
                            <h1 className='text-black '>Input Details</h1>
                            <p>{'>'}</p>
                            <h1 className='text-black'>Payment</h1>
                            <p>{'>'}</p>
                            <h1 className='text-net-3'>Completed</h1>
                        </div>
                    </div>
                </div>
                {/* header */}

                {/* DEKSTOP */}
                <div className='mx-auto mt-[19px] hidden   max-w-screen-lg grid-cols-12 font-poppins lg:grid'>
                    <div className='col-span-12 grid grid-cols-12'>
                        <div className='col-span-7'>
                            <div className='flex w-[486px] flex-col gap-[10px]'>
                                <PaymentMethod
                                    payments={datas}
                                    selectedPayment={open}
                                    creditCardInput={creditCardInput}
                                    gopayInput={gopayInput}
                                    virtualAccInput={virtualAccInput}
                                    handleChangeVirtualAcc={handleChangeVirtualAcc}
                                    handleChangeGopay={handleChangeGopay}
                                    handleChangeCreditCard={handleChangeCreditCard}
                                    handleOpen={handleOpen}
                                />

                                <Button
                                    disabled={
                                        !handleCheckAll() || transactionHistory?.transaction?.transaction_status === 'Issued'
                                    }
                                    onClick={() => handleUpdatePayment(transactionHistory?.transaction?.transaction_code)}
                                    text={`${
                                        transactionHistory?.transaction?.transaction_status === 'Unpaid' ? 'Pay' : 'Already Paid'
                                    } `}
                                    className={`${
                                        !handleCheckAll() || transactionHistory?.transaction?.transaction_status === 'Issued'
                                            ? 'bg-pur-3 opacity-60'
                                            : 'bg-pur-3 '
                                    } rounded-rad-3   py-[16px] text-head-1 font-medium text-white `}
                                />
                            </div>
                        </div>

                        <div className='col-span-5 flex flex-col items-center justify-center gap-3'>
                            <h1 className='text-title-2 font-bold text-net-3'>Please wait...</h1>
                            <Image
                                alt=''
                                src={'/new_images/loading.svg'}
                                width={160}
                                height={160}
                                priority
                                style={{ width: 'auto' }}
                            />
                        </div>
                    </div>
                </div>
                {/* DEKSTOP */}
                {/* MOBILE */}
                <div className='fixed inset-0 top-0 h-screen overflow-y-scroll bg-white font-poppins lg:hidden'>
                    <div className='px-4'>
                        <div className='fixed inset-x-0 top-0  flex cursor-pointer items-center gap-6 bg-pur-5  px-[16px] py-[10px] text-white '>
                            <FiArrowLeft className='h-[30px] w-[30px]' /> <h1>Payment</h1>
                        </div>

                        <div className='flex h-screen flex-col items-center justify-center gap-2 '>
                            <h1 className='text-title-2 font-bold text-net-3'>Please wait...</h1>
                            <Image
                                alt=''
                                src={'/new_images/loading.svg'}
                                width={80}
                                height={80}
                                priority
                                style={{ width: 'auto' }}
                            />
                        </div>
                    </div>
                </div>

                {/* MOBILE */}
            </div>
        );
    }

    return (
        <div className='overflow-x-hidden'>
            <Navbar className={'hidden lg:block'} />
            <div className='mt-[80px] hidden w-screen border-b border-b-net-2 pb-[74px] pt-[47px] lg:block'>
                <div className='mx-auto hidden max-w-screen-lg grid-cols-12 font-poppins lg:grid'>
                    <div className='col-span-12 flex gap-3 text-head-1 font-bold'>
                        <h1 className='text-black '>Input Details</h1>
                        <p>{'>'}</p>
                        <h1 className='text-black'>Payment</h1>
                        <p>{'>'}</p>
                        <h1
                            className={`${
                                transactionHistory?.transaction?.transaction_status === 'Issued' ? 'text-black' : 'text-net-3'
                            } `}>
                            Completed
                        </h1>
                    </div>
                </div>
            </div>

            <div className='mx-auto mt-[19px] hidden   max-w-screen-lg grid-cols-12 font-poppins lg:grid'>
                <div className='col-span-12 grid grid-cols-12'>
                    <div className='col-span-7'>
                        <div className='flex w-[486px] flex-col gap-[10px]'>
                            <PaymentMethod
                                payments={datas}
                                selectedPayment={open}
                                creditCardInput={creditCardInput}
                                gopayInput={gopayInput}
                                virtualAccInput={virtualAccInput}
                                handleChangeVirtualAcc={handleChangeVirtualAcc}
                                handleChangeGopay={handleChangeGopay}
                                handleChangeCreditCard={handleChangeCreditCard}
                                handleOpen={handleOpen}
                            />

                            <Button
                                disabled={!handleCheckAll() || transactionHistory?.transaction?.transaction_status === 'Issued'}
                                onClick={() => handleUpdatePayment(transactionHistory?.transaction?.transaction_code)}
                                text={`${
                                    transactionHistory?.transaction?.transaction_status === 'Unpaid' ? 'Pay' : 'Already Paid'
                                } `}
                                className={`${
                                    !handleCheckAll() || transactionHistory?.transaction?.transaction_status === 'Issued'
                                        ? 'bg-pur-3 opacity-60'
                                        : 'bg-pur-3 '
                                } rounded-rad-3   py-[16px] text-head-1 font-medium text-white `}
                            />
                        </div>
                    </div>

                    <div className='col-span-5 flex flex-col gap-3'>
                        <TransactionDetails data={transactionHistory} />
                    </div>
                </div>
            </div>

            {/* MOBILE */}
            {transactionHistory && (
                <div className='fixed inset-0 top-0 h-screen overflow-y-scroll bg-white font-poppins lg:hidden'>
                    <div className='px-4'>
                        <div
                            onClick={() => router.push('/')}
                            className='fixed inset-x-0 top-0  flex cursor-pointer items-center gap-6 bg-pur-5  px-[16px] py-[10px] text-white '>
                            <FiArrowLeft className='h-[30px] w-[30px]' /> <h1>Payment</h1>
                        </div>
                        <MobileTransactionDetails data={transactionHistory} />
                        <div className='mt-6 flex flex-col gap-2'>
                            <PaymentMethod
                                payments={datas}
                                selectedPayment={open}
                                creditCardInput={creditCardInput}
                                gopayInput={gopayInput}
                                virtualAccInput={virtualAccInput}
                                handleChangeVirtualAcc={handleChangeVirtualAcc}
                                handleChangeGopay={handleChangeGopay}
                                handleChangeCreditCard={handleChangeCreditCard}
                                handleOpen={handleOpen}
                            />
                        </div>

                        <div className='invisible h-[110px]'></div>

                        <div className='fixed inset-x-0 bottom-0  flex  h-[100px] flex-col items-center justify-center gap-3  bg-white  px-5 shadow-low'>
                            <Button
                                disabled={!handleCheckAll() || transactionHistory?.transaction?.transaction_status === 'Issued'}
                                onClick={() => handleUpdatePayment(transactionHistory?.transaction?.transaction_code)}
                                text={`${
                                    transactionHistory?.transaction?.transaction_status === 'Unpaid' ? 'Pay' : 'Already Paid'
                                } `}
                                className={`${
                                    !handleCheckAll() || transactionHistory?.transaction?.transaction_status === 'Issued'
                                        ? 'bg-pur-3 opacity-60'
                                        : 'bg-pur-3 '
                                } my-1   w-full rounded-rad-3  bg-pur-3 py-2  text-white `}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* MOBILE */}

            {/* <AlertTop
                visibleAlert={visibleAlert}
                handleVisibleAlert={handleVisibleAlert}
                text={alertText}
                type={alertType}
                bgType='none'
            /> */}
            <FixedAlert visibleAlert={visibleAlert} handleVisibleAlert={handleVisibleAlert} text={alertText} type={alertType} />
        </div>
    );
}
