export const clone = (val) => {
    return JSON.parse(JSON.stringify(val))
  }
  
export const findBrackets = str => {
  
    let found = [],
    rxp = /{([^}]+)}/g,
    curMatch;
  
    while( curMatch = rxp.exec( str ) ) {
      found.push( curMatch[1] );
    }
  
    if(found.length>0){
      return found
    }else{
      return null
    }
    
  }