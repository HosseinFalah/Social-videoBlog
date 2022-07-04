import { Alert, AlertTitle } from "@chakra-ui/react";
 
const AlertMsg = ({ status, icon, msg }) => {
    return (
        <Alert status={`${status ? status : "icon"}`}>
            {icon}
            <AlertTitle ml={10}>{msg}</AlertTitle>
        </Alert>
    )
}

export default AlertMsg