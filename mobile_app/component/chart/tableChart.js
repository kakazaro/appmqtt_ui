import React, { useEffect, useMemo, useState } from 'react';
import { DataTable, Text } from 'react-native-paper';
import { colors } from '../../common/themes';

const TableChart = ({ data }) => {
    const [page, setPage] = useState(0);
    useEffect(() => {
        setPage(0);
    }, [data]);

    const tableDom = useMemo(() => {
        if (!data) {
            return;
        }

        const { dataSeries, tableLabels, legend, unit } = data;

        if (dataSeries.length !== tableLabels.length) {
            return;
        }

        const pageLimit = 35;

        const from = page * pageLimit;
        const to = (page + 1) * pageLimit;

        const slidedSeries = dataSeries.slice(pageLimit * page, pageLimit * (page + 1));
        const slidedSLabel = tableLabels.slice(pageLimit * page, pageLimit * (page + 1));

        return <DataTable>
            <DataTable.Header>
                <DataTable.Title><Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: 'bold' }}>Thời gian</Text></DataTable.Title>
                <DataTable.Title><Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: 'bold' }}>{legend + ` (${unit})`}</Text></DataTable.Title>
            </DataTable.Header>
            {slidedSeries.map((value, index) => <DataTable.Row key={index}>
                <DataTable.Cell>
                    <Text style={{ color: colors.primaryText, fontSize: 13 }}>{slidedSLabel[index]}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                    <Text style={{ color: colors.primaryText, fontSize: 13 }}>{slidedSeries[index]}</Text>
                </DataTable.Cell>
            </DataTable.Row>)}
            {dataSeries.length > pageLimit && <DataTable.Pagination
                page={page}
                numberOfPages={Math.floor(dataSeries.length / pageLimit) + 1}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${dataSeries.length}`}
            />}
        </DataTable>;
    }, [data, page]);

    return tableDom;
};

export default TableChart;
