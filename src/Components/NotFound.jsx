import { Flex, Image, Text } from "@chakra-ui/react";
import notFoundSvg from "../Asset/img/notfound.svg"

const NotFound = () => {
    return (
        <Flex
            width={"full"}
            justifyContent="center"
            alignItems={"center"}
            direction="column"
        >
            <Image src={notFoundSvg} width={600}/>
            <Text fontSize={40} fontWeight="semibold" fontFamily={"cursive"}>Not Found</Text>
        </Flex>
    )
}

export default NotFound