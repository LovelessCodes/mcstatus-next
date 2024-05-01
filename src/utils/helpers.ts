export const copyIP = async (e: React.MouseEvent<Element, MouseEvent>, ip: string) => {
    await navigator.clipboard.writeText(ip);
    const target = e.currentTarget;
    if (target) {
        target.classList.toggle("tooltip-success");
        target.setAttribute("data-tip", "Copied");
        setTimeout(() => {
            target.classList.toggle("tooltip-success");
            target.setAttribute("data-tip", "Copy IP");
        }, 1000);
    }
}