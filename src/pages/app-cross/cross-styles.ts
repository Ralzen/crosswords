import { css } from 'lit';

// these styles can be imported from any component
// for an example of how to use this, check /pages/about-about.ts

// Colors Sets
/*
RED
#E97777
#FF9F9F
#FFE6E6

GREEN
#AAC8A7
#C3EDC0
#E9FFC2

BLUE
#8294C4
#ACB1D6
#DBDFEA

*/

export const styles = css`

    .main{
        box-sizing: border-box;
        touch-action: none;
        user-select: none;
    }
    .main-cross {
        width: 100%;
        height: 100%;
        display:flex;
        box-sizing: border-box;
        touch-action: none;
    }
    .back-cross {
        width: 100%;
        height: 100%;
        position:absolute;
        touch-action: none;
    }
    .back-button {
        color: #FFFFFF !important;
    }

    .back-cross.blue {
        background-color:#8294C4;
    }
    .back-cross.green {
        background-color:#AAC8A7;
    }
    .back-cross.red {
        background-color:#D97777;
    }
    .back-cross.yellow {
        background-color:#ECA869;
    }
    .back-cross.purple {
        background-color:#905D9C;
    }
    .paint-canvas {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position:absolute;
        touch-action: none;
    }
    .front-cross {
        width: 100%;
        height: 100%;
        position:absolute;
        display:flex;
        justify-content:center;
        align-items:center;
        touch-action: none;
    }
    .navi-cross {
        width: 100%;
        height: 5%;
        position:absolute;
        display:flex;
        box-sizing: border-box;
        justify-content: space-between;
        pointer-events: none;
    }
    .tools-cross {
        display:flex;
        box-sizing: border-box;
        padding: 20px;
        user-select: none;
        -webkit-user-select: none;
        pointer-events:auto;
    }
    .new-cross {
        display:flex;
        box-sizing: border-box;
        padding: 20px;
        user-select: none;
        -webkit-user-select: none;
        pointer-events:auto;
    }

    .js-color-picker-black{
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: black;
        margin-right: 10px;
    }
    .js-color-picker-blue{
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: blue;
        margin-right: 10px;
    }
    .js-color-picker-gum{
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-image: radial-gradient(#FFFFFF 20%, #777777 20%);
    }

    .loading {
        font-size: 28px;
    }
    cross-box{
        margin-top: 50px;
    }
`;