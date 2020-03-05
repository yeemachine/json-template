// Gets saved config from previous session
figma.clientStorage.getAsync('json-templator').then((res)=>{
    // res.command = figma.command
    if(res){
      figma.ui.postMessage({'lastSaved':res})
    }
  }).catch(err => {
    console.log(err)
  })