import './styles/global.css'
import './styles/custom.css'
import './global.js'
import {GetJSON,stringKeyToJSON} from './scripts/JSONRequest'
import {decode} from './scripts/decodeImg'

const canvas = document.querySelector('canvas'),
ctx = canvas.getContext("2d"),
JSONInput = document.querySelector('#JSONInput'),
KeyInput = document.querySelector('#KeyInput')

onmessage = async (event) => {
  let message = event.data.pluginMessage
  if(message.lastSaved){
    //Preloads Previous Config  
    console.log(message)
    console.log(message.lastSaved.url)

    let JSONView = document.querySelector('#json_view')
    JSONView.innerHTML = JSON.stringify(message.lastSaved.obj, undefined, 2);
    (JSONInput as HTMLInputElement).value = message.lastSaved.url;
    (KeyInput as HTMLInputElement).value = message.lastSaved.key;
  }
  if(message.decodeImg){
    
    let url = message.decodeImg.url+"?lastmod="+Date.now() //attatch timestamp to url to avoid cache CORS errors
    let config = {
      nodeID:message.decodeImg.nodeID,
      arr:null
    }

    decode(canvas,ctx,url).then(res=>{
      config.arr = res
      parent.postMessage({ pluginMessage: { type: 'img-fill', config } }, '*')
    })
   
  }
}

//Submit Click Event
document.getElementById('submit').onclick = async () => {
 
  let JSONValue = (JSONInput as HTMLInputElement).value
  let JSONData = await GetJSON(JSONValue)
  let KeyValue = (KeyInput as HTMLInputElement).value
  let JSONObj = stringKeyToJSON(JSONData,KeyValue) //final parseable json object

  // let JSONView = document.querySelector('#json_view')
  // JSONView.innerHTML = JSON.stringify(JSONObj, undefined, 2);

  let config = {
    url:JSONValue, 
    data:JSONData,
    key:KeyValue,
    obj:JSONObj
  }

  //Pass JSON Object back to main code
  parent.postMessage({ pluginMessage: { type: 'json-received', config } }, '*')

}

