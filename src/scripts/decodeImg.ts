export const decode = async (canvas, ctx, url) => {
    const image = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject()
      img.src = url
      img.crossOrigin = "anonymous"
    })
    canvas.width = (image as HTMLImageElement).width
    canvas.height = (image as HTMLImageElement).height
    ctx.drawImage((image as HTMLImageElement), 0, 0)
  
    return await new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(new Uint8Array(reader.result as ArrayBuffer))
        }
        reader.onerror = () => reject(new Error('Could not read from blob'))
        reader.readAsArrayBuffer(blob)
      })
    })
  }