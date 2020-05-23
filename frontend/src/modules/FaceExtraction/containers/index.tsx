import React from 'react'
import { Flex } from '@icstark/ui'
import constants from '../../../config/constants'

function FaceExtraction() {
  const videoRef: any = React.createRef()
  const canvasRef: any = React.createRef()
  const g: any = global
  const { SSD_MOBILENETV1, TINY_FACE_DETECTOR } = constants
  const [selectedFaceDetector, setSelectedFaceDetector] = React.useState(
    SSD_MOBILENETV1
  )
  const [minConfidence, setMinConfidence] = React.useState(0.5)
  const [inputSize, setInputSize] = React.useState(512)
  const [scoreThreshold, setScoreThreshold] = React.useState(0.5)

  console.log(global)
  function getCurrentFaceDetectionNet() {
    if (selectedFaceDetector === SSD_MOBILENETV1) {
      return g.faceapi.nets.ssdMobilenetv1
    }
    if (selectedFaceDetector === TINY_FACE_DETECTOR) {
      return g.faceapi.nets.tinyFaceDetector
    }
  }
  function getFaceDetectorOptions() {
    return selectedFaceDetector === SSD_MOBILENETV1
      ? new g.faceapi.SsdMobilenetv1Options({ minConfidence })
      : new g.faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  }
  function updateTimeStats(timeInMs: any) {
    console.log('timeInMs', timeInMs)

    // forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    // const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    // $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    // $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
  }

  React.useEffect(() => {
    let x = null
    if (!getCurrentFaceDetectionNet().params) {
      getCurrentFaceDetectionNet().load('/')
    }
  }, [selectedFaceDetector])

  React.useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(async function (stream: any) {
          videoRef.current.srcObject = stream
          setSelectedFaceDetector(TINY_FACE_DETECTOR)
          const options = getFaceDetectorOptions()

          const ts = Date.now()
          const videoEl = document.getElementById('inputVideo')
          const canvasEl = document.getElementById('overlay')
          console.log('jjjjj', videoEl, canvasEl)
          g.changeInputSize(128)
          const result = await g.faceapi.detectSingleFace(videoEl, options)

          updateTimeStats(Date.now() - ts)

          console.log('dims', result)
          if (result) {
            const canvas = canvasEl
            const dims = g.faceapi.matchDimensions(canvas, videoEl, true)

            g.faceapi.draw.drawDetections(
              canvas,
              g.faceapi.resizeResults(result, dims)
            )
          }
        })
        .catch(function (err: any) {
          console.error('Error streaming webcam. ', err)
          alert('Video is streaming at multiple tabs or browsers')
        })
    }
  }, [])

  return (
    <Flex wrap alignItemsFlexStart>
      <Flex column alignItemsFlexStart>
        <select
          style={{ marginBottom: 15 }}
          value={selectedFaceDetector}
          onChange={(e: any) => setSelectedFaceDetector(e.target.value)}
        >
          <option value={SSD_MOBILENETV1}>SSD Mobilenet V1</option>
          <option value={TINY_FACE_DETECTOR}>Tiny Face Detector</option>
        </select>

        <div>
          <video autoPlay={true} id="inputVideo" ref={videoRef}></video>
          <canvas id="overlay" ref={canvasRef} />
        </div>
      </Flex>
    </Flex>
  )
}

export default FaceExtraction
