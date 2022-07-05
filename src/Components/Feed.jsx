import { SimpleGrid } from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseApp } from "../firebase-config";
import { getAllFeeds } from "../utils/fetchData";
import Spinner from "./Spinner";
import VideoPin from "./VideoPin";

const Feed = () => {
    // firestore database instance
    const firestoreDb = getFirestore(firebaseApp);

    const [feeds, setFeeds] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        getAllFeeds(firestoreDb).then(data => {
            setFeeds(data);
            setLoading(false);
        })
    }, [])
    
    if (loading) return <Spinner msg={"Loading Your Feeds"}/>
    
    return (
        <SimpleGrid 
            minChildWidth="300px" 
            spacing="15px" 
            width="full"
            autoColumns={"max-content"} 
            px="2" 
            overflowX={"hidden"}
        >
            {feeds &&
                feeds.map((data) => (
                    <VideoPin key={data.id} maxWidth={420} heigth="80px" data={data}/>
                ))
            }
        </SimpleGrid>
    )
}

export default Feed;