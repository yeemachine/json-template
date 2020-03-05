import {stringKeyToJSON} from './JSONRequest'
import {findBrackets} from './helper.js'

export const onJSONReceived = (data) => {
    //Saves user data
    const currentSelection = figma.currentPage.selection
    const taggedNodes = [];

    const traverse =  (node, index) => {
      if("children" in node){
        node.children.forEach((e)=>{
          traverse(e, index)
        })
      }else{
        let nodeKeys = findBrackets(node.name)
        if(nodeKeys){
          let obj = {
            name:node.name,
            keys:nodeKeys,
            type:node.type,
            node:node,
            index:index
          }
          taggedNodes.push(obj) //recursively finds nodes with {}
        }

      }
    }

    if(figma.currentPage.selection.length === 1){
        console.log(currentSelection[0])
        let interations = data.length;
        const newSelections = [currentSelection[0]]

        for (let i = 1; i < interations; i++){
          let clonedSelection = currentSelection[0].clone()
          clonedSelection.x = currentSelection[0].x + currentSelection[0].width*i + 10*i 
          clonedSelection.y = currentSelection[0].y
          newSelections.push(clonedSelection)
        }

        newSelections.forEach((e,i)=>{
          traverse(e,i)
        })
        
    }else{
      currentSelection.forEach((e,i)=>{
        traverse(e,i)
      })
    }
    

    taggedNodes.forEach(async(e)=>{
      if(e.index < data.length){
        console.log(e,data)
        if(e.type === 'TEXT'){
          let newText = e.name // node name becomes text base
          let fonts = e.node.getRangeFontName(0,1) // get first used font
  
          e.keys.forEach(f=>{
            var re = new RegExp('{'+f+'}',"g");
            let value = stringKeyToJSON(data[e.index],f)
            newText = newText.replace(re,value) // replaces {keys} with strings
          })
          
          await figma.loadFontAsync(fonts).then(j=>{
            e.node.characters = newText // sets new text into node
          })
  
        }
        if(e.type === "RECTANGLE" || e.type === "ELLIPSE" || e.type === "POLYGON"){
          let value = stringKeyToJSON(data[e.index],e.keys[0])
          figma.ui.postMessage({'decodeImg':{
            url:value,
            nodeID:e.node.id
          }});
        }

      }

    })

  }