import React from 'react';

const DiscordBanner = () => {
    return (
        <div className="px-3 w-full text-amber-50 mt-20">
            <div
                className="mb-[70px] flex gap-9 flex-col justify-center items-center w-full bg-[#0C0C0C] max-h-fit py-[3%] rounded-3xl">
                <div className="flex flex-col text-center items-center gap-[15px]">
                    <div
                        className="text-[20px] sm:text-[34px] lg:text-5xl leading-[58px] font-bold font-Cormorant tracking-[0.03em]">Join
                        Our Community
                    </div>
                    <div
                        className="font-montserrat tracking-[0.03em] px-2 text-[15px] md:text-xl leading-[24px] font-normal">Meet
                        the company team, artist and collector for platform updates, announcements, and more ...
                    </div>
                </div>
                <button
                    className="max-w-[252px] text-lg w-full py-3 md:py-3 flex gap-2.5 justify-center items-center rounded-[68px] flex justify-center items-center bg-[#2D4263] font-[500] tracking-tight text-[#ECDBBA]">
                    <div className=""><img className={`w-[30px] h-[30px]`} src="https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png" alt="discord"/></div>
                    <div className="relative">
                        <div className="flex justify-center items-center gap-3">
                            <div className="label">Launch Discord</div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default DiscordBanner;
