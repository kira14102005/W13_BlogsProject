export const CustomButton = ({ onclick, label }: { onclick: () => any, label: string }) => {
    return <><button
        onClick={onclick}
        className="shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white  transition duration-200"
    >
        {label}
    </button></>
}