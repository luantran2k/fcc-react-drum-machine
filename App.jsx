import {
    bankOne,
    bankTwo,
    redColor,
    grayColor,
    cyanColor,
    tealColor,
    yellowColor,
} from "./object.js";
const { useState, useEffect } = React;
const { Provider, connect } = ReactRedux;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Redux
const DRUM_PRESS = "DRUM_PRESS";
const POWER_CLICK = "POWER_CLICK";
const BANK_CLICK = "BANK_CLICK";
const UPDATE_VOLUME = "UPDATE_VOLUME";

const drumPressAction = (drumButtonName) => ({
    type: DRUM_PRESS,
    drumButtonName,
});

const powerClickAction = (isOn) => ({
    type: POWER_CLICK,
    isOn,
});

const bankClickAction = (isOn) => ({
    type: BANK_CLICK,
    isOn,
});

const updateVolumeAction = (volume) => ({
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
const store = Redux.createStore(reducer);

// React

const playAudio = (audio, volume) => {
    audio.volume = volume;
    audio.play();
};

function DrumButton(props) {
    const { keyTrigger, id, url } = props.audioObj;
    const handelMouseDown = (event) => {
        if (store.getState().power) {
            event.target.classList.add("active");
            playAudio(event.target.childNodes[1], store.getState().volume);
            props.drumPress(id);
        }
    };
    const handleMouseUp = (event) => {
        event.target.classList.remove("active");
    };
    const handelMouseOut = (event) => {
        event.target.classList.remove("active");
    };

    return (
        <button
            className="drum-button drum-pad"
            key-trigger={keyTrigger}
            onMouseDown={handelMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOut={handelMouseOut}
            id={id}
        >
            {keyTrigger}
            <audio id={keyTrigger} className="clip" src={url}></audio>
        </button>
    );
}

const DrumButtonConnected = connect(
    (state) => {},
    (dispatch) => ({
        drumPress: (drumButtonName) => {
            dispatch(drumPressAction(drumButtonName));
        },
    })
)(DrumButton);

function DrumButtons(props) {
    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            let audio = $(`#${event.key.toLocaleUpperCase()}`);
            if (audio && store.getState().power) {
                playAudio(audio, store.getState().volume);
                audio.parentNode.classList.add("active");
                props.drumPress(audio.parentNode.id);
            }
        });
        document.addEventListener("keyup", (event) => {
            [...$$(".drum-button")].forEach((drumButton) => {
                drumButton.classList.remove("active");
            });
        });
    }, []);
    return (
        <div id="drum-buttons">
            {props.audioObjs.map((audioObj) => (
                <DrumButtonConnected key={audioObj.id} audioObj={audioObj} />
            ))}
        </div>
    );
}

const DrumButtonsConnected = connect(
    (state) => {},
    (dispatch) => ({
        drumPress: (drumButtonName) => {
            dispatch(drumPressAction(drumButtonName));
        },
    })
)(DrumButtons);

function Switch(props) {
    const [on, setOn] = useState(props.isOn);

    const handleClickBody = (event) => {
        setOn(!on);
        props.click(on);
    };

    return (
        <div className="button-container">
            <p className="label">{props.label}</p>
            <div
                className={`switch-body ${props.isOn && "active"}`}
                onClick={handleClickBody}
            >
                <div className="switch-button"></div>
            </div>
        </div>
    );
}

function Slider(props) {
    const [value, setValue] = useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
        props.updateVolume(parseInt(event.target.value) / 100);
    };

    return (
        <div className="volume-item">
            <label className="label" htmlFor="volume">
                Volume: {value}
            </label>
            <input
                type="range"
                min="1"
                max="100"
                className="slider"
                value={value}
                onChange={handleChange}
                id="volume"
            />
        </div>
    );
}

const ColorPicker = (props) => {
    const setColor = (rootElement, colors) => {
        rootElement.style.setProperty("--background-color", colors[1]);
        rootElement.style.setProperty("--color-1", colors[2]);
        rootElement.style.setProperty("--color-2", colors[3]);
        rootElement.style.setProperty("--color-3", colors[4]);
    };
    const handleClick = (event) => {
        let color = event.target.getAttribute("value");
        let rootElement = $(":root");
        switch (color) {
            case "red":
                setColor(rootElement, redColor);
                break;
            case "gray":
                setColor(rootElement, grayColor);
                break;
            case "cyan":
                setColor(rootElement, cyanColor);
                break;
            case "teal":
                setColor(rootElement, tealColor);
                break;
            case "yellow":
                setColor(rootElement, yellowColor);
                break;
            default:
                setColor(rootElement, tealColor);
                break;
        }
    };
    return (
        <ul className="color-picker">
            {props.colors.map((color, index) => (
                <li
                    key={index}
                    value={color[0]}
                    style={{ backgroundColor: color[4] }}
                    onClick={handleClick}
                ></li>
            ))}
        </ul>
    );
};

function Control(props) {
    return (
        <div id="control">
            <div className="switch-group">
                <Switch
                    label="Power"
                    isOn={props.power}
                    click={props.powerClick}
                />
                <Switch
                    label="Bank"
                    isOn={props.bank}
                    click={props.bankClick}
                />
            </div>
            <p id="display">{props.lastDrumButtonName.replace("-", " ")}</p>
            <Slider
                value={props.volume * 100}
                updateVolume={props.updateVolume}
            />
            <ColorPicker
                colors={[
                    redColor,
                    grayColor,
                    cyanColor,
                    tealColor,
                    yellowColor,
                ]}
            />
        </div>
    );
}

const ControlConnected = connect(
    (state) => state,
    (dispatch) => ({
        powerClick: (isOn) => {
            dispatch(powerClickAction(isOn));
        },
        bankClick: (isOn) => {
            dispatch(bankClickAction(isOn));
        },
        updateVolume: (volume) => {
            dispatch(updateVolumeAction(volume));
        },
    })
)(Control);

function App(props) {
    return (
        <div id="drum-machine">
            {/* <DrumButtons audioObjs={props.bank ? bankTwo : bankOne} /> */}
            <DrumButtonsConnected audioObjs={props.bank ? bankTwo : bankOne} />
            <ControlConnected />
        </div>
    );
}

function AppWrapper(props) {
    const AppContainer = connect(
        (state) => ({ bank: state.bank }),
        () => {}
    )(App);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}

const root = ReactDOM.createRoot($("#root"));
root.render(<AppWrapper />);
