'use client';

// Core
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

// Third Parties
import axios from 'axios';
import { FiChevronUp, FiChevronDown, FiArrowLeft } from 'react-icons/fi';
import { BsFillCheckCircleFill } from 'react-icons/bs';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
    getPassengerTypeTotal,
    fetchDetailFlight,
    getFlightDetailId,
    getFlightDetailData,
    getFlightDetailDataStatus,
    getChoosedFlight1,
    getChoosedFlight2,
    getPassengerForm,
    flightSlice,
    getIsTwoWay,
} from '@/store/flight';

// Component
import AlertBottom from '@/components/AlertBottom';
import Navbar from '@/components/Navbar';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import CalendarPicker from '@/components/CalendarPicker';
import ToggleSwitch from '@/components/ToggleSwitch';
import AlertTop from '@/components/AlertTop';
import styles from '../../style/SeatSelect.module.css';
import Seat from '@/components/Seat';
import MobileFlightDetails from '@/components/MobileFlightDetails';
import FlightDetails from '@/components/FlightDetails';
import DynamicForm from '@/components/DynamicForm';

//Utils
import { formatToLocale } from '@/utils/formatToLocale';
import { convertToDate } from '@/utils/converDateTime';
import { formatRupiah } from '@/utils/formatRupiah';
import { flightSeat, flightSeatDepart, flightSeatReturn } from '@/utils/flightSeat';
import { fixedHour } from '@/utils/fixedHour';
import { extractWord } from '@/utils/extractWord';
import { reformatDate } from '@/utils/reformatDate';

export default function Order() {
    /*=== core ===*/
    const router = useRouter();

    /*=== next auth ===*/
    const { data: session, status } = useSession();
    const token = session?.user?.token; //loading

    /*=== redux ===*/
    const dispatch = useDispatch();
    const { setFetchDetailFlight, setPassengerForm } = flightSlice.actions;
    const statusDetaiFlight = useSelector(getFlightDetailDataStatus); // Status for fething detail
    const detailFlight = useSelector(getFlightDetailData); // detail flight data
    const choosedFlight1 = useSelector(getChoosedFlight1);
    const choosedFlight2 = useSelector(getChoosedFlight2);
    const flightIDs = useSelector(getFlightDetailId); // Get Flight IDs
    const passengerType = useSelector(getPassengerTypeTotal); // Get passenger type total
    const passengerForm = useSelector(getPassengerForm); // generated form based passenger type total
    const isTwoWay = useSelector(getIsTwoWay);

    /*=== state ===*/
    const [isSuccessForm, setIsSuccessForm] = useState(false);
    const [isDekstop, setIsDesktop] = useState(true);
    const [formData, setFormData] = useState(null);
    const [formInputError, setFormInputError] = useState(false);
    const [formStatus, setFormStatus] = useState(false);
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('');
    const [visibleAlertError, setVisibleAlertError] = useState(false);
    const [alertTextError, setAlertTextError] = useState('');
    const [alertTypeError, setAlertTypeError] = useState('');
    const [toggleUser, setToggleUser] = useState(false);
    const [elements, setElements] = useState([]);
    const [flights, setFlights] = useState([
        {
            flight_id: choosedFlight1.flight_id,
            flight_type: 'Departure',
        },
    ]);
    const [dateId, setDateId] = useState({
        field_id: '',
        form_id: '',
    });
    const [openCalendar, setOpenCalendar] = useState(false);
    const [pickedDate, setPickedDate] = useState(new Date());
    const [seatDepart, setSeatDepart] = useState([]);
    const [seatReturn, setSeatReturn] = useState([]);
    const [fetchDataUser, setFetchDataUser] = useState(true);
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    /*=== function ===*/

    const handleFormStatus = () => {
        if (seatDepart.length !== elements.length && isTwoWay) {
            handleVisibleAlert('Please select a seat fit to number of passengers', 'failed');
            return;
        }
        if (seatReturn.length !== elements.length && isTwoWay) {
            handleVisibleAlert('Please select a seat fit to number of passengers', 'failed');
            return;
        }
        if (seatDepart.length !== elements.length) {
            handleVisibleAlert('Please select a seat fit to number of passengers', 'failed');
            return;
        }

        if (flights) {
            if (flights.length === 2) {
                if (flights[0].flight_type !== 'Departure' || !flights[0].flight_id) {
                    handleVisibleAlert('Departure Flight are not complete yet!', 'failed');
                    return;
                }
                if (flights[1].flight_type !== 'Arrival' || !flights[0].flight_id) {
                    handleVisibleAlert('Arrival Flight are not complete yet!', 'failed');
                    return;
                }
            }
            if (flights[0].flight_type !== 'Departure' || !flights[0].flight_id) {
                handleVisibleAlert('Departure Flight are not complete yet!', 'failed');
                return;
            }
        }

        if (!detailFlight.totalPrice) {
            handleVisibleAlert('Amount is not set!', 'failed');
            return;
        }

        const inputPassengerCheck = elements.every((elementForm) => {
            return elementForm.fields.every((formInput, index) => {
                if (
                    (formInput['field_label'] === 'Full Lengkap' && !formInput['field_value']) ||
                    (formInput['field_label'] === 'Birthday' && !formInput['field_value']) ||
                    (formInput['field_label'] === 'Nationality' && !formInput['field_value']) ||
                    (formInput['field_label'] === 'KTP/Paspor' && !formInput['field_value'])
                ) {
                    handleVisibleAlert('Passenger data must not be empty!', 'failed');
                    setFormInputError(true);
                    return false;
                }

                setFormInputError(false);
                return true;
            });
        });

        if (!inputPassengerCheck) {
            setFormStatus(false);
            return;
        }
        setFormStatus(true);

        const passengerDataShape = elements.map((element, indexForm) => {
            let elementType = element.type;
            let idx = indexForm;

            return {
                type: elementType,
                title: element.fields.find((test) => test.field_category === `title`).field_value,
                name: element.fields.find((test) => test.field_category === `name`).field_value,
                family_name: element.fields.find((test) => test.field_category === `family_name`).field_value,
                birthday: convertToDate(new Date(element.fields.find((test) => test.field_category === `birthday`).field_value)),
                nationality: element.fields.find((test) => test.field_category === `nationality`).field_value,
                nik: element.fields.find((test) => test.field_category === `ktp_paspor`).field_value,
                // issued_country: element.fields.find((test) => test.field_category === `negara_penerbit`).field_value,
                // expired: convertToDate(new Date(element.fields.find((test) => test.field_category === `expired`).field_value)),
                seatDeparture: seatDepart[idx].code,
                seatReturn: isTwoWay ? seatReturn[idx].code : '',
            };
        });

        const templateObj = {
            flights,
            amount: detailFlight.totalPrice,
            passenger: passengerDataShape,
        };

        handleVisibleAlert('Passenger data has been successfully saved!', 'success');
        setFormData(templateObj);
        // console.log('====================================');
        // console.log('FORM VALUE :', templateObj);
        // console.log('====================================');
        setIsSuccessForm(true);
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

    const handleToggleUser = () => setToggleUser(!toggleUser);

    // Handling Seat
    const handleSeatDepart = (value) => {
        if (seatDepart.length === elements.length) {
            setSeatDepart([]);
            return;
        }

        const newSeatDepartDatas = seatDepart.filter((data) => data !== value);
        setSeatDepart((prev) => (prev.find((data) => data === value) ? [...newSeatDepartDatas] : [...seatDepart, value]));
    };
    const handleSeatReturn = (value) => {
        if (seatReturn.length === elements.length) {
            setSeatReturn([]);
            return;
        }

        const newSeatReturnDatas = seatReturn.filter((data) => data !== value);
        setSeatReturn((prev) => (prev.find((data) => data === value) ? [...newSeatReturnDatas] : [...seatReturn, value]));
    };
    // Handling Seat

    const handleOpenCalendar = (field_id = null, form_id = null, isMobile) => {
        if (!isMobile) {
            setIsDesktop(true);
        } else {
            setIsDesktop(false);
        }
        setDateId({
            field_id,
            form_id,
        });
        setOpenCalendar(!openCalendar);
    };

    const handlePickedDate = (date) => {
        setPickedDate(date);

        let newForm = [...elements];
        newForm?.forEach((subForm, index) => {
            if (subForm?.form_id === dateId.form_id) {
                subForm?.fields?.forEach((formField) => {
                    if (formField?.field_id === dateId.field_id) {
                        formField['field_value'] = date;
                    }
                });
            }
        });

        setElements(newForm);
        setOpenCalendar(!openCalendar);
    };

    const handleChange = (field_id, event, form_id) => {
        let newForm = [...elements];
        newForm?.forEach((subForm, index) => {
            if (subForm?.form_id === form_id) {
                subForm?.fields?.forEach((formField) => {
                    if (formField?.field_id === field_id) {
                        formField['field_value'] = event.target.value;
                    }
                });
            }
        });
        setElements(newForm);
    };

    const handleSubmit = async () => {
        try {
            const URL = 'https://kel1airplaneapi-production.up.railway.app/api/v1/transaction';
            if (formData) {
                const res = await axios.post(URL, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.status === 201 || res.data.status === 'Ok') {
                    router.replace(`/order/payment/${res?.data?.data?.transaction?.id}`);
                    // console.log(res.data);
                }
            }
        } catch (error) {
            // console.log('ERROR', error);
        }
    };

    /*=== effects ===*/
    useEffect(() => {
        //extract generated form from redux to locale state
        setElements(JSON.parse(JSON.stringify(passengerForm)));

        /* eslint-disable react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        if (token || status === 'unauthenticated') {
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
    }, [fetchDataUser, status, token]);

    useEffect(() => {
        if (choosedFlight2?.flight_id) {
            setFlights([
                ...flights,
                {
                    flight_id: choosedFlight2.flight_id,
                    flight_type: 'Arrival',
                },
            ]);
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        if (statusDetaiFlight === 'idle') {
            const detailFligt = {
                flight_id: flightIDs,
                dewasa: passengerType.dewasa,
                anak: passengerType.anak,
                bayi: passengerType.bayi,
            };

            dispatch(
                fetchDetailFlight({
                    flight_id: detailFligt.flight_id,
                    dewasa: detailFligt.dewasa,
                    anak: detailFligt.anak,
                    bayi: detailFligt.bayi,
                })
            );
        }

        /* eslint-disable react-hooks/exhaustive-deps */
    }, [statusDetaiFlight, dispatch, fetchDetailFlight]);

    // console.log('====================================');
    // console.log('DETAIL FLIGHT', detailFlight);
    // console.log('====================================');
    // console.log('====================================');
    // console.log('FORM DATA', formData);
    // console.log('====================================');

    return (
        <div className='overflow-x-hidden'>
            <Navbar className={'hidden lg:block'} />

            {/* DEKSTOP MODE */}
            <div className='mt-[108px] hidden w-screen border-b border-b-net-2 pb-[74px] pt-[47px] lg:block'>
                <div className='mx-auto hidden max-w-screen-lg grid-cols-12 font-poppins lg:grid'>
                    {/* header order */}
                    <div className='col-span-12 flex gap-3 text-head-1 font-bold'>
                        <h1 className='text-black '>Input Details</h1>
                        <p>{'>'}</p>
                        <h1 className='text-net-3'>Payment</h1>
                        <p>{'>'}</p>
                        <h1 className='text-net-3'>Completed</h1>
                    </div>
                    {/* header order */}
                </div>
            </div>
            <div className='mx-auto mt-[19px] hidden max-w-screen-lg grid-cols-12  font-poppins lg:grid'>
                <div className='col-span-12 grid grid-cols-12 gap-14 font-poppins'>
                    <div className='col-span-7 flex flex-col gap-6'>
                        {/* INPUT USER */}
                        <div className='flex flex-col gap-4 rounded-rad-2 px-[16px] py-[24px] shadow-low'>
                            <h1 className='text-head-1 font-bold'>Contact Details</h1>
                            <div className='flex items-center justify-between rounded-t-rad-2 bg-net-4 px-4 py-2 text-white'>
                                <h2 className='text-title-2'>Contact Details</h2>
                                {userData.email && (
                                    <BsFillCheckCircleFill className='h-[20px] w-[20px]  text-alert-1 lg:h-[24px] lg:w-[24px]' />
                                )}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='text-body-6 font-bold text-pur-5'>Full Name</Label>
                                <Input
                                    readOnly
                                    disabled
                                    value={userData.name}
                                    className='w-full appearance-none border px-4 py-2 font-poppins outline-none'
                                />
                            </div>

                            <div>
                                <Label className='text-body-6 font-bold text-pur-5'>Phone Number</Label>
                                <Input
                                    disabled
                                    readOnly
                                    value={userData.phone}
                                    className='w-full appearance-none border px-4 py-2 font-poppins outline-none'
                                />
                            </div>
                            <div>
                                <Label className='text-body-6 font-bold text-pur-5'>Email</Label>
                                <Input
                                    disabled
                                    readOnly
                                    value={userData.email}
                                    className='w-full appearance-none border px-4 py-2 font-poppins outline-none'
                                />
                            </div>
                        </div>
                        {/* INPUT USER */}

                        {/* FORM  DEKSTOP*/}
                        <div className='flex flex-col gap-8 rounded-rad-2 px-[16px] py-[24px] shadow-low'>
                            <DynamicForm
                                isMobile={false}
                                elements={elements}
                                formInputError={formInputError}
                                formStatus={formStatus}
                                handleChange={handleChange}
                                handleOpenCalendar={handleOpenCalendar}
                            />
                        </div>
                        {/* FORM DEKSTOP*/}

                        {/* SEAT DEKSTOP */}
                        <Seat
                            flightSeat={flightSeatDepart}
                            handleSeat={handleSeatDepart}
                            seat={seatDepart}
                            type={isTwoWay ? 'Departure' : ''}
                            flight_class={detailFlight?.berangkat?.flight_class}
                            flight_airline={detailFlight?.berangkat?.Airline?.airline_name}
                            flight_from={detailFlight?.berangkat?.from}
                            flight_to={detailFlight?.berangkat?.to}
                        />

                        {isTwoWay && (
                            <Seat
                                flightSeat={flightSeatReturn}
                                handleSeat={handleSeatReturn}
                                seat={seatReturn}
                                type={isTwoWay && 'Return'}
                                flight_class={detailFlight?.pulang?.flight_class}
                                flight_airline={detailFlight?.pulang?.Airline?.airline_name}
                                flight_from={detailFlight?.pulang?.from}
                                flight_to={detailFlight?.pulang?.to}
                            />
                        )}
                        {/* SEAT DEKSTOP */}

                        <Button
                            onClick={() => handleFormStatus()}
                            className={` ${
                                formData ? 'bg-pur-2' : 'bg-pur-3'
                            } mb-[50px]  w-full rounded-rad-3  py-4 text-head-1 text-white`}>
                            Save
                        </Button>
                    </div>

                    {/* RIGHT DETAILS */}
                    <div className='col-span-5 font-poppins'>
                        <FlightDetails data={detailFlight} passengerType={passengerType} />
                        {formData && (
                            <Button
                                onClick={() => handleSubmit()}
                                className='mt-[32px] w-full rounded-rad-3 bg-alert-3 py-4 text-head-1 text-white'>
                                Continue to Pay
                            </Button>
                        )}
                    </div>
                    {/* RIGHT DETAILS */}
                </div>
            </div>

            {/* POP UP */}
            <div>
                {openCalendar && (
                    <div className='fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60 '>
                        <CalendarPicker
                            isDesktop={isDekstop}
                            initialDate={pickedDate}
                            handlePickedDate={handlePickedDate}
                            open={openCalendar}
                            minDate={null}
                            handleOpen={() => setOpenCalendar(!openCalendar)}
                        />
                    </div>
                )}
            </div>

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
            />
            {/* DEKSTOP MODE END*/}

            {/* MOBILE MODE START*/}
            <div className='h-screen font-poppins lg:hidden'>
                <div
                    onClick={() => router.push('/')}
                    className='fixed inset-x-0 top-0 z-10 flex items-center gap-6 bg-pur-5 px-[16px]  py-2  text-white'>
                    <FiArrowLeft className='h-[28px] w-[28px]' /> <p> Booking Page</p>
                </div>
                <div className='mt-[64px]'>
                    {/* INPUT USER */}
                    <div className='mx-4 rounded-t-rad-2 border border-pur-3'>
                        <div className='rounded-t-rad-2 bg-pur-5 px-4 py-2 text-white'>
                            <h2 className='text-title-2'>Contact Details</h2>
                        </div>
                        <div className='flex flex-col gap-4 p-4'>
                            <div className='flex flex-col gap-1 '>
                                <Label className='text-body-6 font-bold text-pur-5'>Full Name</Label>
                                <Input
                                    readOnly
                                    disabled
                                    value={userData.name}
                                    className='w-full appearance-none border px-4 py-2 font-poppins outline-none'
                                />
                            </div>
                            <div>
                                <Label className='text-body-6 font-bold text-pur-5'>Phone Number</Label>
                                <Input
                                    disabled
                                    readOnly
                                    value={userData.phone}
                                    className='w-full appearance-none border px-4 py-2 font-poppins outline-none'
                                />
                            </div>
                            <div>
                                <Label className='text-body-6 font-bold text-pur-5'>Emails</Label>
                                <Input
                                    disabled
                                    readOnly
                                    value={userData.email}
                                    className='w-full appearance-none border px-4 py-2 font-poppins outline-none'
                                />
                            </div>
                        </div>
                    </div>
                    {/* INPUT USER */}
                </div>

                {/* FORM  MOBILE*/}
                <div className='mt-[32px] flex flex-col gap-4 '>
                    <DynamicForm
                        isMobile={true}
                        elements={elements}
                        formInputError={formInputError}
                        formStatus={formStatus}
                        handleChange={handleChange}
                        handleOpenCalendar={handleOpenCalendar}
                    />
                </div>
                {/* FORM  MOBILE*/}

                {/* MOBILE SEAT */}
                <Seat
                    flightSeat={flightSeatDepart}
                    handleSeat={handleSeatDepart}
                    seat={seatDepart}
                    type={isTwoWay ? 'Departure' : ''}
                    flight_class={detailFlight?.berangkat?.flight_class}
                    flight_airline={detailFlight?.berangkat?.Airline?.airline_name}
                    flight_from={detailFlight?.berangkat?.from}
                    flight_to={detailFlight?.berangkat?.to}
                />

                {isTwoWay && (
                    <Seat
                        flightSeat={flightSeatReturn}
                        handleSeat={handleSeatReturn}
                        seat={seatReturn}
                        type={isTwoWay && 'Return'}
                        flight_class={detailFlight?.pulang?.flight_class}
                        flight_airline={detailFlight?.pulang?.Airline?.airline_name}
                        flight_from={detailFlight?.pulang?.from}
                        flight_to={detailFlight?.pulang?.to}
                    />
                )}
                {/* MOBILE SEAT  */}

                {/* DIVIDER */}
                <div className='invisible h-[110px] '></div>
                {/* DIVIDER */}

                {/* MOBILE SAVE FORM*/}
                <div className='fixed inset-x-0 bottom-0  flex  h-[100px] flex-col items-center justify-center gap-3  bg-white  px-5 shadow-low'>
                    <Button
                        onClick={() => handleFormStatus()}
                        className={` ${formData ? 'bg-pur-2' : 'bg-pur-3'}  my-1 w-full rounded-rad-3 py-2 text-white`}>
                        Save
                    </Button>
                </div>
                {/* MOBILE SAVE FORM*/}
            </div>

            {/* MOBILE POP UP DETAILS */}
            {isSuccessForm && (
                <div className='fixed inset-0 top-0 z-20 h-screen overflow-y-scroll bg-white px-4 font-poppins lg:hidden'>
                    <div
                        onClick={() => setIsSuccessForm(!isSuccessForm)}
                        className='fixed inset-x-0 top-0 z-20 flex items-center gap-6 bg-pur-5 px-[16px]  py-2  text-white'>
                        <FiArrowLeft className='h-[28px] w-[28px]' /> <p>Flights Detail</p>
                    </div>
                    <div>
                        <FlightDetails data={detailFlight} passengerType={passengerType} />
                        {formData && (
                            <div className='fixed inset-x-0 bottom-0  flex  h-[100px] flex-col items-center justify-center gap-3  bg-white  px-5 shadow-low'>
                                <Button
                                    onClick={() => handleSubmit()}
                                    className='my-1 w-full rounded-rad-3 bg-alert-3 py-2 text-white'>
                                    Continue to Pay
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* MOBILE POP UP DETAILS */}

            {/* MOBILE MODE END*/}
        </div>
    );
}
