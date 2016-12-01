export function formatSecond(second){
  return second < 60 ? `0:${second}` : `${Math.round(second / 60)}:${new Array(2).join('0').concat(second % 60).slice(-2)}`
}

 