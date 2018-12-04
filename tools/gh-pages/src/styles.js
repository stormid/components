const STYLES = {
    FONT_FAMILY: '"AvenirNextLTW01-Regular", Helvetica, "Lucida Grande", sans-serif',
    HEADER_WIDTH: '200px'
};

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
        font:100%/1.4 ${STYLES.FONT_FAMILY};
    }
    .header {
        position: fixed;
        background-color: #161616;
        top:0;
        left:0;
        bottom: 0;
        height:100%;
        overflow-y: auto;
        padding-top:25px;
        width: ${STYLES.HEADER_WIDTH};
    }
    .logo {
        position:relative;
        margin:0 0 20px 20px;
    }
    .logo:before {
        position:absolute;
        left:0;
        bottom:14px;
        right:35px;
        content:'';
        height:1px;
        display:block;
        background-color:#fff;
    } 
    .logo__subtitle {
        position:relative;
        left:20px;
        z-index:1;
        display:inline-block;
        padding:5px;
        background-color:#161616;
        text-transform: uppercase;
        font-size: 13px;
    } 
    .iframe {
        position: fixed;
        top:0;
        left:${STYLES.HEADER_WIDTH};
        right:0;
        bottom: 0;
        height:100%;
        border:0 none;
        width: calc(100% - ${STYLES.HEADER_WIDTH});
    }
    .button:first-of-type {
        border-top: 1px solid rgba(255,255,255, .2);
    }
    .button {
        display: block;
        width: 100%;
        text-align: left;
        color: #fff;
        padding: 10px 0 10px 25px;
        margin: 0;
        border: 0 none;
        font-family: ${STYLES.FONT_FAMILY};
        font-size:14px;
        background-color: transparent;
        cursor:pointer;
        border-bottom: 1px solid rgba(255,255,255, .2);
    }
    .button:focus {
        outline: 0 none;
    }
    .button.is--active {
        border-right: 2px solid #fff;
    }`
};