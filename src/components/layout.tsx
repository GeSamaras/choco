import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex justify-center h-screen">
            <div className= " bg-orange-300/70 border-black overflow-y-scroll w-full h-full border-x md:max-w-2xl">
                    {props.children}
                </div>
        </main>        
    );
};
    