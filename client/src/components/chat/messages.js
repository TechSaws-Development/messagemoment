import blue_alert from "@/assets/icons/chat/blue_alert.svg";
import chatgptIcon from "@/assets/icons/chat/chatgpt.svg";
import circulartick from "@/assets/icons/chat/circular-tick.svg";
import imguploadIcon from "@/assets/icons/chat/files-icons/imgupload.svg";
import lock_grey from "@/assets/icons/chat/lock_grey.svg";
import pin from "@/assets/icons/chat/pin.svg";
import alert from "@/assets/icons/chat/red_alert.svg";
import warning_sign from "@/assets/icons/chat/warning_sign.svg";
import { chatContext } from "@/contexts/chat-context";
import { messageType, scrollToBottom, USER_HANDERLS } from "@/dummy-data";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { getMessageClass } from "./chat-messages-utils";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";
import { messageContainerRef } from "./messagesBox";

/**
 * Renders a chat message with various types and styles based on the message type.
 *
 * @param {Object} props - The properties for the message component.
 * @param {string} [props.type=messageType.GREETING] - The type of the message, determines the rendering style.
 * @param {Object} [props.attachmentFile={}] - The file attached to the message, if any.
 * @param {string} [props.handlerName="[MessageMoment.com]"] - The name of the handler displaying the message.
 * @param {string} [props.message="Welcome to MessageMoment.com, where your message only lasts a moment!"] - The message text to display.
 * @param {string} [props.handlerColor=USER_HANDERLS[3]] - The color used for the handler name text.
 * @param {string} [props.userNameColor=USER_HANDERLS[3]] - The color used for the user name text in certain message types.
 *
 * @returns {JSX.Element} - The rendered message component.
 */

const Message = ({
  type = messageType.GREETING,
  attachmentFile = {},
  handlerName = "[MessageMoment.com]",
  message = "Welcome to MessageMoment.com, where your message only lasts a moment!",
  handlerColor = USER_HANDERLS[3],
  userNameColor = USER_HANDERLS[3],
}) => {
  const el = useRef(null);
  const { isMessageMobileView: isMobileView } = useCheckIsMobileView();
  useEffect(() => {
  let typed;
  let observer;
  let lastContent = "";
  let userScrolled = false;
  let scrollPauseTimeout;
  const container = messageContainerRef.current;

  const handleUserScroll = () => {
    if (!userScrolled) {
      userScrolled = true;
    }
    clearTimeout(scrollPauseTimeout);
    scrollPauseTimeout = setTimeout(() => {
      userScrolled = false; // Resume auto-scroll after 3 seconds of inactivity
    }, 3000);
  };

  if (container) {
    container.addEventListener("scroll", handleUserScroll);
  }

  if (el.current) {
    typed = new Typed(el.current, {
      strings: [message],
      typeSpeed: 25,
      showCursor: false,
    });

    observer = new MutationObserver(() => {
      const currentContent = el.current?.innerHTML;
      if (currentContent && currentContent !== lastContent) {
        lastContent = currentContent;
        if (!userScrolled) {
          scrollToBottom?.(); // Only scroll if user isn't actively scrolling
        }
      }
    });

    observer.observe(el.current, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  return () => {
    if (typed) typed.destroy();
    if (observer) observer.disconnect();
    if (container) container.removeEventListener("scroll", handleUserScroll);
    clearTimeout(scrollPauseTimeout);
  };
}, []);
  const {
    setShowReportfileModal,
    sessionData,
    connectWalletFunction,
    isWalletConnected,
    isWalletExist,
  } = chatContext();

  // UI
  const renderAdertisment = () => {
    return (
      <>
        <p
          className={
            type == messageType.ADVERTISEMENT
              ? "chat-text handlertext"
              : "chat-text handlertext"
          }
        >
          {handlerName}
        </p>
        <p className="chat-text msg_txt">
          Big Sale on at Flight Centre! Don’t miss out. Visit{" "}
          <a
            target="_blank"
            href="www.flightcentre.com"
            style={{ textDecoration: "underline" }}
          >
            www.flightcentre.com
          </a>{" "}
          now and book your trip!
        </p>
      </>
    );
  };
  const renderMessageMoment = () => {
    return (
      <>
        <p className={"chat-text handlertext"}></p>
        <div
          className="chat-text msg_txt"
          style={{
            paddingTop: "14px",
          }}
        >
          {(sessionData?.type == "Secure" || sessionData?.type == "Wallet") && (
            <>
              Thank you!
              <div id="dot-line">
                <p>.</p>
                <p>.</p>
                <p>.</p>{" "}
              </div>
            </>
          )}
          {">"} Please enter your Display Name to proceed:
          <br />
          <p className="chat-text msg_txt" style={{ marginTop: "10px" }}>
            <a href="/faqs#display_name" target="_blank">
              {" "}
              Refer to FAQs for Display Name rules
            </a>
            .
          </p>
          <p>---</p>
          <span className="small-msg-txt">
            By proceeding, you agree that you are solely responsible for your
            actions and any content that you post or share during the chat
            session. MessageMoment does not assume any liability for the content
            posted by users or for any damages that may result from using this
            service.
          </span>
        </div>
      </>
    );
  };
  const renderMessageMomentAlert = () => {
    return (
      <>
        <p
          className={"chat-text handlertext"}
          style={{ color: handlerColor ? handlerColor : "#494AF8" }}
        >
          {handlerName}
        </p>
        <p className="chat-text msg_txt">{message}</p>
      </>
    );
  };
  const renderMessageMomentAlertRemoveUser = () => {
    return (
      <>
        <p
          className={"chat-text handlertext"}
          style={{ color: handlerColor ? handlerColor : "#494AF8" }}
        >
          {handlerName}
        </p>
        <p className="chat-text msg_txt">
          You are about to remove{" "}
          <span style={{ color: userNameColor }}>{message}</span> from this chat
          session. Are you sure you want to proceed? Type 'y' for Yes, 'n' for
          No.
        </p>
      </>
    );
  };

  const renderChatgptResponse = () => {
    return (
      <>
        <p className={"chat-text handlertext"} style={{ color: "#494AF8" }}>
          [MessageMoment.com]
        </p>
        <p
          className="chat-text msg_txt"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <Image src={chatgptIcon} alt="chatgptIcon" /> <span ref={el}></span>
        </p>
      </>
    );
  };

  const renderChatgptInput = () => {
    return (
      <>
        <p className={"chat-text handlertext"} style={{ color: handlerColor }}>
          {handlerName}
        </p>{" "}
        <p className="chat-text msg_txt">
          <span style={{ color: "#494AF8" }}>[MM]</span> {message}
          {/* <p className="chat-text msg_txt">[MM]</p> {message} */}
        </p>
      </>
    );
  };

  const renderMessageMomentError = () => {
    return (
      <>
        {isMobileView ? (
          <>
            <div className="alert-flex">
              <Image src={alert} alt="dsk-icon" />
              <p className={`chat-text err-txt`}>[MessageMoment.com]</p>
            </div>
          </>
        ) : (
          <>
            <Image src={alert} alt="dsk-icon" />
            <p className={`chat-text err-txt`}>[MessageMoment.com]</p>
          </>
        )}
        <p className="chat-text msg_txt">{message}</p>
      </>
    );
  };

  const renderMMAlert = () => {
    return (
      <>
        {isMobileView ? (
          <>
            <div className="alert-flex">
              <Image src={blue_alert} alt="blue_alert" />
              <p className={`chat-text success-txt`}>[MessageMoment.com]</p>
            </div>
            <p className="chat-text msg_txt">{message}</p>
          </>
        ) : (
          <>
            <Image src={blue_alert} alt="blue_alert" />
            <p className={`chat-text success-txt`}>[MessageMoment.com]</p>
            <p className="chat-text msg_txt">{message}</p>
          </>
        )}
      </>
    );
  };

  const renderMMGreetings = () => {
    return (
      <>
        <p className={"chat-text handlertext"}>{handlerName}</p>{" "}
        <p
          className="chat-text msg_txt "
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            gap: "3px",
          }}
        >
          {message}
          <span>
            <Image src={pin} alt="pin" />
          </span>
        </p>
      </>
    );
  };

  const renderSecruityCodePrompt = () => {
    return (
      <>
        <p className={"chat-text handlertext"}>{handlerName}</p>
        <div className="chat-text msg_txt">
          <Image src={lock_grey} alt="lock_grey" className="padlock" /> This
          chat session is protected using a Security Code.
          <div id="dot-line">
            <p>.</p>
            <p>.</p>
            <p>.</p>{" "}
          </div>
          {">"} Please enter the Security Code you received with your chat link:
        </div>
      </>
    );
  };

  const renderPhantomPrompt = () => {
    return (
      <>
        <p className={"chat-text handlertext"}></p>
        <div className="chat-text msg_txt">
          This chat session is being protected using{" "}
          {isWalletExist ? (
            <>
              <a
                href="https://phantom.app/"
                target="_blank"
                style={{ cursor: "pointer" }}
              >
                Phantom Wallet
              </a>
              .
            </>
          ) : (
            <>Phantom Wallet.</>
          )}
          <div style={{ marginTop: "10px" }}>
            {isWalletExist ? (
              <>
                To proceed, please verify your identity by clicking{" "}
                {!isWalletConnected && isWalletExist ? (
                  <a
                    onClick={connectWalletFunction}
                    style={{ cursor: "pointer" }}
                  >
                    here
                  </a>
                ) : (
                  <>here</>
                )}
                .
              </>
            ) : (
              <>
                To proceed,
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  please install and connect to Phantom Wallet to authenticate
                </a>
                .
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderAskToSetTimer = () => {
    return (
      <>
        <p className={"chat-text handlertext"}>[MessageMoment.com]</p>
        <div className="chat-text msg_txt">
          <p className="chat-text msg_txt">
            {">"} Please enter the Message Expiration Time (in seconds) between
            3 and 300. This can only be set once for all users, by any user, at
            any time. If this value is is not defined, the default will be 30
            seconds.
          </p>
          <div id="dot-line">
            <p>.</p>
            <p>.</p>
            <p>.</p>{" "}
          </div>
          {"*"} Set it with the command{" "}
          <span id="blut-txt">/timer [seconds] </span>*
        </div>
      </>
    );
  };
  const renderProjectMode = () => {
    return (
      <>
        <p className={"chat-text handlertext"}>[MessageMoment.com]</p>
        <div className="chat-text msg_txt">
          <p className="chat-text msg_txt">
            You are about to enter Project Mode. Are you sure you want to
            proceed? Type 'y' for Yes, 'n' for No
          </p>
          <div id="dot-line">
            <p>---</p>
          </div>
          <span className="small-msg-txt">
            By proceeding, you are confirming your understanding and agreement
            to these conditions:
            <ul>
              <li>
                1. The Message Expiry Time will be paused, meaning no messages
                will be auto-deleted.
              </li>
              <li>
                2. From this point forward, all chat messages can be saved.
              </li>
              <li>
                3. To safeguard previous conversations, all existing chat will
                be cleared upon activation of Project Mode.
              </li>
              <li>
                4. You and all fellow participants agree to these conditions.
              </li>
            </ul>
          </span>
        </div>
      </>
    );
  };

  const renderProjectModeEntry = () => {
    return (
      <>
        <p className={"chat-text handlertext"}>[MessageMoment.com]</p>
        <div className="chat-text msg_txt">
          <p className="chat-text msg_txt mb-10">
            Should you wish to exit Project Mode at any point, please use the
            <span id="blut-txt"> /project off</span> command.
          </p>
          <p className="chat-text msg_txt mb-10">
            If you would like to save a transcript of your chat, you can do so
            by using the <span id="blut-txt">/download</span> command.{" "}
          </p>
          <p className="chat-text msg_txt mb-10">
            To interact with ChatGPT, use the <span id="blut-txt">/mm</span>{" "}
            command.
          </p>
          <p className="chat-text msg_txt">
            To clear all messages in Project Mode, use the{" "}
            <span id="blut-txt">/clear</span> command.
          </p>
        </div>
      </>
    );
  };

  const renderAttachmentMessage = () => {
    return (
      <>
        <p
          className={"chat-text handlertext"}
          style={{ color: USER_HANDERLS[3] }}
        >
          {handlerName}
        </p>{" "}
        <div className="chat-text msg_txt">
          {message && message != "" && (
            <p className="chat-text msg_txt" id="mt-15">
              {message}
            </p>
          )}
          <p className="chat-text msg_txt">
            <a
              href="https://filemoment.com/sqjgcf9o2s5narz8k"
              className="underline-blue"
              target="_blank"
              style={{ wordWrap: "break-word" }}
            >
              https://filemoment.com/sqjgcf9o2s5narz8k
            </a>
          </p>
          {isMobileView ? (
            <>
              <div id="attachment-file_m">
                {/*  */}
                <div
                  id="row-flex"
                  style={{
                    flex: 1,
                    alignItems: "center",
                    padding: "11px 11px 10px 11px",
                  }}
                >
                  <div id="row-flex" className="file-name">
                    <Image
                      src={
                        attachmentFile?.img
                          ? attachmentFile?.img
                          : imguploadIcon
                      }
                      alt="attachment_icon"
                    />
                    <p className="chat-text msg_txt " id="ml-10">
                      {attachmentFile?.name && attachmentFile?.name.length > 15
                        ? `${attachmentFile?.name.slice(0, 16)}...`
                        : attachmentFile?.name}
                    </p>
                  </div>

                  <div className="download-btn_m">
                    <p className="chat-text msg_txt">Download</p>
                  </div>
                </div>
                <div className="hr-row" />
                <div
                  id="row-flex"
                  style={{
                    flex: 1,
                    alignItems: "center",
                    padding: "5px 15px 5px 38px",
                  }}
                >
                  <p className="chat-text msg_txt">{attachmentFile?.size} MB</p>

                  <div
                    id="row-flex"
                    style={{
                      width: "50%",
                      gap: "10px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Image src={warning_sign} alt="warning_sign" />
                    <p
                      className="small-msg-txt"
                      onClick={() => setShowReportfileModal(true)}
                    >
                      Report File
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div id="attachment-file">
                {/*  */}
                <div id="row-flex" className="file-name">
                  <Image
                    src={
                      attachmentFile?.img ? attachmentFile?.img : imguploadIcon
                    }
                    alt="attachment_icon"
                  />
                  <p className="chat-text msg_txt " id="ml-10">
                    {attachmentFile?.name}
                  </p>
                </div>
                <div>
                  <p className="chat-text msg_txt">{attachmentFile?.size} MB</p>
                </div>
                <div className="download-btn">
                  <p className="chat-text msg_txt">Download</p>
                </div>
              </div>
            </>
          )}

          <div id="row-flex" style={{ alignItems: isMobileView && "baseline" }}>
            <Image
              src={circulartick}
              alt="circulartick"
              style={{
                top: isMobileView && "4px",
                position: isMobileView && "relative",
              }}
            />
            <p
              className="small-msg-txt "
              id="gap-words"
              style={{
                alignItems: "center",
                lineHeight: isMobileView && "0px",
              }}
            >
              Securely checked and hosted by FileMoment. Visit{" "}
              <a
                href="www.filemoment.com"
                className="underline-grey"
                target="_blank"
                style={{
                  wordSpacing: "10px",
                  lineHeight: "24.25px",
                }}
              >
                www.filemoment.com
              </a>
              !
            </p>
            {!isMobileView && (
              <div id="row-flex2">
                <Image src={warning_sign} alt="warning_sign" />
                <p
                  className="small-msg-txt"
                  onClick={() => setShowReportfileModal(true)}
                >
                  Report File
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // NessageContent
  const renderMessageContent = (type) => {
    const renderMap = {
      [messageType.ADVERTISEMENT]: renderAdertisment,
      [messageType.MESSAGE_MOMENT]: renderMessageMoment,
      [messageType.JOINED]: renderMessageMomentAlert,
      [messageType.MM_NOTIFICATION]: renderMessageMomentAlert,
      [messageType.MM_ERROR_MSG]: renderMessageMomentError,
      [messageType.MM_ALERT]: renderMMAlert,
      [messageType.GREETING]: renderMMGreetings,
      [messageType.SECURITY_CODE]: renderSecruityCodePrompt,
      [messageType.ASK_TO_SET_EXPIRYTIME]: renderAskToSetTimer,
      [messageType.EXPIRY_TIME_HAS_SET]: renderMessageMomentAlert,
      [messageType.PROJECT_MODE]: renderProjectMode,
      [messageType.PROJECT_MODE_ENTRY]: renderProjectModeEntry,
      [messageType.ATTACHMENT_MESSAGE]: renderAttachmentMessage,
      [messageType.CHATGPT_RESPONSE]: renderChatgptResponse,
      [messageType.CHATGPT_INPUT]: renderChatgptInput,
      [messageType.MM_NOTIFICATION_REMOVE_USER]:
        renderMessageMomentAlertRemoveUser,
      [messageType.PHANTOM_WALLET]: renderPhantomPrompt,
    };

    return renderMap[type] ? (
      renderMap[type]()
    ) : (
      <>
        <p className="chat-text handlertext" style={{ color: handlerColor }}>
          {handlerName}
        </p>

        {/* This will be used for sender message without slow typing effect: <p className="chat-text msg_txt" >
              {message}
            </p> */}
        <p className="chat-text msg_txt" ref={el}></p>
      </>
    );
  };

  return (
    <div className="chat-msg-cont">
      <div
        style={{
          margin:
            (sessionData?.type == "Standard" ||
              sessionData?.type == "Secure") &&
            type == messageType.MESSAGE_MOMENT
              ? "15px 0px"
              : "",
        }}
        className={getMessageClass(type)}
      >
        {renderMessageContent(type)}
      </div>
    </div>
  );
};

export default Message;
