import {clone} from './scripts/helper.js'
import './scripts/clientStorage'
import { onJSONReceived } from './scripts/onJSONReceived'
import './scripts/clientStorage'

figma.showUI(__html__,{ width: 290, height: 468 })

figma.ui.onmessage = msg => {
  if (msg.type === 'json-received') {
    console.log('MESSAGE: '+msg.type,msg)
    figma.clientStorage.setAsync('json-templator', msg.config)

    onJSONReceived(msg.config.obj)
  }

  if (msg.type === 'img-fill') {
    console.log('MESSAGE: '+msg.type,msg)
    const node = figma.getNodeById(msg.config.nodeID) as GeometryMixin,
    newBytes = msg.config.arr,
    newPaint = clone(node.fills[0])

    newPaint.type = "IMAGE";
    newPaint.scaleMode = "FILL";
      delete newPaint.color;
      delete newPaint.gradientStops;
      delete newPaint.gradientTransform;
    newPaint.imageHash = figma.createImage(newBytes).hash
    node.fills = [newPaint]
  }

}

figma.on("selectionchange", () => {
   console.log("changed") 
})


  // figma.closePlugin()

