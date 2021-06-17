import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../../component/listScroll';
import SiteBadge from '../../component/listBadge/siteBadge';
import eventCenter from '../../common/eventCenter';
import UserContext from '../../context/userContext';

const SitesTab = () => {
    const userContext = useContext(UserContext);

    return <View style={styles.container}>
        <ListScroll
            renderItem={(item) => <SiteBadge item={item}/>}
            showPlaceholder={true}
            path={'sites'}
            url={'/site/list'}
            emptyMessage={userContext.rolePermission.needSettingSiteAccess ? 'Bạn chưa có quyền truy cập trạm điện nào' : ''}
            listEvents={[eventCenter.eventNames.updateSiteName, eventCenter.eventNames.addNewSite, eventCenter.eventNames.deleteSite]}
            onEventDataChange={(eventName, data, setData) => {
                if (eventName === eventCenter.eventNames.updateSiteName) {
                    setData(lastData => {
                        if (lastData?.length) {
                            const newData = lastData.map(d => {
                                if (d.id === data.id) {
                                    d.newId = d.id + (Math.floor(Math.random() * 10000000) + '');
                                    d.name = data.name;
                                }
                                return d;
                            });
                            return [...newData];
                        }
                        return lastData;
                    });
                } else if (eventName === eventCenter.eventNames.addNewSite) {
                    setData(lastData => {
                        if (lastData?.length) {
                            return [data, ...lastData];
                        }
                        return lastData;
                    });
                } else if (eventName === eventCenter.eventNames.deleteSite) {
                    setData(lastData => {
                        if (lastData?.length) {
                            return lastData.filter(d => d.id !== data.id);
                        }
                        return lastData;
                    });
                }
            }}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default SitesTab;
