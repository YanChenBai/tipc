declare function useWindowTipc(name: string): {
    checkAllWindow: () => void;
    destroy: () => void;
    init: () => void;
};

export { useWindowTipc };
