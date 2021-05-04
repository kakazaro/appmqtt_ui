import React, { useEffect, useMemo, useState } from 'react';
import eventCenter from '../common/eventCenter';

const SiteContext = React.createContext({
    site: undefined,
    device: undefined,
    updateSite: () => undefined,
    updateDevice: () => undefined
});

export default SiteContext;

export const SiteProvider = ({ children }) => {
    const [site, setSite] = useState();
    const [device, setDevice] = useState();

    useEffect(() => {
        const handler = (data) => {
            setSite(lastSite => {
                if (lastSite?.id === data.id) {
                    return {
                        ...lastSite,
                        name: data.name
                    };
                }
                return lastSite;
            });
        };

        eventCenter.register(eventCenter.eventNames.updateSiteName, handler);

        return () => {
            eventCenter.unRegister(eventCenter.eventNames.updateSiteName, handler);
        };
    }, []);

    const value = useMemo(() => {
        return {
            site,
            device,
            updateSite: site => {
                setSite(site);
                setDevice(undefined);
            },
            updateDevice: device => setDevice(device)
        };
    }, [site, device]);

    return <SiteContext.Provider value={value}>
        {children}
    </SiteContext.Provider>;
};
