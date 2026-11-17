import { PrimaryButton } from "./atom/PrimaryButton";
import styled from "styled-components";

export const Log = (props) => {

    const {records, onDelete} = props;

    return (
        <>  
            {records.map((record, index) => {
                return (
                    <SContainer key={index}>
                        {record.title} {record.time}時間
                        <PrimaryButton onClick={onDelete}>削除</PrimaryButton>
                    </SContainer>
                )
            })} 
        </>
    )
}

const SContainer = styled.div`
    display:flex;
    align-items:center;
    gap:16px;
    justify-content: center; 
    margin-top:4px;
`
