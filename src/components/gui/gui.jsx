import classNames from "classnames";
import omit from "lodash.omit";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";
import { connect } from "react-redux";
import MediaQuery from "react-responsive";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import tabStyles from "react-tabs/style/react-tabs.css";
import Renderer from "scratch-render";
import VM from "scratch-vm";

import BackdropLibrary from "../../containers/backdrop-library.jsx";
import Blocks from "../../containers/blocks.jsx";
import CostumeLibrary from "../../containers/costume-library.jsx";
import CostumeTab from "../../containers/costume-tab.jsx";
import SoundTab from "../../containers/sound-tab.jsx";
import StageWrapper from "../../containers/stage-wrapper.jsx";
import TargetPane from "../../containers/target-pane.jsx";
import Watermark from "../../containers/watermark.jsx";
import Box from "../box/box.jsx";
import Loader from "../loader/loader.jsx";
import MenuBar from "../menu-bar/menu-bar.jsx";

import Alerts from "../../containers/alerts.jsx";
import Cards from "../../containers/cards.jsx";
import ConnectionModal from "../../containers/connection-modal.jsx";
import DragLayer from "../../containers/drag-layer.jsx";
import TipsLibrary from "../../containers/tips-library.jsx";
import WebGlModal from "../../containers/webgl-modal.jsx";
import TelemetryModal from "../telemetry-modal/telemetry-modal.jsx";

import layout, { STAGE_SIZE_MODES } from "../../lib/layout-constants";
import { resolveStageSize } from "../../lib/screen-utils";
import { themeMap } from "../../lib/themes";

import html2canvas from "html2canvas";
import { captureImg } from "../../abook/api.js";
import catImage from "../../abook/assets/cat.png";
import failCatImage from "../../abook/assets/fail.png";
import styles from "./gui.css";
import codeIcon from "./icon--code.svg";
import costumesIcon from "./icon--costumes.svg";
import addExtensionIcon from "./icon--extensions.svg";
import soundsIcon from "./icon--sounds.svg";

const messages = defineMessages({
    addExtension: {
        id: "gui.gui.addExtension",
        description: "Button to add an extension in the target pane",
        defaultMessage: "Add Extension",
    },
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = (props) => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksId,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canChangeTheme,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        enableCommunity,
        intl,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isTelemetryEnabled,
        isTotallyNormal,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        saveProjectSb3,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        theme,
        tipsLibraryVisible,
        vm,
        ...componentProps
    } = omit(props, "dispatch");

    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const [isOpenModal, setIsOpenModal] = useState({
        isOpen: false,
        type: null,
    });

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(
            tabStyles.reactTabsTabPanelSelected,
            styles.isSelected
        ),
        tabSelected: classNames(
            tabStyles.reactTabsTabSelected,
            styles.isSelected
        ),
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    // window.addEventListener("message", async (event) => {
    //     if (event.origin === "http://192.168.155.155:5173") {
    //         if (event.data.type === "init") {
    //             //초기 프로젝트로 로드
    //             console.log("어레이버퍼", event.data.file);
    //             // const arrBuffer = event.data.file;
    //             // this.props.vm.loadProject(arrBuffer);
    //             // console.log("DONE");

    //             return;
    //         }
    //         if (event.data.type === "done") {
    //             //채점

    //             saveProjectSb3().then((content) => {
    //                 console.log("채점인 경우");
    //                 window.parent.postMessage(
    //                     {
    //                         data: vm.toJSON(), //jsonData
    //                         file: content, //blobData
    //                         img: "",
    //                     },
    //                     "http://192.168.155.155:5173"
    //                 );
    //                 return;
    //             });

    //             console.log("도대체 몇번 실행됨..?");
    //         }
    //     }
    // });

    return (
        <MediaQuery minWidth={layout.fullSizeMinWidth}>
            {(isFullSize) => {
                const stageSize = resolveStageSize(stageSizeMode, isFullSize);

                return isPlayerOnly ? (
                    <StageWrapper
                        isFullScreen={isFullScreen}
                        isRendererSupported={isRendererSupported}
                        isRtl={isRtl}
                        loading={loading}
                        stageSize={STAGE_SIZE_MODES.large}
                        vm={vm}
                    >
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                    </StageWrapper>
                ) : (
                    <Box
                        className={styles.pageWrapper}
                        dir={isRtl ? "rtl" : "ltr"}
                        {...componentProps}
                    >
                        {telemetryModalVisible ? (
                            <TelemetryModal
                                isRtl={isRtl}
                                isTelemetryEnabled={isTelemetryEnabled}
                                onCancel={onTelemetryModalCancel}
                                onOptIn={onTelemetryModalOptIn}
                                onOptOut={onTelemetryModalOptOut}
                                onRequestClose={onRequestCloseTelemetryModal}
                                onShowPrivacyPolicy={onShowPrivacyPolicy}
                            />
                        ) : null}
                        {loading ? <Loader /> : null}
                        {isCreating ? (
                            <Loader messageId="gui.loader.creating" />
                        ) : null}
                        {isRendererSupported ? null : (
                            <WebGlModal isRtl={isRtl} />
                        )}
                        {tipsLibraryVisible ? <TipsLibrary /> : null}
                        {cardsVisible ? <Cards /> : null}
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                        {connectionModalVisible ? (
                            <ConnectionModal vm={vm} />
                        ) : null}
                        {costumeLibraryVisible ? (
                            <CostumeLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseCostumeLibrary}
                            />
                        ) : null}
                        {backdropLibraryVisible ? (
                            <BackdropLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseBackdropLibrary}
                            />
                        ) : null}
                        <MenuBar
                            accountNavOpen={accountNavOpen}
                            authorId={authorId}
                            authorThumbnailUrl={authorThumbnailUrl}
                            authorUsername={authorUsername}
                            canChangeLanguage={canChangeLanguage}
                            canChangeTheme={canChangeTheme}
                            canCreateCopy={canCreateCopy}
                            canCreateNew={canCreateNew}
                            canEditTitle={canEditTitle}
                            canManageFiles={canManageFiles}
                            canRemix={canRemix}
                            canSave={canSave}
                            canShare={canShare}
                            className={styles.menuBarPosition}
                            enableCommunity={enableCommunity}
                            isShared={isShared}
                            isTotallyNormal={isTotallyNormal}
                            logo={logo}
                            renderLogin={renderLogin}
                            showComingSoon={showComingSoon}
                            onClickAbout={onClickAbout}
                            onClickAccountNav={onClickAccountNav}
                            onClickLogo={onClickLogo}
                            onCloseAccountNav={onCloseAccountNav}
                            onLogOut={onLogOut}
                            onOpenRegistration={onOpenRegistration}
                            onProjectTelemetryEvent={onProjectTelemetryEvent}
                            onSeeCommunity={onSeeCommunity}
                            onShare={onShare}
                            onStartSelectingFileUpload={
                                onStartSelectingFileUpload
                            }
                            onToggleLoginOpen={onToggleLoginOpen}
                            onTest={(isSuccess) => {
                                setIsOpenModal({
                                    isOpen: true,
                                    type: isSuccess ? "success" : "fail",
                                });
                            }}
                        />
                        {isOpenModal.isOpen &&
                        isOpenModal.type === "success" ? (
                            <div
                                style={{
                                    background: "rgba(59,59,59,0.7)",
                                    width: "100%",
                                    height: "100%",
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    zIndex: "999",
                                }}
                            >
                                <div
                                    style={{
                                        width: "400px",
                                        height: "400px",
                                        boxShadow:
                                            " 0px 4px 23px 0px rgba(0, 0, 0, 0.25)",
                                        display: "flex",
                                        background: "var(--Grey-white, #fff)",
                                        flexDirection: "column",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#855CD6",
                                            height: "60px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "0 8px",
                                            fontWeight: 600,
                                            color: "#FFF",
                                            fontSize: "23px",
                                        }}
                                    >
                                        <div>결과</div>
                                        <div
                                            style={{
                                                fontSize: "25px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setIsOpenModal({
                                                    isOpen: false,
                                                    type: null,
                                                });
                                            }}
                                        >
                                            X
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            height: "100%",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "space-around",
                                            padding: "0 8px",
                                        }}
                                    >
                                        <img
                                            width="200px"
                                            height="200px"
                                            alt="고양이"
                                            src={catImage}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "35px",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                성공!
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "20px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                오, 멋지게 해결했네요!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : isOpenModal.isOpen &&
                          isOpenModal.type === "fail" ? (
                            <div
                                style={{
                                    background: "rgba(59,59,59,0.7)",
                                    width: "100%",
                                    height: "100%",
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    zIndex: "999",
                                }}
                            >
                                <div
                                    style={{
                                        width: "400px",
                                        height: "400px",
                                        boxShadow:
                                            " 0px 4px 23px 0px rgba(0, 0, 0, 0.25)",
                                        display: "flex",
                                        background: "var(--Grey-white, #fff)",
                                        flexDirection: "column",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#855CD6",
                                            height: "60px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "0 8px",
                                            fontWeight: 600,
                                            color: "#FFF",
                                            fontSize: "23px",
                                        }}
                                    >
                                        <div>결과</div>
                                        <div
                                            style={{
                                                fontSize: "25px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setIsOpenModal({
                                                    isOpen: false,
                                                    type: null,
                                                });
                                            }}
                                        >
                                            X
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            height: "100%",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "space-around",
                                            padding: "0 8px",
                                        }}
                                    >
                                        <img
                                            width="200px"
                                            height="200px"
                                            alt="고양이"
                                            src={failCatImage}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "35px",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                실패!
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "20px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                다시한번 풀어보세요!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <Box className={styles.bodyWrapper}>
                            <Box className={styles.flexWrapper}>
                                {/* 좌측 코드블럭 */}
                                <div
                                    className={styles.editorWrapper}
                                    id="capture"
                                    style={
                                        {
                                            //  border: "10px solid red"
                                        }
                                    }
                                >
                                    <div
                                        style={{
                                            backgroundColor: "greenyellow",
                                            width: "70px",
                                            height: "30px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                        onClick={async () => {
                                            const captureDiv =
                                                document.getElementById(
                                                    "capture"
                                                );
                                            console.log("1");

                                            html2canvas(captureDiv).then(
                                                (canvas) => {
                                                    canvas.toBlob((blob) => {
                                                        captureImg(blob);
                                                    });
                                                }
                                            );
                                        }}
                                    >
                                        캡쳐
                                    </div>
                                    <Box className={styles.editorWrapper}>
                                        <Tabs
                                            forceRenderTabPanel
                                            className={tabClassNames.tabs}
                                            selectedIndex={activeTabIndex}
                                            selectedTabClassName={
                                                tabClassNames.tabSelected
                                            }
                                            selectedTabPanelClassName={
                                                tabClassNames.tabPanelSelected
                                            }
                                            onSelect={onActivateTab}
                                        >
                                            <TabList
                                                className={
                                                    tabClassNames.tabList
                                                }
                                            >
                                                <Tab
                                                    className={
                                                        tabClassNames.tab
                                                    }
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={codeIcon}
                                                    />
                                                    <FormattedMessage
                                                        defaultMessage="Code"
                                                        description="Button to get to the code panel"
                                                        id="gui.gui.codeTab"
                                                    />
                                                </Tab>
                                                <Tab
                                                    className={
                                                        tabClassNames.tab
                                                    }
                                                    onClick={
                                                        onActivateCostumesTab
                                                    }
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={costumesIcon}
                                                    />
                                                    {targetIsStage ? (
                                                        <FormattedMessage
                                                            defaultMessage="Backdrops"
                                                            description="Button to get to the backdrops panel"
                                                            id="gui.gui.backdropsTab"
                                                        />
                                                    ) : (
                                                        <FormattedMessage
                                                            defaultMessage="Costumes"
                                                            description="Button to get to the costumes panel"
                                                            id="gui.gui.costumesTab"
                                                        />
                                                    )}
                                                </Tab>
                                                <Tab
                                                    className={
                                                        tabClassNames.tab
                                                    }
                                                    onClick={
                                                        onActivateSoundsTab
                                                    }
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={soundsIcon}
                                                    />
                                                    <FormattedMessage
                                                        defaultMessage="Sounds"
                                                        description="Button to get to the sounds panel"
                                                        id="gui.gui.soundsTab"
                                                    />
                                                </Tab>
                                            </TabList>

                                            {/*코드탭 panel*/}

                                            <TabPanel
                                                className={
                                                    tabClassNames.tabPanel
                                                }
                                            >
                                                <Box
                                                    className={
                                                        styles.blocksWrapper
                                                    }
                                                >
                                                    {/* 실습 코드블럭 */}
                                                    <Blocks
                                                        key={`${blocksId}/${theme}`}
                                                        canUseCloud={
                                                            canUseCloud
                                                        }
                                                        grow={1}
                                                        isVisible={
                                                            blocksTabVisible
                                                        }
                                                        options={{
                                                            media: `${basePath}static/${themeMap[theme].blocksMediaFolder}/`,
                                                        }}
                                                        stageSize={stageSize}
                                                        theme={theme}
                                                        vm={vm}
                                                    />
                                                </Box>

                                                {/*extension버튼*/}
                                                <Box
                                                    className={
                                                        styles.extensionButtonContainer
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles.extensionButton
                                                        }
                                                        title={intl.formatMessage(
                                                            messages.addExtension
                                                        )}
                                                        onClick={
                                                            onExtensionButtonClick
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles.extensionButtonIcon
                                                            }
                                                            draggable={false}
                                                            src={
                                                                addExtensionIcon
                                                            }
                                                        />
                                                    </button>
                                                </Box>

                                                {/*실습stage*/}
                                                <Box
                                                    className={styles.watermark}
                                                >
                                                    <Watermark />
                                                </Box>
                                            </TabPanel>
                                            {/*모양탭 panel*/}
                                            <TabPanel
                                                className={
                                                    tabClassNames.tabPanel
                                                }
                                            >
                                                {costumesTabVisible ? (
                                                    <CostumeTab vm={vm} />
                                                ) : null}
                                            </TabPanel>
                                            {/*소리탭 panel*/}
                                            <TabPanel
                                                className={
                                                    tabClassNames.tabPanel
                                                }
                                            >
                                                {soundsTabVisible ? (
                                                    <SoundTab vm={vm} />
                                                ) : null}
                                            </TabPanel>
                                        </Tabs>
                                        {/* {backpackVisible ? (
                                            <Backpack host={backpackHost} />
                                        ) : null} */}
                                    </Box>
                                </div>

                                {/* 우측 고양이 영역 */}
                                <div>
                                    <Box
                                        className={classNames(
                                            styles.stageAndTargetWrapper,
                                            styles[stageSize]
                                        )}
                                    >
                                        <StageWrapper
                                            isFullScreen={isFullScreen}
                                            isRendererSupported={
                                                isRendererSupported
                                            }
                                            isRtl={isRtl}
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                        <Box className={styles.targetWrapper}>
                                            <TargetPane
                                                stageSize={stageSize}
                                                vm={vm}
                                            />
                                        </Box>
                                    </Box>
                                </div>
                            </Box>
                        </Box>
                        <DragLayer />
                    </Box>
                );
            }}
        </MediaQuery>
    );
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    blocksId: PropTypes.string,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    saveProjectSb3: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    theme: PropTypes.string,
    tipsLibraryVisible: PropTypes.bool,

    vm: PropTypes.instanceOf(VM).isRequired,
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: "./",
    blocksId: "original",

    //menu-bar의 설정
    canChangeLanguage: true,
    canChangeTheme: true,
    //menu-bar의 파일
    canManageFiles: true,
    canRemix: false, //사용안함
    canCreateNew: false, //사용안함
    canSave: true, //??
    canEditTitle: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    isTotallyNormal: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large,
};

const mapStateToProps = (state) => ({
    // This is the button's mode, as opposed to the actual current state
    blocksId: state.scratchGui.timeTravel.year.toString(),
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    theme: state.scratchGui.theme.theme,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(
        state.scratchGui.vm
    ),
});

export default injectIntl(connect(mapStateToProps)(GUIComponent));
