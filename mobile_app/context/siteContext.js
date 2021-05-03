import React, { useMemo, useState } from 'react';

const SiteContext = React.createContext({ site: undefined, updateSite: () => undefined });

export default SiteContext;

export const SiteProvider = ({ children }) => {
    const [site, setSite] = useState();

    const value = useMemo(() => {
        return {
            site,
            updateSite: site => setSite(site)
        };
    }, [site]);

    return <SiteContext.Provider value={value}>
        {children}
    </SiteContext.Provider>;
};
