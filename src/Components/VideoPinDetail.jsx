import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { Box, Flex, Grid, GridItem, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useColorModeValue } from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import { IoHome, IoPause, IoPlay } from "react-icons/io5";
import { MdForward10, MdFullscreen, MdOutlineReplay10, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { firebaseApp } from "../firebase-config";
import { getSpecificVideo } from "../utils/fetchData";
import logo from "../Asset/img/logo.png";
import Spinner from "./Spinner";

const format = (seconds) => {
    if (isNaN(seconds)) {
        return "00:00";
    }

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")} : ${ss}`
        // 01:02:32
    }

    return `${mm}:${ss}`;
}

const VideoPinDetail = () => {
    const { videoId } = useParams();
    const textColor = useColorModeValue("gray.900", "gray.50");
    //firestore database insrance
    const firestoreDb = getFirestore(firebaseApp);

    const [isLoading, setIsLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setvolume] = useState(0.5);
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);

    // Custom Refernce
    const playerRef = useRef();
    const playerContainer = useRef();

    useEffect(() => {
        if (videoId) {
            setIsLoading(true);
            getSpecificVideo(firestoreDb, videoId).then((data) => {
                setVideoInfo(data);
                setIsLoading(false);
            })
        }
    }, [videoId]);

    useEffect(() => {}, [muted, volume, played]);

    const onvolumechange = (e) => {
        setvolume(parseFloat(e / 100));
        e === 0 ? setMuted(true) : setMuted(false)
    }

    const handleFastRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
    }
    
    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
    }

    const handleProgress = (changeState) => {
        if (!seeking) {
            setPlayed(parseFloat(changeState.played / 100) * 100)
        }
    }

    const handleSeekChange = (e) => {
        setPlayed(parseFloat(e / 100));
    }

    const onSeekMouseDown = () => {
        setSeeking(true)
    }

    const onSeekMouseUp = (e) => {
        setSeeking(false);
        playerRef.current.seekTo(e / 100);
    }

    const currentTime = playerRef.current
        ? playerRef.current.getCurrentTime()
        : "00:00";

    const duration = playerRef.current
        ? playerRef.current.getDuration()
        : "00:00";

    const elapsedTime = format(currentTime);
    const totalDuration = format(duration);

    if (isLoading) return <Spinner />

    return (
        <Flex
            width={"full"}
            height="auto"
            justifyContent={"center"}
            alignItems="center"
            direction={"column"}
            py={2}
            px={4}
        >
            <Flex alignItems={"center"} width="full" my={4}>
                <Link to={"/"}>
                    <IoHome fontSize={25}/>
                </Link>
                <Box width="1px" height={"25px"} bg={"gray.500"} mx={2}></Box>
                <Text
                    color={textColor}
                    fontWeight="semibold"
                    width={"100%"}
                >
                    {videoInfo?.title}
                </Text>
            </Flex>

            {/* Main Grid for video */}
            <Grid templateColumns="repeat(3, 1fr)" gap={2} width="100%">
                <GridItem width={"100%"} colSpan={"2"}>
                    <Flex width={"full"} bg="black" position="relative" ref={playerContainer}>
                        <ReactPlayer
                            ref={playerRef}
                            url = {videoInfo?.videoUrl}
                            width = "100%"
                            height = {"100%"}
                            playing = {isPlaying}
                            muted = {muted}
                            volume = {volume}
                            onProgress = {handleProgress}
                        />
                        {/* Controls for video player */}
                        <Flex 
                            position={"absolute"} 
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            direction="column"
                            justifyContent={"space-between"}
                            alignItems="center"
                            zIndex={1}
                            cursor="pointer"
                        >
                            {/* Play Icon */}
                            <Flex
                                alignItems={"center"}
                                justifyContent="center"
                                direction={"column"}
                                onClick={() => setIsPlaying(!isPlaying)}
                                width="full"
                                height="full"
                            >
                                {!isPlaying && (
                                    <IoPlay fontSize={60} color="#f2f2f2" cursor={"pointer"}/>
                                    )}
                                {/* Progres Controls */}
                            </Flex> 
                            <Flex
                                width={"full"}
                                alignItems="center"
                                direction={"column"}
                                px={4}
                                bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
                            >
                                <Slider 
                                    aria-label="slider-ex-4" 
                                    min={0}
                                    max={100}
                                    value={played * 100}
                                    transition="ease-in-out"
                                    transitionDuration={"0.2"}
                                    onChange={handleSeekChange}
                                    onMouseDown={onSeekMouseDown}
                                    onChangeEnd={onSeekMouseUp}
                                >
                                    <SliderTrack bg="teal.50">
                                        <SliderFilledTrack bg="teal.300"/>
                                    </SliderTrack>
                                    <SliderThumb boxSize={3} bg="teal.300"/>
                                </Slider>

                                {/* Other Player Controls */}
                                <Flex width={"full"} alignItems="center" my={2} gap={10}>
                                    <MdOutlineReplay10 
                                        fontSize={30} 
                                        color={"#f1f1f1"} 
                                        cursor="pointer"
                                        onClick={handleFastRewind}
                                    />
                                    <Box onClick={() => setIsPlaying(!isPlaying)}>
                                        {!isPlaying ? (
                                            <IoPlay 
                                                fontSize={30}
                                                color="#f2f2f2"
                                                cursor={"pointer"}
                                            />
                                        ) : (
                                            <IoPause
                                                fontSize={30}
                                                color="#f2f2f2"
                                                cursor={"pointer"}
                                            />
                                        )}
                                    </Box>
                                    <MdForward10 
                                        fontSize={30} 
                                        color={"#f1f1f1"} 
                                        cursor="pointer"
                                        onClick={handleFastForward}
                                    />

                                    {/* Volume Controls */}
                                    <Flex alignItems={"center"}>
                                        <Box onClick={() => setMuted(!muted)}>
                                            {!muted ? (
                                                <MdVolumeUp
                                                    fontSize={30}
                                                    color="#f1f1f1"
                                                    cursor="pointer"
                                                />
                                            ) : (
                                                <MdVolumeOff
                                                    fontSize={30}
                                                    color="#f1f1f1"
                                                    cursor="pointer"
                                                />
                                            )}
                                        </Box>
                                        <Slider
                                            aria-label="slider-ex-1"
                                            defaultValue={30}
                                            min={0}
                                            max={100}
                                            size="sm"
                                            width={16}
                                            mx={2}
                                            onChangeStart = {onvolumechange}
                                            onChangeEnd = {onvolumechange}
                                        >
                                            <SliderTrack bg="teal.50">
                                                <SliderFilledTrack bg="teal.300"/>
                                            </SliderTrack>
                                            <SliderThumb boxSize={2} bg="teal.300"/>
                                        </Slider>
                                    </Flex>
                                    {/* duration of video */}
                                    <Flex alignItems={"center"} gap={2}>
                                        <Text fontSize={16} color="whitesmoke">{elapsedTime}</Text>
                                        <Text fontSize={16} color="whitesmoke">/</Text>
                                        <Text fontSize={16} color="whitesmoke">{totalDuration}</Text>
                                    </Flex>
                                    <Image src={logo} width={"120px"} ml="auto"/>
                                    <MdFullscreen
                                        fontSize={30}
                                        color="#f1f1f1"
                                        cursor={"pointer"}
                                        onClick={() => {
                                            screenfull.toggle(playerContainer.current)
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </GridItem>
                <GridItem width={"100%"} colSpan={"1"}></GridItem>
            </Grid>
        </Flex>
    )
}

export default VideoPinDetail;