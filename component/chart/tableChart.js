import React, { useEffect, useMemo, useState } from 'react';
import { DataTable, Text } from 'react-native-paper';
import { colors } from '../../common/themes';

const TableChart = ({ data }) => {
    const [page, setPage] = useState(0);
    useEffect(() => {
        setPage(0);
    }, [data]);

    return useMemo(() => {
        if (!data) {
            return <></>;
        }

        const { dataSeries, tableLabels, namesTable, unit } = data;

        if (!dataSeries?.length || dataSeries.every((series) => series.length !== tableLabels?.length)) {
            return <></>;
        }

        const pageLimit = 35;

        const from = page * pageLimit;
        const to = (page + 1) * pageLimit;

        const maxLength = Math.max(...dataSeries.map(s => s.length));

        const slidedSeries = dataSeries.map((series) => series.slice(pageLimit * page, pageLimit * (page + 1)));
        const slidedSLabel = tableLabels.slice(pageLimit * page, pageLimit * (page + 1));

        return <DataTable>
            <DataTable.Header style={{ flex: 0, paddingVertical: 5, height: 35 }}>
                <DataTable.Title style={{ paddingVertical: 0 }}><Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: 'bold' }}>Thời gian</Text></DataTable.Title>
                {namesTable.map((name, index) => <DataTable.Title key={name} style={{ paddingVertical: 0 }}><Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: 'bold' }}>{name + ` (${unit[index]})`}</Text></DataTable.Title>)}
            </DataTable.Header>
            {slidedSLabel.map((label, index) => <DataTable.Row key={index}>
                <DataTable.Cell>
                    <Text style={{ color: colors.primaryText, fontSize: 13 }}>{label}</Text>
                </DataTable.Cell>
                {slidedSeries.map((series, seriesIndex) => <DataTable.Cell key={seriesIndex}>
                    <Text style={{ color: colors.primaryText, fontSize: 13 }}>{(!series[index] && series[index] !== 0) ? '--' : series[index]}</Text>
                </DataTable.Cell>)}
            </DataTable.Row>)}
            {maxLength > pageLimit && <DataTable.Pagination
                page={page}
                numberOfPages={Math.floor(maxLength / pageLimit) + 1}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${maxLength}`}
            />}
        </DataTable>;
    }, [data, page]);
};

export default TableChart;
