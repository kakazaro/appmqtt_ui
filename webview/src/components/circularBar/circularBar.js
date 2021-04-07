import React from 'react';
import { CircularProgressbarWithChildren  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './circularBar.scss';

const CircularBar = ({ value, children, styles }) => {
    return <div className='circularBar'>
        <CircularProgressbarWithChildren
            value={value} maxValue={1} minValue={0}
            styles={styles}
        >
            {children}
        </CircularProgressbarWithChildren>
    </div>;
};

export default CircularBar;
