import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { IoSearch } from "react-icons/io5"

const Search = () => {
    return (
        <>
            <InputGroup mx={6} width="60vw">
                <InputLeftElement
                    pointerEvents="none"
                    children={<IoSearch fontSize={25}/>}
                />
                <Input 
                    type="text"
                    placeholder="Search..."
                    fontSize={18}
                    fontWeight="medium"
                    variant={"filled"}
                />
            </InputGroup>
        </>
    )
}

export default Search