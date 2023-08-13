import {SettingData, TaskData} from "@/type";

const ffmpegPath = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')
const log = require('electron-log')
const isDevelopment = process.env.NODE_ENV !== 'production'

if (isDevelopment) {
  ffmpeg.setFfmpegPath(ffmpegPath)
} else {
  // see: https://github.com/electron/electron-packager/issues/740
  ffmpeg.setFfmpegPath(ffmpegPath.replace('app.asar', 'app.asar.unpacked'))
}

export const mergeVideoAudio = (videoPath: string, audioPath: string, out: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .audioCodec('copy')
      .videoCodec('copy')
      .on('start', (cmd: any) => {
        log.info(`开始合并音视频：${cmd}`)
      })
      .on('end', () => {
        resolve('end')
      })
      .on('error', (err: any) => {
        reject(err)
      })
      .save(out)
  })
}

export const convertToAudio = (fullVideoPath: string, out: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(fullVideoPath)
      // 最常用的 MP3 编码库
      .audioCodec('libmp3lame')
      // 禁止视频流
      .noVideo()
      // 设置音频质量，0表示最高质量
      .audioQuality(0)
      .on('start', (cmd: any) => {
        log.info(`开始音频转码：${cmd}`)
      })
      .on('end', () => {
        resolve('end')
      })
      .on('error', (err: any) => {
        reject(err)
      })
      .save(out)
  })
}
