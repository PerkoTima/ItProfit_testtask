import React, { useState } from "react";
import moment from 'moment';

interface RegistrationFormData {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    message: string;
}

const Form = () => {
    const regExp = {
        name: /^[A-Za-z]{3,30} [A-Za-z]{3,30}$/g,
        email: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
        phone: /^(\+7)?[\s]?\(?[0-9]{3}\)?[\s]?[0-9]{3}[\s]?[0-9]{4}$/
    }
    const valuesObj = {name: '',
    email: '',
    phone: '',
    birthday: '',
    message: ''}
    const [values, setValues] = useState<RegistrationFormData>(valuesObj)
    const [validation, setValidation] = useState({name: false, email: false, phone: false})
    const [data, setData] = useState({
        status:'',
        textSuccess: '',
        textError: ''
    })
    const [formSending, setFormSending] = useState(false)
    
    const validate = (str: string, mask: any) => {
        return mask.test(str)
    }

    const changeName = (e: string) => {
        setValues({...values, name: e})
        setValidation({...validation, name: validate(e.toLowerCase(), regExp.name)})
    }

    const changeEmail = (e: string) => {
        setValues({...values, email: e})
        setValidation({...validation, email: validate(e, regExp.email)})
    }

    const changeMessage = (e: string) => {
        setValues({...values, message: e})
    }

    const changePhone = (e: any) => {
        let val = e;
        val = val.replace(/ /gm, '');
        let num = `${val.substring(0, 2)} ${val.substring(2, 5)} ${val.substring(5, 8)} ${val.substring(8, val.length)}`;
        num = num.trim();
        setValidation({...validation, phone: validate(num, regExp.phone)})
        setValues({...values, phone: num})
    }

    const changeDate = (e: any) => {
        const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD');
        setValues({...values, birthday: newDate})
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormSending(true)
        await fetch('http://localhost:3000/status.json', {method: 'GET'})
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setData(data)
                if(data.status === "success"){
                    setFormSending(false)
                    setValues(valuesObj)
                }
            })
    };

    return (
        <form onSubmit={onSubmit} className="form">
            <h1>Feedback form</h1>
            <div className="formInput">
                <label>Name Surname</label>
                <input className={validation.name ? "" : "invalid_data"} name="name" type="text" value={values.name} onChange={e => changeName(e.target.value)} placeholder="Ivan Ivanov" required/>
            </div>
            <div className="formInput">
                <label>Email</label>
                <input name="email" className={validation.email ? "" : "invalid_data"} type="text" value={values.email} onChange={e => changeEmail(e.target.value)} placeholder="test@gmail.com" required/>
            </div>
            <div className="formInput">
                <label>Phone</label>
                <input name="phone" type="text" onFocus={e => setValues({...values, phone: '+7'})} maxLength={15} className={validation.phone ? "" : "invalid_data"} value={values.phone} onChange={e => changePhone(e.target.value)} placeholder="Телефон" required />
            </div>
            <div className="formInput">
                <label>Birthday</label>
                <input name="birthday" value={values.birthday} type="date" onChange={changeDate} required/>
            </div>
            <div className="formInput">
                <label>Message</label>
                <textarea name="message" cols={50} rows={5} value={values.message} minLength={10} maxLength={300} onChange={e => changeMessage(e.target.value)} required></textarea>
            </div>
            {data.status === 'success' && <div className="success">{data.textSuccess}</div>}
            {data.status === 'error' && <div className="error">{data.textError}</div>}
            <button type="submit" disabled={formSending}>Success</button>
        </form>
    )
}

export default Form