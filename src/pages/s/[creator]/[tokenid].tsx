import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Poppins } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Nav from '../../../components/Nav'
import React, { useRef, useState, useEffect } from "react"
import { 
  BsFillCameraVideoFill, 
  BsFillCameraVideoOffFill,
  BsFillRecordCircleFill,
  BsFillStopCircleFill,
} from 'react-icons/bs'

import { 
  AiFillAudio, 
  AiOutlineAudioMuted,
} from 'react-icons/ai'

import {
  MdOutlineExitToApp,
  MdMeetingRoom,
  MdNoMeetingRoom,
} from 'react-icons/md'

import { useAccount, useSignMessage } from "wagmi"
import { verifyMessage } from "ethers/lib/utils"

import alchemy from '@/alchemy'

import {
  getAccessToken,
  getMessage,
} from "@huddle01/auth"

import {
  useAudio,
  usePeers,
  useRoom,
  useVideo,
  useRecording,
  useLobby,
  useMeetingMachine,
} from "@huddle01/react/hooks"

import { useEventListener } from "@huddle01/react"
import { Audio, Video } from "@huddle01/react/components"
import { useDisplayName } from "@huddle01/react/app-utils"

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export default function UpcomingDetail() {
  const [message, setMessage] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [nftData, setNFTData] = useState<any>();
  const [lobbyStatus, setLobbyStatus] = useState(false);
  const [lobbyAudioStatus, setLobbyAudioStatus] = useState(false);
  const [lobbyVideoStatus, setLobbyVideoStatus] = useState(false);
  const [roomStatus, setRoomStatus] = useState(false);
  const [roomAudioStatus, setRoomAudioStatus] = useState(false);
  const [roomVideoStatus, setRoomVideoStatus] = useState(false);
  const [recordStatus, setRecordStatus] = useState(false);

  const { joinLobby } = useLobby();

  const {
    data: signature,
    isLoading,
    signMessage,
  } = useSignMessage({
    onSuccess(signature, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, signature);
    },
  });

  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  const router = useRouter();
  const {tokenid, creator} = router.query;

    // refs
    const videoRef = useRef<HTMLVideoElement>(null);

    const { state, send } = useMeetingMachine();
  
    // const [displayNameText, setDisplayNameText] = useState("Guest");
  
    const {
      fetchAudioStream,
      produceAudio,
      stopAudioStream,
      stopProducingAudio,
      stream: micStream,
    } = useAudio();
    const {
      fetchVideoStream,
      produceVideo,
      stopVideoStream,
      stopProducingVideo,
      stream: camStream,
    } = useVideo();
    const { joinRoom, leaveRoom } = useRoom();
  
    // Event Listner
    useEventListener("lobby:cam-on", () => {
      if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
    });
  
    const { peers } = usePeers();
  
    const {
      startRecording,
      stopRecording,
      error,
      data: recordingData,
    } = useRecording();
  
    const { setDisplayName, error: displayNameError } = useDisplayName();
  
    useEventListener("room:joined", () => {
      console.log("room:joined");
    });
    useEventListener("lobby:joined", () => {
      console.log("lobby:joined");
    });

    const roomId = 'xlm-rfsp-bmx';

    // Functions to Control the Meet

    const JoinLobby = async () => {
      setLobbyStatus(true);
      if (accessToken) joinLobby(roomId, accessToken);
    };
  
    const LeaveLobby = async () => {
      setLobbyStatus(false);
      send("LEAVE_LOBBY");
    };

    const EnableLobbyAudio = async () => {
      fetchAudioStream();
      setLobbyAudioStatus(true);
    };

    const DisableLobbyAudio = async () => {
      stopAudioStream();
      setLobbyAudioStatus(false);
    };

    const EnableLobbyVideo = async () => {
      fetchVideoStream();
      setLobbyVideoStatus(true);
    };

    const DisableLobbyVideo = async () => {
      stopVideoStream();
      setLobbyVideoStatus(false);
    };

    const JoinRoom = async () => {
      joinRoom();
      setRoomStatus(true);
    };

    const LeaveRoom = async () => {
      leaveRoom();
      setLobbyStatus(false);
      send("LEAVE_LOBBY");
      setRoomStatus(false);
    };

    const EnableRoomAudio = async () => {
      produceAudio(micStream);
      setRoomAudioStatus(true);
    };

    const DisableRoomAudio = async () => {
      stopProducingAudio()
      setRoomAudioStatus(false);
    };

    const EnableRoomVideo = async () => {
      produceVideo(camStream);
      setRoomVideoStatus(true);
    };

    const DisableRoomVideo = async () => {
      stopProducingVideo()
      setRoomVideoStatus(false);
    };

    const StartRecord = async () => {
      startRecording(`${window.location.href}rec/${roomId}`);
      setRecordStatus(true);
    };

    const StopRecord = async () => {
      stopRecording();
      setRecordStatus(false);
    };

    useEffect(() => {
      if (isConnected) {
        getNFTData();
      }
      else {
        window.alert("Wallet Not connected");
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isConnected])
  
    const getNFTData = async () => {
      const nftforOwner = await alchemy.nft.getNftsForOwner(address || '')
      setNFTData(nftforOwner.ownedNfts)
    }

  return (
    <>
      <Head>
        <title>Upcoming Detail Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${poppins.className}`}>
        <Nav />
        {nftData && nftData
          .filter((s: any) => s.rawMetadata?.tokenid === tokenid)
          .map((s: any, i: any) => (
          <div className={styles.ud} key={i}>
            <h2 style={{ textAlign: 'center' }}>{s.title}</h2>
            {lobbyStatus ? (
            <div className={styles.udvidcont}>
              <div className={styles.udvideo}>
                <video ref={videoRef} autoPlay muted></video>
                <div>
                  {Object.values(peers)
                    .filter((peer) => peer.cam)
                    .map((peer) => (
                      <>
                        role: {peer.role}
                        <Video
                          key={peer.peerId}
                          peerId={peer.peerId}
                          track={peer.cam}
                          debug
                        />
                      </>
                    ))}
                  {Object.values(peers)
                    .filter((peer) => peer.mic)
                    .map((peer) => (
                      <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
                    ))}
                </div>
              </div>
              <div className={styles.udreco}>
                {recordStatus ? (
                  <button disabled={stopRecording.isCallable} 
                    onClick={StopRecord}>
                    <BsFillStopCircleFill />STOP
                  </button>
                ) : (
                  <button disabled={!startRecording.isCallable}
                    onClick={StartRecord}
                  >
                    <BsFillRecordCircleFill />START
                    {/* {`START_RECORDING error: ${error}`} */}
                  </button>
                )}
              </div>
              <div className={styles.udleave}>
                <button
                    style={{ background: 'red' }}
                    // disabled={!state.matches("Initialized.JoinedLobby")}
                    onClick={LeaveLobby}
                  >
                    <MdOutlineExitToApp />Leave Session
                </button>
              </div>
              <div className={styles.udcontrols}>
                {/* <input
                  type="text"
                  placeholder="Your Room Id"
                  value={displayNameText}
                  onChange={(e) => setDisplayNameText(e.target.value)}
                />
                <button
                  disabled={!setDisplayName.isCallable}
                  onClick={() => {
                    setDisplayName(displayNameText);
                  }}
                >
                  {`SET_DISPLAY_NAME error: ${displayNameError}`}
                </button> */}
                {roomStatus ? (
                  <>
                    {roomAudioStatus ? (
                      <button
                        disabled={!stopProducingAudio.isCallable}
                        onClick={DisableRoomAudio}
                      >
                        <AiOutlineAudioMuted />Disable Audio
                      </button>
                    ) : (
                      <button
                        disabled={!produceAudio.isCallable}
                        onClick={EnableRoomAudio}
                      >
                        <AiFillAudio />Produce Audio
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {lobbyAudioStatus ? (
                      <button
                        style={{ background: `${!fetchAudioStream.isCallable ? 'red' : ''}` }}
                        disabled={!stopAudioStream.isCallable}
                        onClick={DisableLobbyAudio}
                      >
                        <AiOutlineAudioMuted />Disable Audio
                      </button>
                    ) : (
                      <button
                        style={{ background: `${fetchAudioStream.isCallable ? 'green' : ''}` }}
                        disabled={!fetchAudioStream.isCallable}
                        onClick={EnableLobbyAudio}
                      >
                        <AiFillAudio />Enable Audio
                      </button>
                    )}
                  </>
                )}
                {roomStatus ? (
                  <button
                    style={{ background: `${!leaveRoom.isCallable ? 'red' : ''}` }}
                    disabled={!leaveRoom.isCallable} 
                    onClick={LeaveRoom}>
                    <MdNoMeetingRoom />Leave Room
                  </button>
                ) : (
                  <button disabled={!joinRoom.isCallable} onClick={JoinRoom}>
                    <MdMeetingRoom />Join Room
                  </button>
                )}
                {roomStatus ? (
                  <>
                    {roomVideoStatus ? (
                      <button
                        disabled={!stopProducingVideo.isCallable}
                        onClick={DisableRoomVideo}
                      >
                        <BsFillCameraVideoOffFill />Disable Video
                      </button>
                    ) : (
                      <button 
                        disabled={!produceVideo.isCallable}
                        onClick={EnableRoomVideo}
                      >
                        <BsFillCameraVideoFill />Produce Video
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {lobbyVideoStatus ? (
                      <button
                        style={{ background: `${!fetchVideoStream.isCallable ? 'red' : ''}` }}
                        disabled={!stopVideoStream.isCallable}
                        onClick={DisableLobbyVideo}
                      >
                        <BsFillCameraVideoOffFill />Disable Video
                      </button>
                    ) : (
                      <button
                        style={{ background: `${fetchVideoStream.isCallable ? 'green' : ''}` }}
                        disabled={!fetchVideoStream.isCallable}
                        onClick={EnableLobbyVideo}
                      >
                        <BsFillCameraVideoFill />Enable Video
                      </button>
                    )}
                  </>
                )}      
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px' }}><b>Status :</b> {JSON.stringify(state.value)}</p>
            </div>
            ) : (
              <div className={styles.udcontent}>
                <div className={styles.udcleft}>
                  <Image
                    className={styles.sdimg}
                    src={s.rawMetadata?.image || 'https://ipfs.io/ipfs/QmaSHs4gkn3rSGv73eCNduqHN9WTFoWWLjabXFbpD3Yh6P/0.png'}
                    alt={s.rawMetadata?.title || 'Filter Access NFT'}
                    width={420}
                    height={500}
                    priority
                  />
                </div>
                <div className={styles.udcright}>
                  <h5>{s.description}</h5>
                  <h3>Session Price : {s.rawMetadata.price} ETH</h3>
                  <h3>Duration : {s.rawMetadata.duration} Min</h3>
                  <div className={styles.udcmsg}>
                    {message && !signature && <p>{message}</p>}
                    {signature && !accessToken && <p>{signature}</p>}
                    {accessToken && <p>{accessToken}</p>}
                  </div>
                  <button onClick={async () => {
                      if (address) {
                        const { message: _message } = await getMessage(address);
                        setMessage(_message);
                      } else console.log("no address", { address });
                      }
                    }
                  >
                    Get Message
                  </button>
                  <button onClick={async () => {
                    signMessage({ message });
                    }}
                  >
                    Sign Message
                  </button>
                  <button onClick={async () => {
                      if (signature && address) {
                        const { accessToken: _accessToken } = await getAccessToken(
                          signature,
                          address
                        );
                      console.log({ _accessToken });
                      setAccessToken(_accessToken);
                      }
                    }}
                  >
                    Get Access Token
                  </button>
                  {/* {!joinLobby.isCallable && !joinRoom.isCallable && (
                    <button className={styles.udcbtn} disabled={!initialize.isCallable}
                      onClick={() => {
                        initialize('KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR');
                      }}
                    >
                      Join the Session
                    </button>    
                  )} */}
                  {joinLobby.isCallable && (
                    <button className={styles.udcbtn}
                      disabled={!joinLobby.isCallable}
                      onClick={JoinLobby}
                    >
                      Start the Session
                    </button>
                  )}
                  {joinRoom.isCallable &&
                    <button className={styles.udcbtn}
                    disabled={!state.matches("Initialized.JoinedLobby")}
                    onClick={LeaveLobby}
                  >
                    Stop the Session
                  </button>
                  }
                  <p className={styles.mmsg}><b>Status :</b> {JSON.stringify(state.value)}</p>
                  <h3>{JSON.stringify(state.context.peerId)}</h3>
                </div>
              </div>
            )}
          </div>
        ))
       }
      </main>
    </>
  )
}