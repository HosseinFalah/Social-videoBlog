import { Box, Flex, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Category = ({data}) => {
    const bg = useColorModeValue("gray.600", "gray.300");
    return (
        <Flex cursor={"pointer"} my="5">
            <Link to={`/category/${data.name}`}>
                <Tooltip 
                    hasArrow 
                    placement="right" 
                    closeDelay={300}
                    arrowSize={5}
                    label={data.name}
                    bg={bg}
                >
                    <Box>{data.iconSrc}</Box>
                </Tooltip>
            </Link>
        </Flex>
    )
}

export default Category;