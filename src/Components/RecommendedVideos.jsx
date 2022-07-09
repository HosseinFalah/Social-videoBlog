import { SimpleGrid } from "@chakra-ui/react";
import VideoPin from "./VideoPin";

const RecommendedVideos = ({feeds}) => {
    return (
        <SimpleGrid
            minChildWidth="300px"
            spacing="15px"
            width="full"
            autoColumns={"max-content"}
            overflowX={"hidden"}
        >
            {feeds && 
                feeds.map((data) => (
                    <VideoPin 
                        key={data.id} 
                        maxWidth={420} 
                        height="80px"
                        data={data}
                    />
                ))
            }
        </SimpleGrid>
    )
}

export default RecommendedVideos