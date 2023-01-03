import React, {ReactNode} from "react";

const Layout = ({children, sidebar}: {children: ReactNode | ReactNode[], sidebar: ReactNode, ratio?: string}) => {
    return <div className={`lg:grid lg:grid-cols-6 lg:gap-10`}>
        <div className={`col-span-1 mb-12 lg:mb-0`}>
            <aside className="w-52 px-4 dark:text-slate-100">
                {sidebar}
            </aside>
        </div>
        <div className={`col-span-5 px-5 lg:px-0`}>
            {children}
        </div>
    </div>
}

export default Layout;
