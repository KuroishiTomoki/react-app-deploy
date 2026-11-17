import styled from "styled-components";
import { BaseButton } from "./BaseButton";

export const PrimaryButton = (props) => {
    const { children, onClick, bgColor = "blue" } = props;

    return(
        <>
            <SButton onClick={onClick} $bgColor={bgColor}>{children}</SButton>
        </>
    )
} 


const SButton = styled(BaseButton)`
    background-color: ${(props) => props.$bgColor};
    align-self: center; 
`