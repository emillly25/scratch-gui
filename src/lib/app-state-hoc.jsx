import PropTypes from "prop-types";
import React from "react";
import { Provider } from "react-redux";
import { combineReducers, compose, createStore } from "redux";
import ConnectedIntlProvider from "./connected-intl-provider.jsx";

import localesReducer, {
    initLocale,
    localesInitialState,
} from "../reducers/locales";

import { setFullScreen, setPlayer } from "../reducers/mode.js";

import html2canvas from "html2canvas";
import locales from "scratch-l10n";
import { detectLocale } from "./detect-locale";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @param {boolean} localesOnly - only provide the locale state, not everything
 *                      required by the GUI. Used to exclude excess state when
                        only rendering modals, not the GUI.
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent, localesOnly) {
    class AppStateWrapper extends React.Component {
        constructor(props) {
            super(props);
            let initialState = {};
            let reducers = {};
            let enhancer;

            let initializedLocales = localesInitialState;
            const locale = detectLocale(Object.keys(locales));
            if (locale !== "en") {
                initializedLocales = initLocale(initializedLocales, locale);
            }
            if (localesOnly) {
                // Used for instantiating minimal state for the unsupported
                // browser modal
                reducers = { locales: localesReducer };
                initialState = { locales: initializedLocales };
                enhancer = composeEnhancers();
            } else {
                // You are right, this is gross. But it's necessary to avoid
                // importing unneeded code that will crash unsupported browsers.
                const guiRedux = require("../reducers/gui");
                const guiReducer = guiRedux.default;
                const {
                    guiInitialState,
                    guiMiddleware,
                    initFullScreen,
                    initPlayer,
                    initTelemetryModal,
                } = guiRedux;
                const { ScratchPaintReducer } = require("scratch-paint");

                let initializedGui = guiInitialState;
                if (props.isFullScreen || props.isPlayerOnly) {
                    if (props.isFullScreen) {
                        initializedGui = initFullScreen(initializedGui);
                    }
                    if (props.isPlayerOnly) {
                        initializedGui = initPlayer(initializedGui);
                    }
                } else if (props.showTelemetryModal) {
                    initializedGui = initTelemetryModal(initializedGui);
                }
                reducers = {
                    locales: localesReducer,
                    scratchGui: guiReducer,
                    scratchPaint: ScratchPaintReducer,
                };
                initialState = {
                    locales: initializedLocales,
                    scratchGui: initializedGui,
                };
                enhancer = composeEnhancers(guiMiddleware);
            }
            const reducer = combineReducers(reducers);
            this.store = createStore(reducer, initialState, enhancer);
        }
        componentDidUpdate(prevProps) {
            if (localesOnly) return;
            if (prevProps.isPlayerOnly !== this.props.isPlayerOnly) {
                this.store.dispatch(setPlayer(this.props.isPlayerOnly));
            }
            if (prevProps.isFullScreen !== this.props.isFullScreen) {
                this.store.dispatch(setFullScreen(this.props.isFullScreen));
            }
        }
        render() {
            const {
                isFullScreen, // eslint-disable-line no-unused-vars
                isPlayerOnly, // eslint-disable-line no-unused-vars
                showTelemetryModal, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;

            window.addEventListener("message", async (event) => {
                console.log("부모 도메인", event.origin);
                if (event.origin === "http://192.168.155.155:5173") {
                    if (event.data.type === "init") {
                        //초기 프로젝트로 로드
                        const blockData = event.data.blockData;
                        console.log(
                            "스크래치: ㅇㅇ 처음 프로젝트 시작이얌",
                            blockData
                        );
                        //TODO 블록데이터 null처리 (초기값)
                        if (blockData !== null) {
                            this.store
                                .getState()
                                .scratchGui.vm.loadProject(blockData);
                        }

                        return;
                    }

                    if (event.data.type === "save") {
                        //임시저장
                        console.log("스크래치: 응그래 지금까지 한거 파일 드림");
                        window.parent.postMessage(
                            {
                                data: this.store
                                    .getState()
                                    .scratchGui.vm.toJSON(), //jsonData
                                img: "",
                                isDone: false,
                            },
                            "http://192.168.155.155:5173"
                        );
                    }
                    if (event.data.type === "done") {
                        //채점
                        console.log("스크래치: 응그래 다했니 니파일 정보 드림");
                        const captureDiv = document.getElementById("capture");
                        html2canvas(captureDiv).then((canvas) => {
                            canvas.toBlob((blob) => {
                                window.parent.postMessage(
                                    {
                                        data: this.store
                                            .getState()
                                            .scratchGui.vm.toJSON(), //jsonData
                                        img: blob,
                                        isDone: true,
                                    },
                                    "http://192.168.155.155:5173"
                                );
                            });
                        });
                    }
                }
            });

            return (
                <Provider store={this.store}>
                    <ConnectedIntlProvider>
                        <WrappedComponent {...componentProps} />
                    </ConnectedIntlProvider>
                </Provider>
            );
        }
    }
    AppStateWrapper.propTypes = {
        isFullScreen: PropTypes.bool,
        isPlayerOnly: PropTypes.bool,
        isTelemetryEnabled: PropTypes.bool,
        showTelemetryModal: PropTypes.bool,
    };
    return AppStateWrapper;
};

export default AppStateHOC;
