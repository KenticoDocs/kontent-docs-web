const express = require('express');
const router = express.Router();
const axios = require('axios');
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async (req, res, next) => {
    let icons = await axios.get('https://cdn.jsdelivr.net/gh/Kentico/kentico-icons/production/icon-variables.less');

    let lines = icons.data.split('\n');
    let css = '';

    for (let i = 0; i < lines.length; i++) {
        let rule = lines[i].split(':')
        if (rule.length === 2) {
            css += `${rule[0] ? rule[0].replace('@', '.') : ''}:before{content:${rule[1] ? rule[1].trim().replace(';', '') : ''}}`;
        }
    }

    res.header('Content-Type', 'text/css');
    res.send(css);
}));

module.exports = router;