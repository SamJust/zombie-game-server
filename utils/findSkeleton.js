module.exports = function findSkeleton (skeletonsArray, skeletonType, integrety) {
  for(let i = 0; i < skeletonsArray.length; i++){
    for (let a = 0; a < skeletonsArray[i].integrety.length; a++) {
      if(skeletonsArray[i].type !== skeletonType) continue;
      if(skeletonsArray[i].integrety[a] === integrety) return { a, i };
    }
  }
}
