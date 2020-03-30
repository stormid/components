module.exports = () => `:root {
        --font-family-default: "Avenir Next W01 Light", Helvetica, "Lucida Grande", sans-serif;
        --font-family-medium: "AvenirNextLTW01-Medium", Helvetica, "Lucida Grande", sans-serif;
        --font-family-bold: "Avenir Next LT W01 Bold", Helvetica, "Lucida Grande", sans-serif;
        --font-family-thin: "Avenir Next W01 Thin", Helvetica, "Lucida Grande", sans-serif;

        --font-size-peta: 2.986rem;
        --line-height-peta: 1.25;
        --font-size-giga: 2.074rem;
        --line-height-giga: 1.25;
        --font-size-mega: 01.728rem;
        --line-height-mega: 1.25;
        --font-size-alpha: 1.44rem;
        --line-height-alpha: 1.25;
        --font-size-gamma: 1rem;
        --line-height-gamma: 1.2;
        --font-size-delta: 0.85rem;
        --line-height-delta: 1.4;
        --font-size-epsilon: 0.694rem;
        --line-height-epsilon: 1.4;

        --baseline: 1.5rem;
        --gutter: 24px;

        --light-grey-1: #f5f5f5;
        --light-grey-2: #e6e6e6;
        --light-grey-3: #cccccc;
        --mid-grey-1: #b3b3b3;
        --mid-grey-2: #999999;
        --mid-grey-3: #808080;
        --dark-grey-1: #666666;
        --dark-grey-3: #323232;
        --teal: #187E81;
        --light-teal: #77b5be;
        --teal-black: #072425;
    }
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    html,
    body {
        height: 100%;
    }
    body {
        background: var(--light-grey-1);
        color: #fff;
        font: 100%/1.4 "AvenirNextLTW01-Regular", Helvetica, "Lucida Grande", sans-serif;
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
    a {
        color: #333;
        text-decoration:underline;
    }
    a:hover {
        text-decoration:none;
    }
    ul {
        padding-left:var(--gutter);
        margin-bottom: var(--baseline);
    }
    li {
        list-style: disc outside;
    }
    h1 {
        font-size: var(--font-size-peta);
        font-family: var(--font-family-default);
        margin-bottom:calc(var(--baseline)/4);
    }
    h2 {
        font-size: var(--font-size-alpha);
        font-family: var(--font-family-medium);
        margin-top:calc(var(--baseline)*2);
        margin-bottom:calc(var(--baseline)/4);
    }
    h3 {
        font-size: var(--font-size-beta);
        font-family: var(--font-family-medium);
        margin-bottom:calc(var(--baseline)/4);
    }
    p {
        margin-bottom:calc(var(--baseline)/2);
    }
    hr {
        content:'';
        display:block;
        width:70px;
        height:4px;
        background-color:var(--light-grey-3);
        margin-top:var(--baseline);
        margin-bottom: var(--baseline);
        border: 0 none;
    }
    .entry-content {
        overflow: none;
        margin: var(--baseline) 0 var(--baseline) 200px;
        max-width: 900px;
        padding: 0 calc(var(--gutter)*2);
        width: calc(100% - 200px);
        color: #333;
    }
    img {
        filter: grayscale(100%);
        position: absolute;
        top: calc(var(--baseline)*2);
        right: calc(var(--baseline)*1.5)
    }
    .nav {
        border-top: 1px solid rgba(255,255,255, .1);
    }
    .nav__item {
        display: block;
        width: 100%;
        text-align: left;
        color: #fff;
        padding: 10px 0 10px 20px;
        text-decoration: none;
        margin: 0;
        border: 0 none;
        font-family: "AvenirNextLTW01-Regular", Helvetica, "Lucida Grande", sans-serif;
        font-size:14px;
        background-color: transparent;
        cursor:pointer;
        border-bottom: 1px solid #2e2e2e;
    }
    .nav__item:hover {
        background-color: #000;
    }
    .nav__item:focus {
        outline: 0 none;
    }
    .nav__item.is--active {
        border-right: 2px solid #fff;
    }
    .markdown-body .highlight pre,
    .markdown-body pre {
        border-left:3px solid var(--light-grey-3);
        background-color: white;
        line-height: 1.45;
        overflow: auto;
        padding: var(--baseline);
        margin-bottom: calc(var(--baseline));
        margin-top: calc(var(--baseline)/2);
    }`;