import { useContext } from "react";
import { AppContext } from "../../app.context";

import './loading.scss';

export function Loading () {
    const context = useContext(AppContext);
    return context.loading ?
        <div className="aoj-loading">
            <div className='loader'>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
            </div>
        </div>
        :
        null;
}