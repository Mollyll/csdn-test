/*
import Vue from 'vue'

import app from './app.vue'

new Vue({
    el: '#root',
    render: (h) => h(app)
})*/

console.log('webpack success!')
import React from 'react'
import { render } from 'react-dom'

render(
    <h1>Hello, React!</h1>,
    document.getElementById('root')
)
