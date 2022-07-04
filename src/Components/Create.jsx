import {  Button, Flex, FormLabel, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoCheckmark, IoChevronDown, IoCloudUpload, IoLocation, IoTrash, IoWarning } from "react-icons/io5";
import { categories } from "../data";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

// prettier-ignore
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { firebaseApp } from "../firebase-config";
import AlertMsg from "./AlertMsg";
import { fetchUser } from "../utils/fetchUser";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import TextEditor from "./TextEditor";

const Create = () => {
    const { colorMode } = useColorMode();
    const textColor = useColorModeValue("gray.900", "gray.50");

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Choose as category");
    const [location, setLocation] = useState("");
    const [videoAsset, setVideoAsset] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(5);
    const [alert, setAlert] = useState(false);
    const [alertStatus, setAlertStatus] = useState("");
    const [alertMsg, setAlertMsg] = useState("");
    const [alertIcon, setAlertIcon] = useState("");
    const [description, setDescription] = useState("");

    const [userInfo] = fetchUser();
    const navigate = useNavigate();

    const storage = getStorage(firebaseApp);
    const fireStoreDb = getFirestore();
    
    const uploadImage = (e) => {
        setLoading(true)
        const videoFile = e.target.files[0];
        const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on("state_changed", (snapshot) => {
            const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(uploadProgress);
            setProgress(uploadProgress)
        }, (error) => {
            console.log(error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setVideoAsset(downloadURL);
                setLoading(false);
                setAlert(true);
                setAlertStatus("success");
                setAlertIcon(<IoCheckmark fontSize={25}/>);
                setAlertMsg("Your Video Is Uploaded To Our Server");
                setTimeout(() => {
                    setAlert(false)
                }, 4000)
            });
        })
    }

    const deleteImage = () => {
        const deleteRef = ref(storage, videoAsset)
        deleteObject(deleteRef)
            .then(() => {
                setVideoAsset(null)
                setAlert(true);
                setAlertStatus("error");
                setAlertIcon(<IoWarning fontSize={25}/>);
                setAlertMsg("Your Video Was From Our Server");
                setTimeout(() => {
                    setAlert(false)
                }, 4000)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getDescriptionValue = (event, editor) => {
        const data = editor.getData();
        setDescription(data)

    }

    useEffect(() => {}, [title, location, description, category])

    const uploadDetails = async () => {
        try{
            setLoading(true);
            if (title.trim() && category && location.trim() && videoAsset) {
                const data = {
                    id: `${Date.now()}`,
                    title: title,
                    userId: userInfo?.uid,
                    category: category,
                    location: location,
                    videoUrl: videoAsset,
                    description: description
                }
                await setDoc(doc(fireStoreDb, "videos", `${Date.now()}`), data)
                setLoading(false);
                navigate("/", { replace: true });
            } else {

                setAlert(true);
                setAlertStatus("error");
                setAlertIcon(<IoWarning fontSize={25}/>);
                setAlertMsg("Required Fields are Missing!")
                setTimeout(() => {
                    setAlert(false);
                }, 4000)
                setLoading(false)
            }
        } catch(error){
            console.log(error);
        }
    }

    return (
        <Flex
            justifyContent={"center"}
            alignItems="center"
            width={"full"}
            minHeight="100vh"
            padding={10}
        >
            <Flex
                width={"80%"}
                height="full"
                border={"1px"}
                borderColor="gray.300"
                borderRadius={"md"}
                p="4"
                flexDirection={"column"}
                alignItems="center"
                justifyContent={"center"}
                gap={2}
            >
                {alert && (
                    <AlertMsg 
                        status={alertStatus} 
                        msg={alertMsg} 
                        icon={alertIcon}
                    />
                )}
                <Input
                    variant={"flushed"}
                    placeholder="Title"
                    focusBorderColor="gray.400"
                    isRequired
                    errorBorderColor="red"
                    type={"text"}
                    _placeholder={{color: "gray.500"}}
                    fontSize={20}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Flex
                    justifyContent={"space-between"}
                    width="full"
                    alignItems={"center"}
                    gap={8}
                    my={4}
                >
                    <Menu>
                        <MenuButton
                            width={"full"}
                            colorScheme="blue" 
                            as={Button}
                            rightIcon={<IoChevronDown fontSize={15}/>}   
                        >
                            {category}
                        </MenuButton>
                        <MenuList zIndex={101} width={"sm"} shadow="xl">
                            {categories && 
                                categories.map(data => (
                                    <MenuItem 
                                        key={data.id}
                                        _hover={{bg: "blackAlpha.300"}}
                                        fontSize={10}
                                        px={4}
                                        onClick={() => setCategory(data.name)}
                                    >
                                        {data.iconSrc}{""}
                                        <Text fontSize={15} ml={4}>
                                            {data.name}
                                        </Text>
                                    </MenuItem>
                                ))
                            }
                        </MenuList>
                    </Menu>
                    <InputGroup>
                        <InputLeftElement
                        pointerEvents="none"
                        children={
                            <IoLocation
                                fontSize={20}
                                color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`} 
                            />
                        }
                    />
                        <Input
                            variant={"flushed"}
                            placeholder="Location"
                            focusBorderColor="gray.400"
                            isRequired
                            errorBorderColor="red"
                            type={"text"}
                            _placeholder={{color: "gray.500"}}
                            fontSize={20}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}/>
                    </InputGroup>
                </Flex>

                {/* Upload File */}
                <Flex
                    border={"1px"}
                    borderColor="gray.500"
                    height={"400px"}
                    borderStyle="dashed"
                    width="full"
                    borderRadius={"md"}
                    overflow="hidden"
                    position={"relative"}
                >
                    {!videoAsset ? (
                        <FormLabel width="full">
                            <Flex
                                direction={"column"}
                                alignItems="center"
                                justifyContent={"center"}
                                height="full"
                                width={"full"}
                            >
                                <Flex
                                    direction={"column"}
                                    alignItems="center"
                                    justifyContent={"center"}
                                    height="full"
                                    width={"full"}
                                    cursor="pointer"
                                >
                                    {loading ? (
                                        <Spinner msg={"Uploading Your Video"} progress={progress}/>
                                    ) : (
                                        <>
                                            <IoCloudUpload
                                                fontSize={30}
                                                color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`}
                                            />
                                            <Text mt={5} fontSize={20} color={textColor}>
                                                Click To Upload
                                            </Text>
                                        </>
                                    )}
                                </Flex>
                            </Flex>
                            {!loading && (
                                <input
                                    type={"file"}
                                    name="upload-image"
                                    onChange={uploadImage}
                                    style={{width: 0, height: 0}}
                                    accept="video/mp4, video/x-m4v,video/*"
                                />
                            )}
                        </FormLabel>
                    ) : (
                        <Flex
                            width={"full"}
                            height="full"
                            alignContent={"center"}
                            alignItems={"center"}
                            bg="black"
                            position={"relative"}
                        >
                            <Flex
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"40px"}
                                height="40px"
                                rounded="full"
                                bg={"red"}
                                top={5}
                                right={5}
                                position={"absolute"}
                                cursor={"pointer"}
                                zIndex={10}
                                onClick={deleteImage}
                            >
                                <IoTrash fontSize={20} color="white"/>
                            </Flex>
                            <video
                                src={videoAsset}
                                controls
                                style={{width: "100%", height: "100%"}}
                            />
                        </Flex>
                    )}
                </Flex>
                <TextEditor getDescriptionValue={getDescriptionValue}/>
                <Button
                    isLoading={loading}
                    loadingText="Uploading"
                    colorScheme={"linkedin"}
                    variant={`${loading ? "outline" : "solid"}`}
                    width={"xl"}
                    _hover={{shadow: "lg"}}
                    fontSize={20}
                    onClick={() => uploadDetails()}
                >Upload</Button>
            </Flex>
        </Flex>
    )
}

export default Create