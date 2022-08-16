import styled from "styled-components";

export const FixedDiv = styled.div`
    position: fixed;
    bottom: ${props=>props.show ? '-150px' : '20px'};
    left: 20px;
    width : 130px;
    height: 130px;
    z-index: 100;
    cursor: pointer;
    transition: all 1s;
` 