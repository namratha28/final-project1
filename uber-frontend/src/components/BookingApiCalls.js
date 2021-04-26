import axios from 'axios';
//const url = "http://localhost:5000/app/";
//const url="/";
//const url = `http://${process.env.REACT_APP_IP_ADDRESS}:5000/app/`;
const url = "http://ae8b71cec812b4b7aaa531aacf39603d-1116969490.us-west-2.elb.amazonaws.com/app/";


export const getoperator = booking => {
    return axios
    .post(url+"getoperator", {
        source: booking.source,
        destination: booking.destination,
        date: booking.date
    }).then(res => {
        console.log(res);
        return res;
    }).catch(res => {
        console.log(res);
        return res;
    })
}

export const addbooking = booking => {
    return axios
    .post(url+"addbooking", {
        email: booking.email,
        source: booking.source,
        destination: booking.destination,
        date: booking.date,
        operator: booking.operator
    }).then(res => {
        console.log(res);
        return res;
    }).catch(res => {
        console.log(res);
    })
}

export const getbookings = booking => {
    return axios
    .post(url+"getbookings", {
        email: localStorage.getItem('email')
    }).then(res => {
        console.log('Try')
        console.log(res);
        return res.data;
    }).catch(res => {
        console.log('Catch')
        console.log(res);
    })
}

export const deletebooking = booking => {
    return axios
    .post(url+"delete", {
        email: localStorage.getItem('email'),
        source: booking.source,
        destination: booking.destination,
        date: booking.date,
        operator: booking.operator
    }).then(res => {
        console.log(res);
        return res;
    }).catch(res => {
        console.log(res);
    })
}
