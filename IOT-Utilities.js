Array.prototype.indexOfId = function(id) {
  for (var i = 0; i < this.length; i++)
      if (this[i].id === id)
          return i;
  return -1;
}