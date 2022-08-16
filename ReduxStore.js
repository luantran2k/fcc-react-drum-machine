// Redux
const DRUM_PRESS = "DRUM_PRESS";
const POWER_CLICK = "POWER_CLICK";
const BANK_CLICK = "BANK_CLICK";
const UPDATE_VOLUME = "UPDATE_VOLUME";

export const drumPressAction = (drumButtonName) => ({
    type: DRUM_PRESS,
    drumButtonName,
});

export const powerClickAction = (isOn) => ({
    type: POWER_CLICK,
    isOn,
});

export const bankClickAction = (isOn) => ({
    type: BANK_CLICK,
    isOn,
});

export const updateVolumeAction = (volume) => ({
    type: UPDATE_VOLUME,
    volume,
});

const defaultState = {
    lastDrumButtonName: "",
    power: true,
    bank: false,
    volume: 0.3,
};
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case DRUM_PRESS:
            return { ...state, lastDrumButtonName: action.drumButtonName };
        case POWER_CLICK:
            return { ...state, power: !state.power };
        case BANK_CLICK:
            return { ...state, bank: !state.bank };
        case UPDATE_VOLUME:
            return { ...state, volume: action.volume };
        default:
            return state;
    }
};
export const store = Redux.createStore(reducer);
