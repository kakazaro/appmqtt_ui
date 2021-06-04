import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../listScroll';
import SiteBadge from '../listBadge/siteBadge';
import eventCenter from '../../common/eventCenter';
import UserContext from '../../context/userContext';
import utility from '../../common/utility';

const SitesTab = ({ navigation }) => {
    const userContext = useContext(UserContext);

    return <View style={styles.container}>
        <ListScroll
            renderItem={(item) => <SiteBadge item={item}/>}
            showPlaceholder={true}
            path={'sites'}
            url={'/site/list'}
            emptyMessage={userContext?.user?.role !== utility.USER_ROLES.SA.id ? 'Bạn chưa có quyền truy cập trạm điện nào' : ''}
            listEvents={[eventCenter.eventNames.updateSiteName, eventCenter.eventNames.addNewSite]}
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
                }
            }}
            onFailAuth={() => {
                userContext.logout(navigation);
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
