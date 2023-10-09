import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex justify-center h-screen">
                <div className= " border-x w-full h-full border-slate-400 overflow-y-scroll md:max-w-2xl">
                    {props.children}
                </div>
        </main>        
    );
};
    