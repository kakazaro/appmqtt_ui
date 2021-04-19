import React from 'react';
import { Dropdown } from 'react-bootstrap';

import './freshFilter.scss';

const FreshFilter = ({ value, items, onChange }) => {

    return <div className={'freshFilter'}>
        <Dropdown>
            <Dropdown.Toggle id="dropdown-filter">
                {value ? value.name : items?.length ? items[0].name : '(không có bộ lọc)'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {items?.length && items.map(item => <Dropdown.Item key={item.key} onClick={(() => {
                    onChange(item);
                })}>{item.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    </div>;
};

export default FreshFilter;
