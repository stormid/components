module.exports = () => {
    return `* {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    html,
    body {
        height: 100%;
    }
    body {
        background:#ffffff;
        color:#ffffff;
        font:100%/1.4 "AvenirNextLTW01-Regular", Helvetica, "Lucida Grande", sans-serif;
        font-display: swap;
    }
    .header {
        position: fixed;
        background-color: #161616;
        top:0;
        left:0;
        bottom: 0;
        height:100%;
        overflow-y: auto;
        padding-top:38px;
        width: 200px;
    }
    .logo {
        position:relative;
        margin:0 0 20px 20px;
    }
    .logo__subtitle {
        position:relative;
        left:0;
        z-index:1;
        display:inline-block;
        background-color:#161616;
        text-transform: uppercase;
        font-size: 13px;
    } 
    .iframe {
        position: fixed;
        top:0;
        left:200px;
        right:0;
        bottom: 0;
        height:100%;
        border:0 none;
        width: calc(100% - 200px);
    }
    .button:first-of-type {
        border-top: 1px solid rgba(255,255,255, .1);
    }
    .button {
        display: block;
        width: 100%;
        text-align: left;
        color: #fff;
        padding: 10px 0 10px 20px;
        margin: 0;
        border: 0 none;
        font-family: "AvenirNextLTW01-Regular", Helvetica, "Lucida Grande", sans-serif;
        font-size:14px;
        background-color: transparent;
        cursor:pointer;
        border-bottom: 1px solid rgba(255,255,255, .1);
    }
    .button:focus {
        outline: 0 none;
    }
    .button.is--active {
        border-right: 2px solid #fff;
    }`
};