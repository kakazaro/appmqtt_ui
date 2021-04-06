import React from 'react';
import { Container, Dropdown } from 'react-bootstrap';

import './freshFilter.scss';

const FreshFilter = ({ value, items, onChange }) => {

    return <Container className={'freshFilter'}>
        <i className="fas fa-filter"/>
        <Dropdown>
            <Dropdown.Toggle id="dropdown-filter">
                {value ? value.name : items?.length ? items[0].name : '(không có bộ lọc)'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {items?.length && items.map(item => <Dropdown.Item key={item.key} onClick={(event => {
                    onChange(item);
                })}>{item.name}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    </Container>;
};

export default FreshFilter;
