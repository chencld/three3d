/*
 * @Author: lidan6
 * @Date: 2022-02-07 15:41:44
 * @LastEditors: lidan6
 * @LastEditTime: 2022-02-24 15:23:12
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./"
})
