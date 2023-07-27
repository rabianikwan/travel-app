'use client';

//Core
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

// //Third Parties
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { FiArrowLeft, FiFilter, FiHome, FiX } from 'react-icons/fi';
import { IoSearchSharp, IoLocationSharp } from 'react-icons/io5';
import { MdNotifications, MdSearch, MdOutlineAccountCircle } from 'react-icons/md';
import { SlNotebook } from 'react-icons/sl';

// //Redux
import { useDispatch } from 'react-redux';
import { historySlice } from '@/store/history';

// //Components
import AlertBottom from '@/components/AlertBottom';
import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottomNavbar';
// import RiwayatPesananKanan from '@/components/RiwayatPesananKanan';
import AlertTop from '@/components/AlertTop';
import Input from '@/components/Input';
// import TransactionHistoryList from '@/components/ListTransactionHistory';
import MobileListTransactionHistory from '@/components/MobileListTransactionHistory';
import TransactionHistoryDetails from '@/components/TransactionHistoryDetails';
import MobileTransactionHistoryDetails from '@/components/MobileTransactionHistoryDetails';

// //Utils
import { reformatDate } from '@/utils/reformatDate';
import { reformatDuration } from '@/utils/reformatDuration';
import { fixedHour } from '@/utils/fixedHour';
import { formatRupiah } from '@/utils/formatRupiah';
import { extractWord } from '@/utils/extractWord';
import { groupingByTransactionDates } from '@/utils/reShapeData';
import ListTransactionHistory from '@/components/ListTransactionHistory';
import { historyStatusStyling } from '@/utils/historyStatusStyling';

export default function History() {
    /*=== core ===*/
    const pathname = usePathname();
    const router = useRouter();

    /*=== next auth ===*/
    const { data: session, status } = useSession();
    const token = session?.user?.token; //becarefull it has lifecycle too, prevent with checking it first

    /*=== redux ===*/
    const dispatch = useDispatch();
    const { setHistoryDetail } = historySlice.actions;

    /*=== state ===*/
    const [openFilterHistoryByCode, setOpenFilterHistoryByCode] = useState(false);
    const [filterInput, setFilterInput] = useState('');
    const [historyFilter, setHistoryFilter] = useState([]);
    const [openMobileHistoryDetail, setOpenMobileHistoryDetail] = useState(false);
    const [mobileHistoryDetailData, setMobileHistoryDetailData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [historyItem, setHistoryItem] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(true);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('');
    const [visibleAlertError, setVisibleAlertError] = useState(false);
    const [alertTextError, setAlertTextError] = useState('');
    const [alertTypeError, setAlertTypeError] = useState('');
    const [fetchData, setFetchData] = useState(true);
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    /*=== function === */
    const handleOpenFilterHistoryByCode = () => {
        setOpenFilterHistoryByCode(!openFilterHistoryByCode);
    };

    const handleOnChangeFilterByCode = (event) => {
        setFilterInput(event.target.value);

        const searchHistory = historyData.map((historyItem) =>
            historyItem.data.filter((item) =>
                item.transaction?.transaction_code.toLowerCase().includes(event.target.value.toLowerCase())
            )
        );

        const filteredHistory = groupingByTransactionDates(searchHistory[0]);

        setHistoryFilter(filteredHistory);
    };

    const handleOpenMobileHistoryDetail = () => {
        // setMobileHistoryDetailData(data);
        setOpenMobileHistoryDetail(!openMobileHistoryDetail);
    };

    const handleHistoryDetailMobile = (data) => {
        dispatch(setHistoryDetail(data));
        router.push('/history/detail');
    };

    const handleVisibleAlert = (text, alertType) => {
        setAlertText(text);
        setAlertType(alertType);
        setVisibleAlert(!visibleAlert);
    };
    const handleVisibleAlertError = (text, alertType) => {
        setAlertTextError(text);
        setAlertTypeError(alertType);
        setVisibleAlertError(!visibleAlertError);
    };

    const handleHistoryDetail = (history) => {
        setHistoryItem(history);
        setOpenMobileHistoryDetail(true);
        // console.log('History Detail : ', history);
    };

    const handleUpdatePayment = async (transaction) => {
        router.push(`/history/payment/${transaction?.Flights[0]?.Transaction_Flight?.transaction_id}`);
    };

    const handleSendTicket = async (id) => {
        if (token) {
            try {
                const URL = 'https://kel1airplaneapi-production.up.railway.app/api/v1/transaction/printticket';
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

                // console.log('PESANN', res);

                if (res.status === 201 || res.data.status === 'Ok') {
                    // console.log('SUCCESS');
                    handleVisibleAlert('Tickets have been sent, please check your email!');
                    router.refresh();
                }

                // console.log('ID TICKET', id);
            } catch (error) {
                // console.log('ERROR SEND EMAIL TICKET', error);
                handleVisibleAlertError(`We can't process your ticket, please try again later!`, 'failed');
            }
        }
    };
    /*=== effects ===*/
    useEffect(() => {
        if (token) {
            if (fetchData) {
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
            setFetchData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, session, token]);

    useEffect(() => {
        if (token) {
            if (fetchStatus) {
                const fetchBooking = async () => {
                    try {
                        const URL = 'https://kel1airplaneapi-production.up.railway.app/api/v1/transaction/history';

                        const response = await axios.get(URL, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        //sorting data
                        response.data.data.sort(
                            (a, b) => new Date(b?.transaction?.transaction_date) - new Date(a?.transaction?.transaction_date)
                        );

                        const groupingByDatesDatas = groupingByTransactionDates(response?.data?.data);

                        setHistoryData(groupingByDatesDatas);
                        setHistoryFilter(groupingByDatesDatas);
                    } catch (error) {
                        // console.log(error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchBooking();
            }

            setFetchStatus(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchStatus, token]);

    // console.log('DEBUG==================================');
    // console.log('HISTORY FILTER', historyFilter);
    // console.log('DEBUG==================================');

    // console.log('DATA HISTORy', historyData);
    if (isLoading) {
        return (
            <div className='hidden overflow-x-hidden lg:block'>
                <Navbar className={'hidden lg:block'} />
                {/* DESKTOP MODE */}

                <div className='mt-[80px] hidden w-screen border border-b-net-2 pb-4 lg:block'>
                    <div className='container relative mx-auto hidden max-w-screen-lg grid-cols-12 gap-3 font-poppins lg:grid'>
                        <h1 className='col-span-12 mb-[24px] mt-[47px] font-poppins text-head-1 font-bold'>
                            Transaction History
                        </h1>
                        <div className='col-span-12 grid grid-cols-12 gap-[18px]'>
                            <div
                                className='col-span-8 flex cursor-pointer items-center gap-4 rounded-rad-3 bg-pur-3 py-[13px] font-poppins text-title-2 font-medium text-white'
                                onClick={() => router.push('/')}>
                                <FiArrowLeft className='ml-[21px]  h-6 w-6 ' />
                                <p>Home</p>
                            </div>
                            <div className='col-span-4 flex items-center gap-4'>
                                <Input
                                    onChange={handleOnChangeFilterByCode}
                                    value={filterInput}
                                    onClick={() => setHistoryItem('')}
                                    placeholder={'Enter your transaction code'}
                                    className='rounded-rad-4 border-net-2 px-6 py-[14px] text-title-1 focus:border-pur-3'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{ height: 'calc(100vh - 270px)' }}
                    className='container mx-auto hidden max-w-screen-lg flex-col items-center justify-center gap-3 font-poppins lg:flex'>
                    <h1 className='text-title-2 font-bold text-net-3'>Please wait...</h1>
                    <Image alt='' src={'/new_images/loading.svg'} width={200} height={200} priority style={{ width: 'auto' }} />
                </div>
            </div>
        );
    }
    return (
        <div className='overflow-x-hidden bg-pur-3 lg:bg-white'>
            <Navbar className={'hidden lg:block'} />
            {/* DESKTOP MODE */}
            <div className='mt-[80px]  hidden w-screen border border-b-net-2 pb-4 lg:block'>
                <div className='container relative mx-auto hidden max-w-screen-lg grid-cols-12 gap-3 font-poppins lg:grid'>
                    <h1 className='col-span-12 mb-[24px] mt-[47px] font-poppins text-head-1 font-bold'>Transaction History</h1>
                    <div className='col-span-12 grid grid-cols-12 gap-[18px]'>
                        <div
                            className='col-span-8 flex cursor-pointer items-center gap-4 rounded-rad-3 bg-pur-3 py-[13px] font-poppins text-title-2 font-medium text-white'
                            onClick={() => router.push('/')}>
                            <FiArrowLeft className='ml-[21px]  h-6 w-6 ' />
                            <p>Home</p>
                        </div>
                        <div className='col-span-4 flex items-center gap-4'>
                            <Input
                                onChange={handleOnChangeFilterByCode}
                                value={filterInput}
                                onClick={() => setHistoryItem('')}
                                placeholder={'Enter your transaction code'}
                                className='rounded-rad-4 border-net-2 px-6 py-[14px] text-title-1 focus:border-pur-3'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='container mx-auto mt-4 hidden max-w-screen-lg font-poppins lg:block'>
                <div className='grid grid-cols-12 '>
                    {historyFilter.length > 0 ? (
                        <div className='col-span-12 grid grid-cols-12 gap-10'>
                            <div className='col-span-7'>
                                <ListTransactionHistory
                                    historyDatas={historyFilter}
                                    choosedHistoryItem={historyItem}
                                    handleHistoryDetail={handleHistoryDetail}
                                />
                            </div>

                            <div className='col-span-5'>
                                {historyItem ? (
                                    <TransactionHistoryDetails
                                        historyItem={historyItem}
                                        handleUpdatePayment={handleUpdatePayment}
                                        handleSendTicket={handleSendTicket}
                                    />
                                ) : (
                                    <div>
                                        <h1 className='text-title-2 font-bold'>Transaction Details</h1>
                                        <div className='flex h-[500px] items-center justify-center'>
                                            <div className='text-center text-body-6'>
                                                <p>Please select a transaction </p>
                                                <p>on the left to see details</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='col-span-12 flex h-[500px] items-center justify-center '>
                            <div className='flex flex-col justify-center gap-4'>
                                <div className='flex flex-col items-center justify-center text-center'>
                                    <Image alt='' src={'/new_images/empty_list.svg'} width={200} height={200} />
                                    <h1 className='mt-4 text-body-6 font-bold text-pur-3'>Oops! Empty Transaction History!</h1>
                                    <h3 className='text-body-6'>You {"haven't"} taken a flight yet</h3>
                                </div>
                                <Button>Find Flights</Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className='invisible h-[100px]'></div>
            </div>

            {/* DESKTOP MODE */}

            {/* MOBILE MODE */}
            <div className='h-screen font-poppins lg:hidden'>
                <div className='mx-4 mt-[64px] flex items-center justify-between text-head-2 font-bold text-white'>
                    <h1> Transaction History</h1>
                </div>
                <div className='mx-4 mt-8 flex justify-end'>
                    <Input
                        onChange={handleOnChangeFilterByCode}
                        value={filterInput}
                        onClick={() => setHistoryItem('')}
                        placeholder={'Enter your transaction code'}
                        className='w-[220px] rounded-rad-4 border-net-2 px-6 py-[14px] text-body-6 focus:border-pur-4'
                    />
                </div>

                <div className='mx-4 mt-3'>
                    <MobileListTransactionHistory historyDatas={historyFilter} handleHistoryDetail={handleHistoryDetail} />
                </div>
                <div className='invisible h-[100px] bg-pur-3'></div>
                <BottomNavbar />
            </div>

            {openMobileHistoryDetail && (
                <MobileTransactionHistoryDetails
                    handleOpen={handleOpenMobileHistoryDetail}
                    historyItem={historyItem}
                    handleActionPaid={() =>
                        handleSendTicket(historyItem?.transaction?.Flights[0]?.Transaction_Flight?.transaction_id)
                    }
                    handleActionUnpaid={() => handleUpdatePayment(historyItem?.transaction)}
                />
            )}

            {/* MOBILE MODE */}
            <AlertTop
                visibleAlert={visibleAlert}
                handleVisibleAlert={handleVisibleAlert}
                text={alertText}
                type={alertType}
                bgType='none'
            />
            <AlertTop
                visibleAlert={visibleAlertError}
                handleVisibleAlert={handleVisibleAlertError}
                text={alertTextError}
                type={alertTypeError}
                bgType='none'
            />

            {/* {openFilterHistoryByCode && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
                    <div className='h-[300px] w-[668px] rounded-rad-3 bg-white px-4 shadow-low'>
                        <div className='flex items-center gap-2 pt-3'>
                            <Input
                                className='w-full px-4 py-2 outline-none appearance-none font-poppins'
                                // onChange={handleFromInputChange}
                                onChange={handleOnChangeFilterByCode}
                                value={filterInput}
                            />
                            <div>
                                <Button className='bg-white' onClick={() => setOpenFilterHistoryByCode(!openFilterHistoryByCode)}>
                                    <FiX className='h-[32px] w-[32px]' />
                                </Button>
                            </div>
                        </div>

                        <div style={{ height: 'calc(300px - 62px)' }} className='pt-3 overflow-y-scroll'></div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
