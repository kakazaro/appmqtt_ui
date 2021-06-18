import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListScroll from '../../component/listScroll';
import UserBadge from '../../component/listBadge/userBadge';
import eventCenter from '../../common/eventCenter';

const UsersTab = () => {
    return <View style={styles.container}>
        <ListScroll
            renderItem={(item) => <UserBadge item={item}/>}
            showPlaceholder={true}
            path={'users'}
            url={'/users/list'}
            listEvents={[eventCenter.eventNames.updateUserRole, eventCenter.eventNames.addNewUser, eventCenter.eventNames.deleteUser]}
            onEventDataChange={(eventName, data, setData) => {
                if (eventName === eventCenter.eventNames.updateUserRole) {
                    setData(lastData => {
                        if (lastData?.length) {
                            const newData = lastData.map(d => {
                                if (d._id === data.id) {
                                    d.newId = d.id + (Math.floor(Math.random() * 10000000) + '');
                                    d.role = data.role;
                                }
                                return d;
                            });
                            return [...newData];
                        }
                        return lastData;
                    });
                } else if (eventName === eventCenter.eventNames.addNewUser) {
                    setData(lastData => {
                        if (lastData?.length) {
                            return [data, ...lastData];
                        } else {
                            return [data];
                        }
                    });
                } else if (eventName === eventCenter.eventNames.deleteUser) {
                    setData(lastData => {
                        if (lastData?.length) {
                            return lastData.filter(d => d._id !== data.id);
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
        alignItems: 'center'
    },
});

export default UsersTab;
