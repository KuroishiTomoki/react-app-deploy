import { PrimaryButton } from "./atom/PrimaryButton";

export const RegisterButton = (props) =>{

    const {onRegister} = props;

    return(
        <>
            <PrimaryButton onClick={() => onRegister()}>登録</PrimaryButton>            
        </>
    )
} 